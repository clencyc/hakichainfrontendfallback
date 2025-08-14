/**
 * WebSocket server for real-time metrics streaming to dashboard
 */

import { WebSocketServer } from 'ws';
import { supabase } from '../lib/supabase.js';

class MetricsWebSocketServer {
  constructor(server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws/metrics'
    });
    
    this.clients = new Set();
    this.setupWebSocketServer();
    this.setupSupabaseRealtime();
  }

  setupWebSocketServer() {
    this.wss.on('connection', (ws, req) => {
      console.log('Dashboard connected to metrics stream');
      
      // Authenticate connection
      const apiKey = new URL(req.url, `http://${req.headers.host}`).searchParams.get('apiKey');
      const validApiKey = process.env.DASHBOARD_API_KEY || 'haki_dash_dev_key_123';
      
      if (apiKey !== validApiKey) {
        ws.close(1008, 'Invalid API key');
        return;
      }

      this.clients.add(ws);
      
      // Send initial connection confirmation
      ws.send(JSON.stringify({
        type: 'connection',
        status: 'connected',
        timestamp: new Date().toISOString()
      }));

      ws.on('close', () => {
        console.log('Dashboard disconnected from metrics stream');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Handle ping/pong for connection health
      ws.on('ping', () => {
        ws.pong();
      });
    });
  }

  setupSupabaseRealtime() {
    // Subscribe to real-time changes in the metrics table
    const channel = supabase
      .channel('metrics-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'metrics'
        },
        (payload) => {
          this.broadcastMetric(payload.new);
        }
      )
      .subscribe();

    console.log('Subscribed to Supabase realtime for metrics');
  }

  broadcastMetric(metric) {
    const message = JSON.stringify({
      type: 'metric',
      timestamp: new Date().toISOString(),
      data: {
        service: metric.service,
        metric_type: metric.metric_type,
        metric_name: metric.metric_name,
        value: parseFloat(metric.value),
        user_id: metric.user_id,
        metadata: metric.metadata,
        created_at: metric.created_at
      }
    });

    // Broadcast to all connected dashboard clients
    this.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(message);
        } catch (error) {
          console.error('Error sending to client:', error);
          this.clients.delete(client);
        }
      }
    });
  }

  // Method to manually send aggregated metrics (called periodically)
  broadcastSummary() {
    this.getSummaryMetrics().then(summary => {
      const message = JSON.stringify({
        type: 'summary',
        timestamp: new Date().toISOString(),
        data: summary
      });

      this.clients.forEach(client => {
        if (client.readyState === 1) {
          try {
            client.send(message);
          } catch (error) {
            console.error('Error sending summary to client:', error);
            this.clients.delete(client);
          }
        }
      });
    });
  }

  async getSummaryMetrics() {
    try {
      // Get metrics from last hour for summary
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      const { data, error } = await supabase
        .from('metrics')
        .select('service, metric_type, metric_name, value')
        .gte('timestamp', oneHourAgo.toISOString());

      if (error) throw error;

      // Aggregate by service
      const summary = {};
      data.forEach(metric => {
        if (!summary[metric.service]) {
          summary[metric.service] = {
            usage: {},
            engagement: {},
            outcome: {}
          };
        }

        const type = metric.metric_type;
        const name = metric.metric_name;
        
        if (!summary[metric.service][type][name]) {
          summary[metric.service][type][name] = {
            total: 0,
            count: 0,
            average: 0
          };
        }

        summary[metric.service][type][name].total += parseFloat(metric.value);
        summary[metric.service][type][name].count += 1;
        summary[metric.service][type][name].average = 
          summary[metric.service][type][name].total / summary[metric.service][type][name].count;
      });

      return summary;
    } catch (error) {
      console.error('Error getting summary metrics:', error);
      return {};
    }
  }

  // Start periodic summary broadcasts (every 5 minutes)
  startPeriodicSummary() {
    setInterval(() => {
      this.broadcastSummary();
    }, 5 * 60 * 1000); // 5 minutes
  }

  getConnectionCount() {
    return this.clients.size;
  }
}

export default MetricsWebSocketServer;
