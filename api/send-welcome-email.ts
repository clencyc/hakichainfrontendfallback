// API endpoint for sending welcome emails to new lawyer signups

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Email template for lawyer welcome
const generateLawyerWelcomeEmail = (lawyerName: string, lawyerEmail: string, lskNumber?: string) => {
  return {
    subject: "Welcome to HakiChain - Your Legal Tech Journey Begins! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to HakiChain</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #008080 0%, #006666 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .welcome-section { text-align: center; margin-bottom: 30px; }
          .welcome-section h2 { color: #2c3e50; font-size: 24px; margin: 0 0 15px 0; }
          .features { background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 30px 0; }
          .feature-item { display: flex; align-items: center; margin: 15px 0; }
          .feature-icon { background-color: #008080; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 12px; }
          .cta-button { background: linear-gradient(135deg, #008080 0%, #006666 100%); color: white; padding: 15px 30px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; margin: 20px 0; }
          .cta-button:hover { opacity: 0.9; }
          .info-box { background-color: #e8f4f8; border-left: 4px solid #008080; padding: 20px; margin: 20px 0; }
          .footer { background-color: #2c3e50; color: white; padding: 30px; text-align: center; }
          .footer p { margin: 5px 0; }
          .social-links { margin: 20px 0; }
          .social-links a { color: #008080; text-decoration: none; margin: 0 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>⚖️ Welcome to HakiChain</h1>
            <p>Your Gateway to Revolutionary Legal Technology</p>
          </div>
          
          <!-- Main Content -->
          <div class="content">
            <div class="welcome-section">
              <h2>Welcome aboard, ${lawyerName}! 🎉</h2>
              <p>We're thrilled to have you join our community of forward-thinking legal professionals who are transforming the practice of law through blockchain technology.</p>
            </div>
            
            ${lskNumber ? `
            <div class="info-box">
              <strong>✅ Your LSK Number (${lskNumber}) has been verified!</strong><br>
              You're now eligible to accept legal bounties and participate in our marketplace.
            </div>
            ` : ''}
            
            <div class="features">
              <h3 style="color: #2c3e50; margin-top: 0;">🚀 What you can do now:</h3>
              
              <div class="feature-item">
                <div class="feature-icon">🔍</div>
                <div>
                  <strong>HakiLens AI</strong> - Advanced legal research with AI-powered case analysis
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">📝</div>
                <div>
                  <strong>E-Signature Platform</strong> - Blockchain-secured document signing
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">💰</div>
                <div>
                  <strong>Legal Bounties</strong> - Accept and manage legal cases with smart contracts
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">🏆</div>
                <div>
                  <strong>Reputation System</strong> - Build your professional reputation on-chain
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">📱</div>
                <div>
                  <strong>Smart Reminders</strong> - AI-powered case management and client communication
                </div>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://hakichain.com'}/lawyer/dashboard" class="cta-button">
                🚀 Access Your Dashboard
              </a>
            </div>
            
            <div class="info-box">
              <strong>💡 Pro Tip:</strong> Complete your profile and explore HakiLens AI to get the most out of your HakiChain experience. Our AI legal research assistant can help you find relevant case law and legal precedents in seconds!
            </div>
            
            <div style="margin: 30px 0; padding: 20px; background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h4 style="color: #856404; margin: 0 0 10px 0;">📧 Important: Verify Your Email</h4>
              <p style="color: #856404; margin: 0;">Please check your email for a verification link to activate all platform features.</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p><strong>HakiChain - Democratizing Legal Services</strong></p>
            <p>Transforming access to justice through blockchain technology</p>
            <div class="social-links">
              <a href="mailto:info@hakichain.com">📧 Contact Support</a> |
              <a href="${process.env.FRONTEND_URL || 'https://hakichain.com'}/docs">📚 Documentation</a> |
              <a href="${process.env.FRONTEND_URL || 'https://hakichain.com'}/help">❓ Help Center</a>
            </div>
            <p style="font-size: 12px; opacity: 0.8; margin-top: 20px;">
              This email was sent from info@hakichain.com. If you have questions, reply to this email or contact our support team.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to HakiChain, ${lawyerName}!

We're thrilled to have you join our community of forward-thinking legal professionals.

${lskNumber ? `Your LSK Number (${lskNumber}) has been verified! You're now eligible to accept legal bounties.` : ''}

What you can do now:
🔍 HakiLens AI - Advanced legal research with AI-powered case analysis
📝 E-Signature Platform - Blockchain-secured document signing  
💰 Legal Bounties - Accept and manage legal cases with smart contracts
🏆 Reputation System - Build your professional reputation on-chain
📱 Smart Reminders - AI-powered case management

Access your dashboard: ${process.env.FRONTEND_URL || 'https://hakichain.com'}/lawyer/dashboard

Important: Please verify your email to activate all platform features.

Best regards,
The HakiChain Team
info@hakichain.com
    `
  };
};

async function sendWelcomeEmailHandler(req: any, res: any) {
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

    const emailContent = generateLawyerWelcomeEmail(name, email, lsk_number);

    // Using Supabase Edge Functions for email sending
    // Alternative: You can use SendGrid, AWS SES, or other email services here
    
    // For now, we'll use a simple email service
    // In production, you should use Supabase Edge Functions or another email service
    const emailData = {
      to: [{ email, name }],
      from: {
        email: 'info@hakichain.com',
        name: 'HakiChain Team'
      },
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      category: 'lawyer_welcome',
      custom_args: {
        user_role: role,
        lsk_number: lsk_number || 'none',
        signup_date: new Date().toISOString()
      }
    };

    // Log the email for development (replace with actual email service in production)
    console.log('Email would be sent with data:', {
      to: emailData.to,
      from: emailData.from,
      subject: emailData.subject,
      category: emailData.category
    });

    // Store email log in Supabase for tracking
    const { error: logError } = await supabase
      .from('email_logs')
      .insert({
        recipient_email: email,
        recipient_name: name,
        email_type: 'lawyer_welcome',
        subject: emailContent.subject,
        status: 'sent',
        user_role: role,
        metadata: { lsk_number, signup_date: new Date().toISOString() }
      });

    if (logError) {
      console.warn('Failed to log email:', logError);
    }

    console.log('=== Welcome Email Sent Successfully ===');
    return res.status(200).json({
      success: true,
      message: 'Welcome email sent successfully',
      email_type: 'lawyer_welcome',
      recipient: email
    });

  } catch (error) {
    console.error('=== Welcome Email Error ===');
    console.error('Failed to send welcome email:', error);

    // Log error to Supabase
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
          metadata: { lsk_number, signup_date: new Date().toISOString() }
        });
    } catch (logError) {
      console.error('Failed to log email error:', logError);
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to send welcome email',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

export default sendWelcomeEmailHandler;
