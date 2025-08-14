import AutomatedReminderService from './automatedReminderService';

/**
 * Daily Reminder Scheduler
 * Runs every day to check for due reminders
 */
export class DailyReminderScheduler {
  private static isRunning = false;
  private static intervalId: NodeJS.Timeout | null = null;

  /**
   * Start the daily scheduler
   */
  static start(): void {
    if (this.isRunning) {
      console.log('Daily reminder scheduler is already running');
      return;
    }

    console.log('Starting daily reminder scheduler...');
    this.isRunning = true;

    // Run immediately on start
    this.runDailyCheck();

    // Schedule to run every 24 hours (86400000 ms)
    this.intervalId = setInterval(() => {
      this.runDailyCheck();
    }, 24 * 60 * 60 * 1000);

    console.log('Daily reminder scheduler started - will run every 24 hours');
  }

  /**
   * Stop the daily scheduler
   */
  static stop(): void {
    if (!this.isRunning) {
      console.log('Daily reminder scheduler is not running');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log('Daily reminder scheduler stopped');
  }

  /**
   * Run the daily reminder check
   */
  static async runDailyCheck(): Promise<void> {
    try {
      const now = new Date();
      console.log(`Running daily reminder check at ${now.toISOString()}`);

      await AutomatedReminderService.processDueReminders();

      console.log('Daily reminder check completed successfully');
    } catch (error) {
      console.error('Error in daily reminder check:', error);
    }
  }

  /**
   * Get scheduler status
   */
  static getStatus(): { isRunning: boolean; nextRun?: Date } {
    const nextRun = this.isRunning ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined;
    return {
      isRunning: this.isRunning,
      nextRun
    };
  }
}

/**
 * Hourly Reminder Scheduler (for more frequent checks)
 * Runs every hour to check for reminders due soon
 */
export class HourlyReminderScheduler {
  private static isRunning = false;
  private static intervalId: NodeJS.Timeout | null = null;

  /**
   * Start the hourly scheduler
   */
  static start(): void {
    if (this.isRunning) {
      console.log('Hourly reminder scheduler is already running');
      return;
    }

    console.log('Starting hourly reminder scheduler...');
    this.isRunning = true;

    // Run immediately on start
    this.runHourlyCheck();

    // Schedule to run every hour (3600000 ms)
    this.intervalId = setInterval(() => {
      this.runHourlyCheck();
    }, 60 * 60 * 1000);

    console.log('Hourly reminder scheduler started - will run every hour');
  }

  /**
   * Stop the hourly scheduler
   */
  static stop(): void {
    if (!this.isRunning) {
      console.log('Hourly reminder scheduler is not running');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log('Hourly reminder scheduler stopped');
  }

  /**
   * Run the hourly reminder check
   */
  static async runHourlyCheck(): Promise<void> {
    try {
      const now = new Date();
      const currentHour = now.getHours();
      const currentTime = `${currentHour.toString().padStart(2, '0')}:00`;

      console.log(`Running hourly reminder check at ${now.toISOString()}`);

      // Check for reminders due this hour
      await this.checkHourlyReminders(currentTime);

      console.log('Hourly reminder check completed successfully');
    } catch (error) {
      console.error('Error in hourly reminder check:', error);
    }
  }

  /**
   * Check for reminders due at specific hour
   */
  static async checkHourlyReminders(targetTime: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: reminders, error } = await supabase
        .from('lawyer_reminders')
        .select('*')
        .eq('status', 'pending')
        .eq('reminder_date', today)
        .like('reminder_time', `${targetTime}%`); // Match hour (e.g., "14:00" or "14:30")

      if (error) {
        console.error('Error fetching hourly reminders:', error);
        return;
      }

      if (reminders && reminders.length > 0) {
        console.log(`Found ${reminders.length} reminders due at ${targetTime}`);
        
        // Process each reminder
        for (const reminder of reminders) {
          await AutomatedReminderService.processReminder(reminder);
        }
      }
    } catch (error) {
      console.error('Error in checkHourlyReminders:', error);
    }
  }

  /**
   * Get scheduler status
   */
  static getStatus(): { isRunning: boolean; nextRun?: Date } {
    const nextRun = this.isRunning ? new Date(Date.now() + 60 * 60 * 1000) : undefined;
    return {
      isRunning: this.isRunning,
      nextRun
    };
  }
}

// Import supabase for database access
import { supabase } from '../lib/supabase';

export default { DailyReminderScheduler, HourlyReminderScheduler };
