import { DailyReminderScheduler, HourlyReminderScheduler } from './reminderScheduler';

/**
 * Reminder System Initializer
 * Sets up and manages the automated reminder system
 */
export class ReminderSystemManager {
  private static isInitialized = false;

  /**
   * Initialize the reminder system
   */
  static initialize() {
    if (this.isInitialized) {
      console.log('Reminder system already initialized');
      return;
    }

    try {
      console.log('Initializing HakiChain Reminder System...');

      // Start the daily scheduler
      DailyReminderScheduler.start();

      // Start the hourly scheduler for more precise timing
      HourlyReminderScheduler.start();

      this.isInitialized = true;
      
      console.log('✅ HakiChain Reminder System initialized successfully');
      console.log('📅 Daily scheduler: Active');
      console.log('⏰ Hourly scheduler: Active');
      
      // Log system status
      this.logSystemStatus();

    } catch (error) {
      console.error('❌ Failed to initialize reminder system:', error);
    }
  }

  /**
   * Shutdown the reminder system
   */
  static shutdown() {
    if (!this.isInitialized) {
      console.log('Reminder system is not running');
      return;
    }

    console.log('Shutting down HakiChain Reminder System...');

    DailyReminderScheduler.stop();
    HourlyReminderScheduler.stop();

    this.isInitialized = false;
    console.log('✅ Reminder system shutdown complete');
  }

  /**
   * Get system status
   */
  static getStatus() {
    return {
      isInitialized: this.isInitialized,
      dailyScheduler: DailyReminderScheduler.getStatus(),
      hourlyScheduler: HourlyReminderScheduler.getStatus()
    };
  }

  /**
   * Log system status
   */
  static logSystemStatus() {
    const status = this.getStatus();
    
    console.log('\n🔍 Reminder System Status:');
    console.log(`├── System Initialized: ${status.isInitialized ? '✅' : '❌'}`);
    console.log(`├── Daily Scheduler: ${status.dailyScheduler.isRunning ? '✅ Active' : '❌ Inactive'}`);
    console.log(`├── Hourly Scheduler: ${status.hourlyScheduler.isRunning ? '✅ Active' : '❌ Inactive'}`);
    
    if (status.dailyScheduler.nextRun) {
      console.log(`├── Next Daily Check: ${status.dailyScheduler.nextRun.toLocaleString()}`);
    }
    
    if (status.hourlyScheduler.nextRun) {
      console.log(`└── Next Hourly Check: ${status.hourlyScheduler.nextRun.toLocaleString()}`);
    }
  }

  /**
   * Test the reminder system
   */
  static async testSystem() {
    console.log('🧪 Testing reminder system...');
    
    try {
      // Test API endpoint
      const response = await fetch('/api/automated-reminders');
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ API endpoint working');
        console.log(`📊 Due today: ${data.stats.due_today}`);
        console.log(`📊 Upcoming week: ${data.stats.upcoming_week}`);
      } else {
        console.error('❌ API endpoint failed:', data.error);
      }
    } catch (error) {
      console.error('❌ API test failed:', error);
    }
  }

  /**
   * Manual trigger for testing
   */
  static async triggerManualCheck() {
    console.log('🔄 Triggering manual reminder check...');
    
    try {
      const response = await fetch('/api/automated-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process_due_reminders' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Manual check completed successfully');
        console.log(`📧 Processed at: ${data.timestamp}`);
      } else {
        console.error('❌ Manual check failed:', data.error);
      }
    } catch (error) {
      console.error('❌ Manual trigger failed:', error);
    }
  }
}

export default ReminderSystemManager;
