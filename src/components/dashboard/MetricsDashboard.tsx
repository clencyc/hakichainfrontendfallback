import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, Users, FileText, MessageSquare, 
  Clock, CheckCircle, AlertCircle, Activity,
  Download, Upload, Star, Calendar
} from 'lucide-react';
import { metricsService, ServiceCategory } from '../../services/metricsService';
import { useAuth } from '../../hooks/useAuth';

interface DashboardMetrics {
  [key: string]: {
    usage: Record<string, any>;
    engagement: Record<string, any>;
    outcome: Record<string, any>;
  };
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const serviceConfig = {
  haki_draft: {
    name: 'Haki Draft',
    description: 'Legal Document Generation',
    color: '#3B82F6',
    icon: <FileText className="w-6 h-6" />
  },
  haki_reviews: {
    name: 'Haki Reviews',
    description: 'Document Review & Approval',
    color: '#10B981',
    icon: <CheckCircle className="w-6 h-6" />
  },
  haki_lens: {
    name: 'Haki Lens',
    description: 'Legal Research & Analysis',
    color: '#F59E0B',
    icon: <Activity className="w-6 h-6" />
  },
  haki_reminder: {
    name: 'Haki Reminder',
    description: 'Notifications & Reminders',
    color: '#EF4444',
    icon: <Calendar className="w-6 h-6" />
  },
  haki_bot: {
    name: 'Haki Bot',
    description: 'AI Legal Assistant',
    color: '#8B5CF6',
    icon: <MessageSquare className="w-6 h-6" />
  }
};

export const MetricsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({});
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceCategory | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadMetrics();
  }, [selectedService, timeRange]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      startDate.setDate(startDate.getDate() - days);

      const service = selectedService === 'all' ? undefined : selectedService;
      const data = await metricsService.getDashboardMetrics(service, startDate, endDate);
      setMetrics(data || {});
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceMetrics = (service: ServiceCategory): MetricCard[] => {
    const serviceData = metrics[service];
    if (!serviceData) return [];

    const cards: MetricCard[] = [];
    const config = serviceConfig[service];

    // Usage metrics
    if (serviceData.usage) {
      Object.entries(serviceData.usage).forEach(([key, value]: [string, any]) => {
        cards.push({
          title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: value.total?.toString() || '0',
          change: '+12%',
          trend: 'up',
          icon: config.icon,
          color: config.color
        });
      });
    }

    // Engagement metrics (show averages)
    if (serviceData.engagement) {
      Object.entries(serviceData.engagement).forEach(([key, value]: [string, any]) => {
        const suffix = key.includes('time') || key.includes('duration') ? ' min' : '';
        cards.push({
          title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: `${value.average?.toFixed(1) || '0'}${suffix}`,
          change: '-5%',
          trend: 'down',
          icon: <Clock className="w-6 h-6" />,
          color: config.color
        });
      });
    }

    // Outcome metrics
    if (serviceData.outcome) {
      Object.entries(serviceData.outcome).forEach(([key, value]: [string, any]) => {
        const isPercentage = key.includes('rate') || key.includes('percentage');
        const suffix = isPercentage ? '%' : key.includes('score') ? '/5' : '';
        cards.push({
          title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: `${value.average?.toFixed(1) || '0'}${suffix}`,
          change: '+8%',
          trend: 'up',
          icon: <Star className="w-6 h-6" />,
          color: config.color
        });
      });
    }

    return cards;
  };

  const getAllServicesSummary = (): MetricCard[] => {
    const summary: MetricCard[] = [];
    
    Object.keys(serviceConfig).forEach((service) => {
      const serviceData = metrics[service];
      if (serviceData) {
        const config = serviceConfig[service as ServiceCategory];
        let totalActions = 0;
        
        // Sum up all usage metrics
        if (serviceData.usage) {
          Object.values(serviceData.usage).forEach((metric: any) => {
            totalActions += metric.total || 0;
          });
        }

        summary.push({
          title: config.name,
          value: totalActions.toString(),
          change: '+15%',
          trend: 'up',
          icon: config.icon,
          color: config.color
        });
      }
    });

    return summary;
  };

  const getChartData = () => {
    if (selectedService === 'all') {
      return Object.keys(serviceConfig).map(service => {
        const serviceData = metrics[service];
        let totalValue = 0;
        
        if (serviceData?.usage) {
          Object.values(serviceData.usage).forEach((metric: any) => {
            totalValue += metric.total || 0;
          });
        }

        return {
          name: serviceConfig[service as ServiceCategory].name,
          value: totalValue,
          color: serviceConfig[service as ServiceCategory].color
        };
      });
    } else {
      const serviceData = metrics[selectedService];
      if (!serviceData?.usage) return [];

      return Object.entries(serviceData.usage).map(([key, value]: [string, any]) => ({
        name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: value.total || 0
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const displayMetrics = selectedService === 'all' 
    ? getAllServicesSummary() 
    : getServiceMetrics(selectedService);

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HakiChain Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track performance metrics across all HakiChain services
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedService('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedService === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Services
            </button>
            {Object.entries(serviceConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedService(key as ServiceCategory)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedService === key
                    ? 'text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: selectedService === key ? config.color : undefined
                }}
              >
                {config.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as '7d' | '30d' | '90d')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {displayMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  <div style={{ color: metric.color }}>
                    {metric.icon}
                  </div>
                </div>
                <div className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {metric.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </h3>
              <p className="text-gray-600 text-sm">
                {metric.title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Usage Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Service Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service-specific insights */}
        {selectedService !== 'all' && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {serviceConfig[selectedService].name} Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Usage Metrics</h4>
                <p className="text-blue-700 text-sm">
                  Track total actions and feature adoption
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Engagement Metrics</h4>
                <p className="text-green-700 text-sm">
                  Measure user interaction and time spent
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Outcome Metrics</h4>
                <p className="text-purple-700 text-sm">
                  Evaluate success rates and satisfaction
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
