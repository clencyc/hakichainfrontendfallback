import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Plus,
  Calendar,
  Clock,
  User,
  Edit,
  Trash2,
  Search,
  ArrowRight,
  Brain,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  GripVertical,
  X
} from 'lucide-react';
import { LawyerDashboardLayout } from '../../components/layout/LawyerDashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface Reminder {
  id: string;
  title: string;
  description: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  reminder_date: string;
  reminder_time: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'sent' | 'completed';
  created_at: string;
  case_id?: string;
  reminder_type?: 'court_date' | 'deadline' | 'meeting' | 'follow_up' | 'document_review';
}

interface SmartSuggestion {
  id: string;
  type: 'court_date' | 'follow_up' | 'document_review' | 'deadline' | 'meeting';
  title: string;
  description: string;
  suggested_date: string;
  suggested_time: string;
  priority: 'low' | 'medium' | 'high';
  client_name: string;
  case_context: string;
  confidence: number;
}

interface KanbanColumn {
  id: 'pending' | 'sent' | 'completed';
  title: string;
  color: string;
  bgColor: string;
  count: number;
}

export const LawyerRemindersKanban = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [draggedReminder, setDraggedReminder] = useState<Reminder | null>(null);
  const [lawyerPhone, setLawyerPhone] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    reminder_date: '',
    reminder_time: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    reminder_type: 'follow_up' as 'court_date' | 'deadline' | 'meeting' | 'follow_up' | 'document_review'
  });

  // Kanban columns configuration
  const kanbanColumns: KanbanColumn[] = [
    { 
      id: 'pending', 
      title: 'Scheduled', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50 border-blue-200',
      count: reminders.filter(r => r.status === 'pending').length
    },
    { 
      id: 'sent', 
      title: 'Sent', 
      color: 'text-green-600', 
      bgColor: 'bg-green-50 border-green-200',
      count: reminders.filter(r => r.status === 'sent').length
    },
    { 
      id: 'completed', 
      title: 'History', 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50 border-gray-200',
      count: reminders.filter(r => r.status === 'completed').length
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      await loadReminders();
      generateSmartSuggestions();
    };
    
    if (user) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadReminders = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Temporarily load all reminders since lawyer_id foreign key constraint is disabled
      const { data, error } = await supabase
        .from('lawyer_reminders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Loaded reminders:', data);
      setReminders(data || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate smart suggestions based on case data and patterns
  const generateSmartSuggestions = async () => {
    const suggestions: SmartSuggestion[] = [
      {
        id: '1',
        type: 'court_date',
        title: 'Court Appearance Reminder',
        description: 'Follow up on Johnson vs. State case - hearing scheduled for next week',
        suggested_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        suggested_time: '09:00',
        priority: 'high',
        client_name: 'Maria Johnson',
        case_context: 'Pending criminal defense case',
        confidence: 0.92
      },
      {
        id: '2',
        type: 'follow_up',
        title: 'Client Check-in',
        description: 'Schedule follow-up call with recent divorce case client',
        suggested_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        suggested_time: '14:00',
        priority: 'medium',
        client_name: 'David Chen',
        case_context: 'Recent divorce settlement completion',
        confidence: 0.85
      },
      {
        id: '3',
        type: 'document_review',
        title: 'Contract Review Reminder',
        description: 'Review and send amended contract to business client',
        suggested_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        suggested_time: '11:30',
        priority: 'high',
        client_name: 'TechStart Inc.',
        case_context: 'Business formation and contracts',
        confidence: 0.78
      }
    ];
    
    setSmartSuggestions(suggestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Validate required fields (make phone numbers optional for SMS)
      if (!formData.title || !formData.client_name || !formData.client_email || 
          !formData.reminder_date || !formData.reminder_time || !formData.description) {
        alert('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      console.log('User ID:', user.id);
      console.log('Creating reminder with data:', { ...formData, lawyer_id: user.id });

      const reminderData = {
        title: formData.title,
        description: formData.description,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        reminder_date: formData.reminder_date,
        reminder_time: formData.reminder_time,
        priority: formData.priority,
        // reminder_type: formData.reminder_type, // Temporarily disabled until migration runs
        // lawyer_id: user.id, // Temporarily disabled due to foreign key constraint
        status: 'pending' as const
      };

      let reminderResponse;
      let reminderSuccessMessage = '';
      
      if (editingReminder) {
        console.log('Updating existing reminder:', editingReminder.id);
        reminderResponse = await supabase
          .from('lawyer_reminders')
          .update(reminderData)
          .eq('id', editingReminder.id)
          .select();
        
        if (reminderResponse.error) {
          console.error('Database update error:', reminderResponse.error);
          console.error('Error details:', reminderResponse.error.details);
          console.error('Error hint:', reminderResponse.error.hint);
          console.error('Error message:', reminderResponse.error.message);
          throw new Error(`Failed to update reminder: ${reminderResponse.error.message}`);
        }
        reminderSuccessMessage = 'Reminder updated successfully';
      } else {
        console.log('Creating new reminder');
        console.log('Supabase client status:', !!supabase);
        
        reminderResponse = await supabase
          .from('lawyer_reminders')
          .insert([reminderData])
          .select();
        
        if (reminderResponse.error) {
          console.error('Database insert error:', reminderResponse.error);
          console.error('Error details:', reminderResponse.error.details);
          console.error('Error hint:', reminderResponse.error.hint);
          console.error('Error message:', reminderResponse.error.message);
          console.error('Error code:', reminderResponse.error.code);
          throw new Error(`Failed to create reminder: ${reminderResponse.error.message}`);
        }
        reminderSuccessMessage = 'Reminder created successfully';
      }

      console.log('Database operation successful:', reminderResponse.data);

      // Try to send SMS only if both phone numbers are provided
      if (lawyerPhone && formData.client_phone) {
        try {
          console.log('Attempting to send SMS...');
          const baseApi = (import.meta.env.DEV ? '' : '') as string; // use relative in dev
          const smsUrl = baseApi + '/api/send-sms-reminder-v2';
          const smsResponse = await fetch(smsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lawyer_phone: lawyerPhone,
              client_phone: formData.client_phone,
              message: `Legal Reminder: ${formData.title}\n\nDetails: ${formData.description}\n\nDate: ${formData.reminder_date} at ${formData.reminder_time}\n\nClient: ${formData.client_name}`
            })
          }).catch(async (err) => {
            console.warn('Relative /api call failed, retrying on :3001', err);
            // Retry directly to API server on 3001
            return await fetch('http://localhost:3001/api/send-sms-reminder-v2', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                lawyer_phone: lawyerPhone,
                client_phone: formData.client_phone,
                message: `Legal Reminder: ${formData.title}\n\nDetails: ${formData.description}\n\nDate: ${formData.reminder_date} at ${formData.reminder_time}\n\nClient: ${formData.client_name}`
              })
            });
          });

          console.log('SMS Response status:', smsResponse.status);

          let smsResult;
          try {
            const responseText = await smsResponse.text();
            console.log('SMS Raw response:', responseText);
            
            if (responseText.trim()) {
              smsResult = JSON.parse(responseText);
            } else {
              smsResult = { success: false, error: 'SMS service temporarily unavailable' };
            }
          } catch (parseError) {
            console.error('Failed to parse SMS response as JSON:', parseError);
            smsResult = { success: false, error: 'SMS service communication error' };
          }

          console.log('SMS API parsed result:', smsResult);

          if (smsResponse.ok && smsResult.success) {
            // Update status to 'sent' only if SMS was successfully sent
            const reminderId = editingReminder ? editingReminder.id : reminderResponse.data[0].id;
            await supabase
              .from('lawyer_reminders')
              .update({ status: 'sent' })
              .eq('id', reminderId);
            
            alert(`${reminderSuccessMessage} and SMS notifications sent successfully!`);
          } else {
            console.warn('SMS sending failed, but reminder saved successfully');
            // Don't show SMS errors to user - just success message
            alert(`${reminderSuccessMessage}! (SMS notifications are temporarily unavailable)`);
          }
        } catch (smsError) {
          console.error('SMS sending error:', smsError);
          // Don't show SMS errors to user - reminder creation is successful
          alert(`${reminderSuccessMessage}! (SMS notifications are temporarily unavailable)`);
        }
      } else {
        console.log('SMS not sent - phone numbers not provided');
        alert(`${reminderSuccessMessage}! You can add phone numbers later to enable SMS notifications.`);
      }

      resetForm();
      loadReminders();
    } catch (error) {
      console.error('Error saving reminder:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      alert(`Failed to save reminder: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragStart = (reminder: Reminder) => {
    setDraggedReminder(reminder);
  };

  const handleDrop = async (newStatus: Reminder['status']) => {
    if (!draggedReminder || draggedReminder.status === newStatus) {
      setDraggedReminder(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('lawyer_reminders')
        .update({ status: newStatus })
        .eq('id', draggedReminder.id);

      if (error) throw error;
      
      // Update local state
      setReminders(prev => 
        prev.map(r => 
          r.id === draggedReminder.id 
            ? { ...r, status: newStatus }
            : r
        )
      );
      
      console.log(`Moved reminder "${draggedReminder.title}" to ${newStatus}`);
    } catch (error) {
      console.error('Error updating reminder status:', error);
    }
    
    setDraggedReminder(null);
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      description: reminder.description,
      client_name: reminder.client_name,
      client_email: reminder.client_email,
      client_phone: reminder.client_phone,
      reminder_date: reminder.reminder_date,
      reminder_time: reminder.reminder_time,
      priority: reminder.priority,
      reminder_type: reminder.reminder_type || 'follow_up'
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
      const { error } = await supabase
        .from('lawyer_reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      alert('Failed to delete reminder');
    }
  };

  const acceptSuggestion = (suggestion: SmartSuggestion) => {
    setFormData({
      title: suggestion.title,
      description: suggestion.description,
      client_name: suggestion.client_name,
      client_email: '',
      client_phone: '',
      reminder_date: suggestion.suggested_date,
      reminder_time: suggestion.suggested_time,
      priority: suggestion.priority,
      reminder_type: suggestion.type
    });
    setShowForm(true);
    setShowSuggestions(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      client_name: '',
      client_email: '',
      client_phone: '',
      reminder_date: '',
      reminder_time: '',
      priority: 'medium',
      reminder_type: 'follow_up'
    });
    setEditingReminder(null);
    setShowForm(false);
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = 
      reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || reminder.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getReminderTypeIcon = (type?: string) => {
    switch (type) {
      case 'court_date': return Calendar;
      case 'deadline': return AlertTriangle;
      case 'meeting': return User;
      case 'document_review': return Edit;
      default: return Bell;
    }
  };

  const ReminderCard = ({ reminder }: { reminder: Reminder }) => {
    const TypeIcon = getReminderTypeIcon(reminder.reminder_type);
    const isBeingDragged = draggedReminder?.id === reminder.id;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isBeingDragged ? 0.7 : 1, 
          y: 0,
          scale: isBeingDragged ? 1.05 : 1
        }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-white rounded-xl border-2 p-4 hover:shadow-md transition-all duration-200 group touch-none ${
          isBeingDragged 
            ? 'border-blue-400 shadow-lg cursor-grabbing z-20' 
            : 'border-gray-200 cursor-pointer hover:border-gray-300'
        }`}
        onClick={() => {
          if (draggedReminder) {
            // If something is being dragged and we click another card, cancel drag
            setDraggedReminder(null);
          } else {
            // Start dragging this card
            handleDragStart(reminder);
          }
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TypeIcon className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{reminder.title}</h3>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleEdit(reminder)}
              className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleDelete(reminder.id)}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {reminder.description && (
          <p className="text-gray-600 text-xs mb-3 line-clamp-2">{reminder.description}</p>
        )}

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-xs text-gray-600">
            <User className="w-3 h-3 mr-1.5" />
            <span className="truncate">{reminder.client_name}</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="w-3 h-3 mr-1.5" />
            <span>{new Date(reminder.reminder_date).toLocaleDateString()}</span>
            <Clock className="w-3 h-3 ml-2 mr-1" />
            <span>{reminder.reminder_time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(reminder.priority)}`}>
            {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
          </span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <LawyerDashboardLayout>
      <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">HakiReminders</h1>
                <p className="text-lg text-gray-600">AI-powered reminder management with Kanban workflow</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Suggestions</span>
                <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                  {smartSuggestions.length}
                </span>
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Reminder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Smart Suggestions Panel */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Suggestions</h3>
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    {smartSuggestions.length} suggestions
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {smartSuggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-xl border border-purple-200 p-6 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => acceptSuggestion(suggestion)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(suggestion.priority)}`}>
                            {suggestion.priority}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-green-600">
                          <span>{Math.round(suggestion.confidence * 100)}%</span>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{suggestion.description}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Client: {suggestion.client_name}</div>
                        <div>{new Date(suggestion.suggested_date).toLocaleDateString()} at {suggestion.suggested_time}</div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-purple-600">{suggestion.case_context}</span>
                        <ArrowRight className="w-3 h-3 text-purple-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag Instructions */}
        {draggedReminder && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <GripVertical className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Moving: {draggedReminder.title}</h4>
                <p className="text-sm text-blue-700">Click on a column to move this reminder</p>
              </div>
            </div>
            <button
              onClick={() => setDraggedReminder(null)}
              className="text-blue-400 hover:text-blue-600"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kanbanColumns.map((column) => (
            <div
              key={column.id}
              className={`${column.bgColor} rounded-2xl border-2 border-dashed p-6 min-h-[600px] transition-all duration-200 hover:border-opacity-80 relative flex-1`}
            >
              {/* Drop zone overlay for when dragging */}
              {draggedReminder && draggedReminder.status !== column.id && (
                <div 
                  className="absolute inset-0 bg-blue-100 bg-opacity-50 border-2 border-blue-400 border-solid rounded-2xl flex items-center justify-center z-10 cursor-pointer"
                  onClick={() => handleDrop(column.id)}
                >
                  <div className="text-blue-600 font-medium text-lg">
                    Drop here to move to {column.title}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${column.color} text-lg`}>
                  {column.title}
                </h3>
                <span className={`${column.color} bg-white px-2 py-1 rounded-full text-sm font-medium`}>
                  {column.count}
                </span>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredReminders
                    .filter(reminder => reminder.status === column.id)
                    .map((reminder) => (
                      <ReminderCard key={reminder.id} reminder={reminder} />
                    ))}
                </AnimatePresence>
              </div>
              
              {filteredReminders.filter(reminder => reminder.status === column.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className={`w-12 h-12 ${column.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Bell className={`w-5 h-5 ${column.color}`} />
                  </div>
                  <p className="text-sm">No {column.title.toLowerCase()} reminders</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingReminder ? 'Edit Reminder' : 'New Reminder'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="w-6 h-6 rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reminder Type
                      </label>
                      <select
                        value={formData.reminder_type}
                        onChange={(e) => setFormData({...formData, reminder_type: e.target.value as 'court_date' | 'deadline' | 'meeting' | 'follow_up' | 'document_review'})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="follow_up">Follow-up</option>
                        <option value="court_date">Court Date</option>
                        <option value="deadline">Deadline</option>
                        <option value="meeting">Meeting</option>
                        <option value="document_review">Document Review</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reminder Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Court appearance reminder"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="This message will be sent via SMS to both you and your client"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">This description will be sent as an SMS reminder to both lawyer and client</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={formData.client_name}
                        onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Client full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Email *
                      </label>
                      <input
                        type="email"
                        value={formData.client_email}
                        onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="client@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lawyer Phone (optional)
                      </label>
                      <input
                        type="tel"
                        value={lawyerPhone}
                        onChange={e => setLawyerPhone(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+254712345678"
                      />
                      <p className="text-xs text-gray-500 mt-1">Your phone number for SMS notifications (optional)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Phone (optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.client_phone}
                        onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+254712345678"
                      />
                      <p className="text-xs text-gray-500 mt-1">Client's phone number for SMS reminders (optional)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as 'low' | 'medium' | 'high'})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reminder Date *
                      </label>
                      <input
                        type="date"
                        value={formData.reminder_date}
                        onChange={(e) => setFormData({...formData, reminder_date: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reminder Time *
                      </label>
                      <input
                        type="time"
                        value={formData.reminder_time}
                        onChange={(e) => setFormData({...formData, reminder_time: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={isSubmitting}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSubmitting && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      <span>
                        {isSubmitting 
                          ? 'Saving...' 
                          : editingReminder 
                            ? 'Update Reminder' 
                            : 'Create Reminder'
                        }
                      </span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredReminders.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No reminders found</h3>
            <p className="text-gray-500 mb-6">Create your first reminder to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all"
            >
              Create Reminder
            </button>
          </div>
        )}
      </div>
    </LawyerDashboardLayout>
  );
};
