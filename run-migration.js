import { supabase } from '../src/lib/supabase.js';

async function runMigration() {
  console.log('🔄 Running database migration...');
  
  try {
    // Add reminder_type column
    console.log('Adding reminder_type column...');
    const { error: addColumnError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE lawyer_reminders 
        ADD COLUMN IF NOT EXISTS reminder_type text DEFAULT 'follow_up';
        
        ALTER TABLE lawyer_reminders 
        ADD COLUMN IF NOT EXISTS lawyer_id uuid;
        
        UPDATE lawyer_reminders 
        SET reminder_type = 'follow_up' 
        WHERE reminder_type IS NULL;
      `
    });
    
    if (addColumnError) {
      console.error('❌ Migration failed:', addColumnError);
      console.log('');
      console.log('🔧 Manual steps needed:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Open the SQL Editor');
      console.log('3. Run this SQL:');
      console.log('');
      console.log('ALTER TABLE lawyer_reminders ADD COLUMN IF NOT EXISTS reminder_type text DEFAULT \'follow_up\';');
      console.log('ALTER TABLE lawyer_reminders ADD COLUMN IF NOT EXISTS lawyer_id uuid;');
      console.log('');
    } else {
      console.log('✅ Migration completed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    console.log('');
    console.log('🔧 Please run this SQL manually in your Supabase dashboard:');
    console.log('');
    console.log('ALTER TABLE lawyer_reminders ADD COLUMN IF NOT EXISTS reminder_type text DEFAULT \'follow_up\';');
    console.log('ALTER TABLE lawyer_reminders ADD COLUMN IF NOT EXISTS lawyer_id uuid;');
    console.log('');
  }
}

runMigration();
