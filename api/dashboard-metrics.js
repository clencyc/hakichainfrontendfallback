/**
 * Dashboard API Endpoints
 * Provides metrics data for external dashboard integration
 */

import express from 'express';
import cors from 'cors';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

// Enable CORS for dashboard requests
router.use(cors({
  origin: process.env.DASHBOARD_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Middleware to authenticate dashboard API requests
const authenticateDashboard = async (req, res, next) => {
  try {
    const apiKey = req.headers.authorization?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    // Validate API key (you should store valid keys in your database)
    const validApiKey = process.env.DASHBOARD_API_KEY || 'haki_dash_dev_key_123';
    
    if (apiKey !== validApiKey) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Apply authentication to all routes
router.use(authenticateDashboard);

// Get summary metrics for all services or specific service
router.get('/summary', async (req, res) => {
  try {
    const { service = 'all', timeRange = '30d', startDate, endDate } = req.query;
    
    // Calculate date range
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : (() => {
      const date = new Date();
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      date.setDate(date.getDate() - days);
      return date;
    })();

    // Build query
    let query = supabase
      .from('metrics')
      .select('*')
      .gte('timestamp', start.toISOString())
      .lte('timestamp', end.toISOString());

    if (service !== 'all') {
      query = query.eq('service', service);
    }

    const { data, error } = await query.order('timestamp', { ascending: false });

    if (error) throw error;

    // Aggregate metrics by service
    const aggregated = aggregateMetrics(data || []);
    
    res.json({
      success: true,
      data: aggregated,
      metadata: {
        timeRange: { start, end },
        totalRecords: data?.length || 0
      }
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get metrics for a specific service
router.get('/service/:serviceName', async (req, res) => {
  try {
    const { serviceName } = req.params;
    const { timeRange = '30d' } = req.query;
    
    // Validate service name
    const validServices = ['haki_draft', 'haki_reviews', 'haki_lens', 'haki_reminder', 'haki_bot'];
    if (!validServices.includes(serviceName)) {
      return res.status(400).json({ error: 'Invalid service name' });
    }

    // Calculate date range
    const end = new Date();
    const start = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    start.setDate(start.getDate() - days);

    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .eq('service', serviceName)
      .gte('timestamp', start.toISOString())
      .lte('timestamp', end.toISOString())
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Format for dashboard consumption
    const serviceMetrics = formatServiceMetrics(serviceName, data || []);
    
    res.json({
      success: true,
      service: serviceName,
      metrics: serviceMetrics,
      metadata: {
        timeRange: { start, end },
        recordCount: data?.length || 0
      }
    });

  } catch (error) {
    console.error('Service metrics API error:', error);
    res.status(500).json({ error: 'Failed to fetch service metrics' });
  }
});

// Get real-time metrics (last 24 hours)
router.get('/realtime', async (req, res) => {
  try {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .gte('timestamp', last24Hours.toISOString())
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      metadata: {
        since: last24Hours,
        recordCount: data?.length || 0
      }
    });

  } catch (error) {
    console.error('Realtime metrics API error:', error);
    res.status(500).json({ error: 'Failed to fetch realtime metrics' });
  }
});

// Get top performing metrics
router.get('/top-metrics', async (req, res) => {
  try {
    const { limit = 10, days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const { data, error } = await supabase
      .rpc('get_top_performing_metrics', {
        p_limit: parseInt(limit),
        p_days: parseInt(days)
      });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      metadata: {
        period: `${days} days`,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Top metrics API error:', error);
    res.status(500).json({ error: 'Failed to fetch top metrics' });
  }
});

// Get daily summary
router.get('/daily-summary', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const { data, error } = await supabase
      .from('daily_metrics_summary')
      .select('*')
      .limit(parseInt(days))
      .order('date', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      metadata: {
        days: parseInt(days)
      }
    });

  } catch (error) {
    console.error('Daily summary API error:', error);
    res.status(500).json({ error: 'Failed to fetch daily summary' });
  }
});

// Export metrics (for bulk data transfer)
router.get('/export', async (req, res) => {
  try {
    const { service, format = 'json', startDate, endDate } = req.query;
    
    // Build query
    let query = supabase.from('metrics').select('*');
    
    if (service && service !== 'all') {
      query = query.eq('service', service);
    }
    
    if (startDate) {
      query = query.gte('timestamp', startDate);
    }
    
    if (endDate) {
      query = query.lte('timestamp', endDate);
    }

    const { data, error } = await query.order('timestamp', { ascending: true });

    if (error) throw error;

    if (format === 'csv') {
      const csv = convertToCSV(data || []);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=hakichain-metrics.csv');
      res.send(csv);
    } else {
      res.json({
        success: true,
        data: data || [],
        metadata: {
          exportDate: new Date().toISOString(),
          recordCount: data?.length || 0
        }
      });
    }

  } catch (error) {
    console.error('Export API error:', error);
    res.status(500).json({ error: 'Failed to export metrics' });
  }
});

// Helper functions
function aggregateMetrics(rawMetrics) {
  const aggregated = {};

  // Group by service
  const serviceGroups = rawMetrics.reduce((groups, metric) => {
    if (!groups[metric.service]) {
      groups[metric.service] = [];
    }
    groups[metric.service].push(metric);
    return groups;
  }, {});

  // Aggregate each service
  Object.keys(serviceGroups).forEach(service => {
    const serviceMetrics = serviceGroups[service];
    aggregated[service] = aggregateServiceMetrics(serviceMetrics);
  });

  return aggregated;
}

function aggregateServiceMetrics(metrics) {
  const aggregated = {
    usage: {},
    engagement: {},
    outcome: {}
  };

  metrics.forEach(metric => {
    const { metric_type, metric_name, value } = metric;
    
    if (!aggregated[metric_type][metric_name]) {
      aggregated[metric_type][metric_name] = {
        total: 0,
        count: 0,
        average: 0,
        values: []
      };
    }

    const metricData = aggregated[metric_type][metric_name];
    metricData.total += parseFloat(value);
    metricData.count += 1;
    metricData.values.push(parseFloat(value));
    metricData.average = metricData.total / metricData.count;
  });

  return aggregated;
}

function formatServiceMetrics(service, rawMetrics) {
  const aggregated = aggregateServiceMetrics(rawMetrics);
  
  // Convert to dashboard-friendly format
  const formatted = {
    usage: [],
    engagement: [],
    outcome: []
  };

  Object.entries(aggregated).forEach(([type, metrics]) => {
    Object.entries(metrics).forEach(([name, data]) => {
      formatted[type].push({
        name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        key: name,
        value: type === 'usage' ? data.total : data.average,
        total: data.total,
        average: data.average,
        count: data.count,
        change: calculateChange(data.values), // Simple trend calculation
        unit: getMetricUnit(name)
      });
    });
  });

  return formatted;
}

function calculateChange(values) {
  if (values.length < 2) return 0;
  
  const recent = values.slice(-7); // Last 7 values
  const previous = values.slice(-14, -7); // Previous 7 values
  
  if (previous.length === 0) return 0;
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
  
  return previousAvg === 0 ? 0 : ((recentAvg - previousAvg) / previousAvg) * 100;
}

function getMetricUnit(metricName) {
  if (metricName.includes('time') || metricName.includes('duration')) return 'minutes';
  if (metricName.includes('rate') || metricName.includes('percentage')) return '%';
  if (metricName.includes('score') || metricName.includes('rating')) return '/5';
  return '';
}

function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(value => 
      typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    ).join(',')
  );
  
  return [headers, ...rows].join('\n');
}

export default router;
