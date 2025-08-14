// API endpoint for sending welcome emails to new lawyer signups
const { createClient } = require('@supabase/supabase-js');
const EmailService = require('../src/services/emailService');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.warn('Email functionality will be limited without proper Supabase configuration');
}

let supabase;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

async function sendWelcomeEmailHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, role, lsk_number } = req.body;

  if (!email || !name || !role) {
    return res.status(400).json({ error: 'Missing required fields: email, name, role' });
  }

  // Only send welcome emails to lawyers for now
  if (role !== 'lawyer') {
    return res.status(200).json({ 
      success: true, 
      message: 'Welcome email not configured for this user type',
      skipped: true 
    });
  }

  try {
    console.log('=== Sending Welcome Email ===');
    console.log('To:', email);
    console.log('Name:', name);
    console.log('Role:', role);
    console.log('LSK Number:', lsk_number);

    // Send welcome email using EmailService
    const emailResult = await EmailService.sendLawyerWelcome(name, email, lsk_number);
    
    console.log('Email service result:', emailResult);

    // Store email log in Supabase for tracking (if configured)
    if (supabase) {
      try {
        const { error: logError } = await supabase
          .from('email_logs')
          .insert({
            recipient_email: email,
            recipient_name: name,
            email_type: 'lawyer_welcome',
            subject: 'Welcome to HakiChain - Your Legal Tech Journey Begins! 🎉',
            status: emailResult.success ? 'sent' : 'failed',
            user_role: role,
            metadata: { 
              lsk_number: lsk_number || null, 
              signup_date: new Date().toISOString(),
              email_provider: emailResult.provider
            }
          });

        if (logError) {
          console.warn('Failed to log email to Supabase:', logError);
        } else {
          console.log('Email logged to Supabase successfully');
        }
      } catch (supabaseError) {
        console.warn('Supabase logging error:', supabaseError);
      }
    }

    console.log('=== Welcome Email Sent Successfully ===');
    return res.status(200).json({
      success: true,
      message: 'Welcome email sent successfully',
      email_type: 'lawyer_welcome',
      recipient: email,
      provider: emailResult.provider,
      development_mode: emailResult.provider === 'development'
    });

  } catch (error) {
    console.error('=== Welcome Email Error ===');
    console.error('Failed to send welcome email:', error);

    // Log error to Supabase if configured
    if (supabase) {
      try {
        await supabase
          .from('email_logs')
          .insert({
            recipient_email: email,
            recipient_name: name,
            email_type: 'lawyer_welcome',
            subject: 'Welcome to HakiChain (Failed)',
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            user_role: role,
            metadata: { 
              lsk_number: lsk_number || null, 
              signup_date: new Date().toISOString() 
            }
          });
      } catch (logError) {
        console.error('Failed to log email error:', logError);
      }
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to send welcome email',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = sendWelcomeEmailHandler;
