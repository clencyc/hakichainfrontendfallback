import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Middleware to authenticate dashboard API requests
const authenticateDashboard = async (req: any) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  
  if (!apiKey) {
    throw new Error('API key required');
  }

  // Validate API key (you should store valid keys in your database)
  const validApiKey = process.env.DASHBOARD_API_KEY || 'haki_dash_dev_key_123';
  
  if (apiKey !== validApiKey) {
    throw new Error('Invalid API key');
  }
};

function aggregateMetrics(data: any[]) {
  const serviceGroups: any = {};
  
  data.forEach(metric => {
    const { service } = metric;
    if (!serviceGroups[service]) {
      serviceGroups[service] = [];
    }
    serviceGroups[service].push(metric);
  });

  const aggregated: any = {};
  Object.keys(serviceGroups).forEach(service => {
    const serviceMetrics = serviceGroups[service];
    aggregated[service] = aggregateServiceMetrics(serviceMetrics);
  });

  return aggregated;
}

function aggregateServiceMetrics(metrics: any[]) {
  const aggregated: any = {
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

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Authenticate request
    await authenticateDashboard(req);

    if (req.method === 'GET') {
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
      
      return res.status(200).json({
        success: true,
        data: aggregated,
        metadata: {
          timeRange: { start, end },
          totalRecords: data?.length || 0
        }
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error: any) {
    console.error('Dashboard API error:', error);
    
    if (error.message === 'API key required') {
      return res.status(401).json({ error: 'API key required' });
    }
    
    if (error.message === 'Invalid API key') {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    return res.status(500).json({ error: 'Failed to fetch metrics' });
  }
}
