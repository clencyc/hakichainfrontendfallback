import { createClient } from '@supabase/supabase-js';
import AutomatedReminderService from '../src/services/automatedReminderService';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * API endpoint for automated reminder processing
 * Can be called manually or via cron job
 */
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
    if (req.method === 'POST') {
      const { action } = req.body;

      switch (action) {
        case 'process_due_reminders': {
          await AutomatedReminderService.processDueReminders();
          res.status(200).json({ 
            success: true, 
            message: 'Due reminders processed successfully',
            timestamp: new Date().toISOString()
          });
          break;
        }

        case 'get_due_reminders': {
          const dueReminders = await AutomatedReminderService.getDueReminders();
          res.status(200).json({
            success: true,
            data: dueReminders,
            count: dueReminders.length
          });
          break;
        }

        case 'get_upcoming_reminders': {
          const days = req.body.days || 7;
          const upcomingReminders = await AutomatedReminderService.getUpcomingReminders(days);
          res.status(200).json({
            success: true,
            data: upcomingReminders,
            count: upcomingReminders.length
          });
          break;
        }

        case 'process_single_reminder': {
          const { reminderId } = req.body;
          if (!reminderId) {
            return res.status(400).json({ 
              success: false, 
              error: 'Reminder ID is required' 
            });
          }

          // Fetch the specific reminder
          const { data: reminder, error } = await supabase
            .from('lawyer_reminders')
            .select('*')
            .eq('id', reminderId)
            .single();

          if (error || !reminder) {
            return res.status(404).json({ 
              success: false, 
              error: 'Reminder not found' 
            });
          }

          await AutomatedReminderService.processReminder(reminder);
          res.status(200).json({ 
            success: true, 
            message: `Reminder ${reminderId} processed successfully`,
            reminder: reminder
          });
          break;
        }

        default:
          res.status(400).json({ 
            success: false, 
            error: 'Invalid action. Supported actions: process_due_reminders, get_due_reminders, get_upcoming_reminders, process_single_reminder' 
          });
      }
    } else if (req.method === 'GET') {
      // GET request - return upcoming reminders stats
      const upcomingReminders = await AutomatedReminderService.getUpcomingReminders(7);
      const dueToday = await AutomatedReminderService.getDueReminders();

      res.status(200).json({
        success: true,
        stats: {
          due_today: dueToday.length,
          upcoming_week: upcomingReminders.length,
          last_check: new Date().toISOString()
        },
        data: {
          due_today: dueToday,
          upcoming: upcomingReminders
        }
      });
    } else {
      res.status(405).json({ 
        success: false, 
        error: 'Method not allowed. Use POST or GET.' 
      });
    }
  } catch (error) {
    console.error('Error in automated reminders API:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
