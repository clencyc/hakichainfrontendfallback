import { supabase } from '../lib/supabase';

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
}

interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

interface SMSTemplate {
  message: string;
}

/**
 * Automated Reminder Service
 * Handles sending SMS and Email reminders on scheduled dates
 */
export class AutomatedReminderService {
  
  /**
   * Get all pending reminders that are due today
   */
  static async getDueReminders(): Promise<ReminderNotification[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('lawyer_reminders')
        .select('*')
        .eq('status', 'pending')
        .eq('reminder_date', today);

      if (error) {
        console.error('Error fetching due reminders:', error);
        throw error;
      }

      return (data as ReminderNotification[]) || [];
    } catch (error) {
      console.error('Error in getDueReminders:', error);
      return [];
    }
  }

  /**
   * Get reminders for the next 7 days (for scheduling)
   */
  static async getUpcomingReminders(days: number = 7): Promise<ReminderNotification[]> {
    try {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + days);

      const { data, error } = await supabase
        .from('lawyer_reminders')
        .select('*')
        .eq('status', 'pending')
        .gte('reminder_date', today.toISOString().split('T')[0])
        .lte('reminder_date', futureDate.toISOString().split('T')[0])
        .order('reminder_date', { ascending: true });

      if (error) {
        console.error('Error fetching upcoming reminders:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUpcomingReminders:', error);
      return [];
    }
  }

  /**
   * Send Email Reminder using EmailJS
   */
  static async sendEmailReminder(reminder: ReminderNotification, lawyerEmail: string): Promise<boolean> {
    try {
      const template = this.generateEmailTemplate(reminder);
      
      // EmailJS configuration (you'll need to provide these)
      const emailJSConfig = {
        serviceID: process.env.EMAILJS_SERVICE_ID || 'your_emailjs_service_id',
        templateID: process.env.EMAILJS_TEMPLATE_ID || 'your_emailjs_template_id',
        userID: process.env.EMAILJS_USER_ID || 'your_emailjs_user_id'
      };

      // Prepare email data for EmailJS
      const emailData = {
        to_email: lawyerEmail,
        to_name: reminder.client_name || 'Legal Professional',
        subject: template.subject,
        message: template.htmlContent,
        reminder_title: reminder.title,
        reminder_date: reminder.reminder_date,
        reminder_time: reminder.reminder_time,
        client_name: reminder.client_name || 'N/A',
        priority: reminder.priority.toUpperCase(),
        reminder_type: this.formatReminderType(reminder.reminder_type)
      };

      // Log the email attempt
      await this.logEmailAttempt(reminder.id, lawyerEmail, 'pending', template.subject);

      // Since we're on the server side, we'll use fetch to call EmailJS
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: emailJSConfig.serviceID,
          template_id: emailJSConfig.templateID,
          user_id: emailJSConfig.userID,
          template_params: emailData
        })
      });

      if (response.ok) {
        await this.logEmailAttempt(reminder.id, lawyerEmail, 'sent', template.subject);
        console.log(`Email sent successfully to ${lawyerEmail} for reminder ${reminder.id}`);
        return true;
      } else {
        const errorText = await response.text();
        await this.logEmailAttempt(reminder.id, lawyerEmail, 'failed', template.subject, errorText);
        console.error(`Failed to send email to ${lawyerEmail}:`, errorText);
        return false;
      }
    } catch (error) {
      console.error('Error sending email reminder:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.logEmailAttempt(reminder.id, lawyerEmail, 'failed', 'Email Reminder', errorMessage);
      return false;
    }
  }

  /**
   * Send SMS Reminder
   */
  static async sendSMSReminder(reminder: ReminderNotification, phoneNumber: string): Promise<boolean> {
    try {
      const smsTemplate = this.generateSMSTemplate(reminder);

      // Use the enhanced SMS API endpoint with single phone number format
      const response = await fetch('/api/send-sms-reminder-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          message: smsTemplate.message
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`SMS sent successfully to ${phoneNumber} for reminder ${reminder.id}:`, result);
        return result.success;
      } else {
        const errorData = await response.json();
        console.error(`Failed to send SMS to ${phoneNumber}:`, errorData);
        return false;
      }
    } catch (error) {
      console.error('Error sending SMS reminder:', error);
      return false;
    }
  }

  /**
   * Process a single reminder (send both email and SMS)
   */
  static async processReminder(reminder: ReminderNotification): Promise<void> {
    try {
      console.log(`Processing reminder ${reminder.id}: ${reminder.title}`);
      
      // Get lawyer details
      const { data: lawyer, error: lawyerError } = await supabase
        .from('auth.users')
        .select('email, raw_user_meta_data')
        .eq('id', reminder.lawyer_id)
        .single();

      if (lawyerError || !lawyer) {
        console.error('Error fetching lawyer details:', lawyerError);
        await this.updateReminderStatus(reminder.id, 'failed');
        return;
      }

      const lawyerEmail = lawyer.email;
      const lawyerPhone = lawyer.raw_user_meta_data?.phone;

      let emailSent = false;
      let smsSent = false;

      // Send Email Reminder
      if (lawyerEmail) {
        emailSent = await this.sendEmailReminder(reminder, lawyerEmail);
      }

      // Send SMS Reminder (if phone number available)
      if (lawyerPhone) {
        smsSent = await this.sendSMSReminder(reminder, lawyerPhone);
      }

      // Also send to client if their details are provided
      if (reminder.client_email) {
        await this.sendEmailReminder(reminder, reminder.client_email);
      }

      if (reminder.client_phone) {
        await this.sendSMSReminder(reminder, reminder.client_phone);
      }

      // Update reminder status based on success
      const newStatus = (emailSent || smsSent) ? 'sent' : 'failed';
      await this.updateReminderStatus(reminder.id, newStatus);

      // Track metrics
      await this.trackReminderMetrics(reminder, emailSent, smsSent);

    } catch (error) {
      console.error(`Error processing reminder ${reminder.id}:`, error);
      await this.updateReminderStatus(reminder.id, 'failed');
    }
  }

  /**
   * Main function to process all due reminders
   */
  static async processDueReminders(): Promise<void> {
    try {
      console.log('Starting automated reminder processing...');
      
      const dueReminders = await this.getDueReminders();
      console.log(`Found ${dueReminders.length} due reminders`);

      if (dueReminders.length === 0) {
        console.log('No reminders due today');
        return;
      }

      // Process reminders in batches to avoid overwhelming services
      const batchSize = 5;
      for (let i = 0; i < dueReminders.length; i += batchSize) {
        const batch = dueReminders.slice(i, i + batchSize);
        
        console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(dueReminders.length/batchSize)}`);
        
        // Process batch concurrently
        await Promise.all(batch.map(reminder => this.processReminder(reminder)));
        
        // Wait a bit between batches to be kind to external services
        if (i + batchSize < dueReminders.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      console.log('Automated reminder processing completed');
    } catch (error) {
      console.error('Error in processDueReminders:', error);
    }
  }

  /**
   * Update reminder status in database
   */
  static async updateReminderStatus(reminderId: string, status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('lawyer_reminders')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', reminderId);

      if (error) {
        console.error('Error updating reminder status:', error);
      }
    } catch (error) {
      console.error('Error in updateReminderStatus:', error);
    }
  }

  /**
   * Generate email template
   */
  static generateEmailTemplate(reminder: ReminderNotification): EmailTemplate {
    const subject = `Legal Reminder: ${reminder.title}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">HakiChain Legal Reminder</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">${reminder.title}</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
            <p><strong>Date:</strong> ${new Date(reminder.reminder_date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${reminder.reminder_time}</p>
            <p><strong>Priority:</strong> <span style="color: ${this.getPriorityColor(reminder.priority)}; font-weight: bold;">${reminder.priority.toUpperCase()}</span></p>
            <p><strong>Type:</strong> ${this.formatReminderType(reminder.reminder_type)}</p>
            ${reminder.client_name ? `<p><strong>Client:</strong> ${reminder.client_name}</p>` : ''}
            ${reminder.description ? `<p><strong>Description:</strong> ${reminder.description}</p>` : ''}
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #1976d2;">
              📅 This is an automated reminder from HakiChain. Please take appropriate action.
            </p>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 12px;">
            © 2025 HakiChain - Legal Technology Platform<br>
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    const textContent = `
      HakiChain Legal Reminder
      
      ${reminder.title}
      
      Date: ${new Date(reminder.reminder_date).toLocaleDateString()}
      Time: ${reminder.reminder_time}
      Priority: ${reminder.priority.toUpperCase()}
      Type: ${this.formatReminderType(reminder.reminder_type)}
      ${reminder.client_name ? `Client: ${reminder.client_name}` : ''}
      ${reminder.description ? `Description: ${reminder.description}` : ''}
      
      This is an automated reminder from HakiChain. Please take appropriate action.
    `;

    return { subject, htmlContent, textContent };
  }

  /**
   * Generate SMS template
   */
  static generateSMSTemplate(reminder: ReminderNotification): SMSTemplate {
    const message = `HakiChain Reminder: ${reminder.title} - ${new Date(reminder.reminder_date).toLocaleDateString()} at ${reminder.reminder_time}. Priority: ${reminder.priority.toUpperCase()}. ${reminder.client_name ? `Client: ${reminder.client_name}` : ''}`;
    
    return { message: message.substring(0, 160) }; // SMS character limit
  }

  /**
   * Track reminder metrics for dashboard
   */
  static async trackReminderMetrics(reminder: ReminderNotification, emailSent: boolean, smsSent: boolean): Promise<void> {
    try {
      const metricsData = {
        service: 'haki_reminder',
        action: 'reminder_sent',
        user_id: reminder.lawyer_id,
        metadata: {
          reminder_id: reminder.id,
          reminder_type: reminder.reminder_type,
          priority: reminder.priority,
          email_sent: emailSent,
          sms_sent: smsSent,
          client_notified: !!(reminder.client_email || reminder.client_phone)
        }
      };

      await fetch('/api/dashboard-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metricsData)
      });
    } catch (error) {
      console.error('Error tracking reminder metrics:', error);
    }
  }

  /**
   * Log email attempts
   */
  static async logEmailAttempt(reminderId: string, email: string, status: string, subject: string, error?: string): Promise<void> {
    try {
      const { error: dbError } = await supabase
        .from('email_logs')
        .insert({
          recipient_email: email,
          email_type: 'lawyer_reminder',
          subject: subject,
          status: status,
          error_message: error,
          user_role: 'lawyer',
          metadata: { reminder_id: reminderId }
        });

      if (dbError) {
        console.error('Error logging email attempt:', dbError);
      }
    } catch (error) {
      console.error('Error in logEmailAttempt:', error);
    }
  }

  // Helper methods
  static getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#666';
    }
  }

  static formatReminderType(type: string): string {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}

export default AutomatedReminderService;
