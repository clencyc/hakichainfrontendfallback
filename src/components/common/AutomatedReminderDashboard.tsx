import React, { useState, useEffect } from 'react';
import { Clock, Send, AlertTriangle, CheckCircle, Calendar, Mail, MessageSquare, Settings } from 'lucide-react';

interface ReminderNotification {
  id: string;
  title: string;
  description?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  lawyer_id: string;
  reminder_date: string;
  reminder_time: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'scheduled' | 'sent' | 'failed';
  reminder_type: 'court_date' | 'deadline' | 'meeting' | 'follow_up' | 'document_review';
  created_at: string;
  updated_at: string;
}

interface SchedulerStatus {
  isRunning: boolean;
  nextRun?: Date;
}

interface ReminderStats {
  due_today: number;
  upcoming_week: number;
  last_check: string;
}

const AutomatedReminderDashboard: React.FC = () => {
  const [reminders, setReminders] = useState<ReminderNotification[]>([]);
  const [stats, setStats] = useState<ReminderStats>({
    due_today: 0,
    upcoming_week: 0,
    last_check: new Date().toISOString()
  });
  const [schedulerStatus, setSchedulerStatus] = useState<SchedulerStatus>({
    isRunning: false
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'due' | 'upcoming' | 'settings'>('overview');

  useEffect(() => {
    loadReminderData();
    const interval = setInterval(loadReminderData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadReminderData = async () => {
    try {
      const response = await fetch('/api/automated-reminders');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        console.warn('Empty response from automated-reminders endpoint');
        return;
      }
      
      const data = JSON.parse(text);
      
      if (data.success) {
        setStats(data.stats);
        setReminders([...data.data.due_today, ...data.data.upcoming]);
      }
    } catch (error) {
      console.error('Error loading reminder data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processDueReminders = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/automated-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process_due_reminders' })
      });
      
      const data = await response.json();
      if (data.success) {
        await loadReminderData(); // Refresh data
        alert('Due reminders processed successfully!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error processing reminders:', error);
      alert('Error processing reminders');
    } finally {
      setProcessing(false);
    }
  };

  const processSpecificReminder = async (reminderId: string) => {
    try {
      const response = await fetch('/api/automated-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process_single_reminder', reminderId })
      });
      
      const data = await response.json();
      if (data.success) {
        await loadReminderData(); // Refresh data
        alert(`Reminder processed successfully!`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error processing reminder:', error);
      alert('Error processing reminder');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-500 bg-green-50';
      case 'pending': return 'text-blue-500 bg-blue-50';
      case 'scheduled': return 'text-purple-500 bg-purple-50';
      case 'failed': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const formatReminderType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const dueToday = reminders.filter(r => r.reminder_date === new Date().toISOString().split('T')[0]);
  const upcoming = reminders.filter(r => r.reminder_date > new Date().toISOString().split('T')[0]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Automated Reminder System</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            schedulerStatus.isRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {schedulerStatus.isRunning ? 'Active' : 'Inactive'}
          </div>
          <button
            onClick={processDueReminders}
            disabled={processing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Process Due</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Due Today</p>
              <p className="text-3xl font-bold">{stats.due_today}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Upcoming (7 days)</p>
              <p className="text-3xl font-bold">{stats.upcoming_week}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Last Check</p>
              <p className="text-sm font-medium">{new Date(stats.last_check).toLocaleString()}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-200" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Calendar },
            { id: 'due', label: `Due Today (${dueToday.length})`, icon: AlertTriangle },
            { id: 'upcoming', label: `Upcoming (${upcoming.length})`, icon: Clock },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'due' | 'upcoming' | 'settings')}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Due Today Preview */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Due Today
              </h3>
              {dueToday.length === 0 ? (
                <p className="text-gray-500">No reminders due today</p>
              ) : (
                <div className="space-y-2">
                  {dueToday.slice(0, 3).map(reminder => (
                    <div key={reminder.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium">{reminder.title}</p>
                        <p className="text-sm text-gray-500">{reminder.reminder_time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority}
                      </span>
                    </div>
                  ))}
                  {dueToday.length > 3 && (
                    <p className="text-sm text-gray-500">+{dueToday.length - 3} more</p>
                  )}
                </div>
              )}
            </div>

            {/* Upcoming Preview */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                Upcoming
              </h3>
              {upcoming.length === 0 ? (
                <p className="text-gray-500">No upcoming reminders</p>
              ) : (
                <div className="space-y-2">
                  {upcoming.slice(0, 3).map(reminder => (
                    <div key={reminder.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-medium">{reminder.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(reminder.reminder_date).toLocaleDateString()} at {reminder.reminder_time}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority}
                      </span>
                    </div>
                  ))}
                  {upcoming.length > 3 && (
                    <p className="text-sm text-gray-500">+{upcoming.length - 3} more</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'due' && (
        <div className="space-y-4">
          {dueToday.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No reminders due today</p>
              <p className="text-gray-500">All caught up! Check back tomorrow.</p>
            </div>
          ) : (
            dueToday.map(reminder => (
              <div key={reminder.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{reminder.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(reminder.status)}`}>
                        {reminder.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Time</p>
                        <p>{reminder.reminder_time}</p>
                      </div>
                      <div>
                        <p className="font-medium">Type</p>
                        <p>{formatReminderType(reminder.reminder_type)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Client</p>
                        <p>{reminder.client_name || 'N/A'}</p>
                      </div>
                      <div className="flex space-x-2">
                        {reminder.client_email && <Mail className="h-4 w-4 text-blue-500" />}
                        {reminder.client_phone && <MessageSquare className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>

                    {reminder.description && (
                      <p className="mt-2 text-gray-700">{reminder.description}</p>
                    )}
                  </div>

                  <div className="ml-4">
                    {reminder.status === 'pending' && (
                      <button
                        onClick={() => processSpecificReminder(reminder.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Send className="h-3 w-3" />
                        <span>Send Now</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No upcoming reminders</p>
              <p className="text-gray-500">Your calendar is clear for the next 7 days.</p>
            </div>
          ) : (
            upcoming.map(reminder => (
              <div key={reminder.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{reminder.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(reminder.status)}`}>
                        {reminder.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Date & Time</p>
                        <p>{new Date(reminder.reminder_date).toLocaleDateString()} at {reminder.reminder_time}</p>
                      </div>
                      <div>
                        <p className="font-medium">Type</p>
                        <p>{formatReminderType(reminder.reminder_type)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Client</p>
                        <p>{reminder.client_name || 'N/A'}</p>
                      </div>
                      <div className="flex space-x-2">
                        {reminder.client_email && <Mail className="h-4 w-4 text-blue-500" />}
                        {reminder.client_phone && <MessageSquare className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>

                    {reminder.description && (
                      <p className="mt-2 text-gray-700">{reminder.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Scheduler Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Check Time
                  </label>
                  <input
                    type="time"
                    defaultValue="09:00"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Service
                  </label>
                  <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
                    <option value="emailjs">EmailJS</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMS Service
                  </label>
                  <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
                    <option value="twilio">Twilio</option>
                    <option value="vonage">Vonage</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Auto-send reminders
                  </label>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Send confirmation emails
                  </label>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Include client in reminders
                  </label>
                  <input type="checkbox" className="rounded" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch size (reminders per minute)
                  </label>
                  <input
                    type="number"
                    defaultValue="5"
                    min="1"
                    max="20"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomatedReminderDashboard;
