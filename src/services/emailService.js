// Email service for HakiChain platform
// Supports multiple email providers: SendGrid, AWS SES, and development mode

const EmailService = {
  // Email templates
  templates: {
    lawyerWelcome: (name, email, lskNumber) => ({
      subject: "Welcome to HakiChain - Your Legal Tech Journey Begins! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to HakiChain</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; padding: 0; background-color: #f8f9fa; 
              line-height: 1.6; 
            }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { 
              background: linear-gradient(135deg, #008080 0%, #006666 100%); 
              color: white; padding: 40px 30px; text-align: center; 
            }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
            .content { padding: 40px 30px; color: #333; }
            .welcome-section { text-align: center; margin-bottom: 30px; }
            .welcome-section h2 { color: #2c3e50; font-size: 24px; margin: 0 0 15px 0; }
            .features { 
              background-color: #f8f9fa; border-radius: 8px; 
              padding: 25px; margin: 30px 0; 
            }
            .feature-item { 
              display: flex; align-items: flex-start; 
              margin: 15px 0; padding: 10px 0; 
            }
            .feature-icon { 
              background-color: #008080; color: white; 
              width: 32px; height: 32px; border-radius: 50%; 
              display: flex; align-items: center; justify-content: center; 
              margin-right: 15px; font-size: 14px; flex-shrink: 0;
            }
            .cta-button { 
              background: linear-gradient(135deg, #008080 0%, #006666 100%); 
              color: white; padding: 15px 30px; border: none; 
              border-radius: 8px; font-size: 16px; font-weight: 600; 
              text-decoration: none; display: inline-block; margin: 20px 0; 
            }
            .cta-button:hover { opacity: 0.9; }
            .info-box { 
              background-color: #e8f4f8; border-left: 4px solid #008080; 
              padding: 20px; margin: 20px 0; border-radius: 4px;
            }
            .warning-box {
              background-color: #fff3cd; border-left: 4px solid #ffc107;
              padding: 20px; margin: 20px 0; border-radius: 4px;
            }
            .footer { 
              background-color: #2c3e50; color: white; 
              padding: 30px; text-align: center; 
            }
            .footer p { margin: 5px 0; }
            .social-links { margin: 20px 0; }
            .social-links a { color: #64b5f6; text-decoration: none; margin: 0 10px; }
            .social-links a:hover { text-decoration: underline; }
            
            @media only screen and (max-width: 600px) {
              .content { padding: 20px 15px; }
              .header { padding: 30px 20px; }
              .header h1 { font-size: 24px; }
              .feature-item { flex-direction: column; text-align: center; }
              .feature-icon { margin: 0 auto 10px auto; }
            }
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
                <h2>Welcome aboard, ${name}! 🎉</h2>
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
                    <strong>HakiLens AI</strong><br>
                    Advanced legal research with AI-powered case analysis and precedent discovery
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">📝</div>
                  <div>
                    <strong>E-Signature Platform</strong><br>
                    Blockchain-secured document signing with cryptographic verification
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">💰</div>
                  <div>
                    <strong>Legal Bounties</strong><br>
                    Accept and manage legal cases with smart contract automation
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">🏆</div>
                  <div>
                    <strong>Reputation System</strong><br>
                    Build your professional reputation with verifiable on-chain records
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">📱</div>
                  <div>
                    <strong>Smart Reminders</strong><br>
                    AI-powered case management and automated client communication
                  </div>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'https://hakichain.com'}/lawyer/dashboard" class="cta-button">
                  🚀 Access Your Dashboard
                </a>
              </div>
              
              <div class="info-box">
                <strong>💡 Pro Tip:</strong> Start by exploring HakiLens AI to experience our cutting-edge legal research capabilities. You can search case law, analyze legal documents, and get AI-powered insights in seconds!
              </div>
              
              <div class="warning-box">
                <h4 style="color: #856404; margin: 0 0 10px 0;">📧 Important: Verify Your Email</h4>
                <p style="color: #856404; margin: 0;">Please check your email for a verification link to activate all platform features. This ensures secure access to your account.</p>
              </div>
              
              <div style="margin: 30px 0; padding: 20px; background-color: #f0f8ff; border-radius: 8px; border-left: 4px solid #007bff;">
                <h4 style="color: #004085; margin: 0 0 10px 0;">🎯 Next Steps:</h4>
                <ol style="color: #004085; margin: 0; padding-left: 20px;">
                  <li>Complete your profile with specialization details</li>
                  <li>Set up your payment preferences for bounties</li>
                  <li>Explore HakiLens AI with sample legal queries</li>
                  <li>Join our community forum for networking</li>
                </ol>
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
                This email was sent from info@hakichain.com<br>
                If you have questions, reply to this email or contact our support team.
              </p>
              <p style="font-size: 11px; opacity: 0.6; margin-top: 15px;">
                © 2025 HakiChain. All rights reserved.<br>
                You received this email because you registered for a HakiChain account.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to HakiChain, ${name}!

We're thrilled to have you join our community of forward-thinking legal professionals who are transforming the practice of law through blockchain technology.

${lskNumber ? `✅ Your LSK Number (${lskNumber}) has been verified! You're now eligible to accept legal bounties and participate in our marketplace.` : ''}

🚀 What you can do now:

🔍 HakiLens AI - Advanced legal research with AI-powered case analysis
📝 E-Signature Platform - Blockchain-secured document signing  
💰 Legal Bounties - Accept and manage legal cases with smart contracts
🏆 Reputation System - Build your professional reputation on-chain
📱 Smart Reminders - AI-powered case management and client communication

Access your dashboard: ${process.env.FRONTEND_URL || 'https://hakichain.com'}/lawyer/dashboard

💡 Pro Tip: Start by exploring HakiLens AI to experience our cutting-edge legal research capabilities.

📧 Important: Please verify your email to activate all platform features.

🎯 Next Steps:
1. Complete your profile with specialization details
2. Set up your payment preferences for bounties  
3. Explore HakiLens AI with sample legal queries
4. Join our community forum for networking

Best regards,
The HakiChain Team

---
HakiChain - Democratizing Legal Services
Email: info@hakichain.com
Help: ${process.env.FRONTEND_URL || 'https://hakichain.com'}/help
      `
    }),

    emailVerification: (name, verificationUrl) => ({
      subject: "Verify your HakiChain email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #008080;">Verify Your Email</h2>
          <p>Hello ${name},</p>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}" style="background: #008080; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
      `,
      text: `Hello ${name}, please verify your email by visiting: ${verificationUrl}`
    })
  },

  // SendGrid integration
  async sendWithSendGrid(emailData) {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: emailData.to,
        from: {
          email: process.env.EMAIL_FROM_ADDRESS || 'info@hakichain.com',
          name: process.env.EMAIL_FROM_NAME || 'HakiChain Team'
        },
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        categories: [emailData.category || 'general'],
        customArgs: emailData.customArgs || {}
      };

      const result = await sgMail.send(msg);
      return { success: true, provider: 'sendgrid', result };
    } catch (error) {
      throw new Error(`SendGrid error: ${error.message}`);
    }
  },

  // AWS SES integration
  async sendWithAWS(emailData) {
    try {
      const AWS = require('aws-sdk');
      const ses = new AWS.SES({ 
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      });

      const params = {
        Source: `${process.env.EMAIL_FROM_NAME || 'HakiChain Team'} <${process.env.EMAIL_FROM_ADDRESS || 'info@hakichain.com'}>`,
        Destination: {
          ToAddresses: [emailData.to]
        },
        Message: {
          Subject: { Data: emailData.subject },
          Body: {
            Html: { Data: emailData.html },
            Text: { Data: emailData.text }
          }
        },
        Tags: [
          {
            Name: 'Category',
            Value: emailData.category || 'general'
          }
        ]
      };

      const result = await ses.sendEmail(params).promise();
      return { success: true, provider: 'aws-ses', result };
    } catch (error) {
      throw new Error(`AWS SES error: ${error.message}`);
    }
  },

  // Main send function that chooses the right provider
  async send(emailData) {
    const { to, subject, html, text, category, customArgs } = emailData;

    // Validate required fields
    if (!to || !subject || !html) {
      throw new Error('Missing required email fields: to, subject, html');
    }

    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Category: ${category || 'general'}`);

    // Choose email provider based on environment
    if (process.env.SENDGRID_API_KEY) {
      console.log('Using SendGrid for email delivery');
      return await this.sendWithSendGrid(emailData);
    } else if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('Using AWS SES for email delivery');
      return await this.sendWithAWS(emailData);
    } else {
      // Development mode - just log the email
      console.log('=== DEVELOPMENT MODE - EMAIL NOT ACTUALLY SENT ===');
      console.log('To:', to);
      console.log('From:', process.env.EMAIL_FROM_ADDRESS || 'info@hakichain.com');
      console.log('Subject:', subject);
      console.log('HTML length:', html.length);
      console.log('Text length:', text?.length || 0);
      console.log('Category:', category);
      console.log('Custom Args:', customArgs);
      console.log('=== END EMAIL LOG ===');
      
      return { 
        success: true, 
        provider: 'development', 
        note: 'Email logged but not sent in development mode' 
      };
    }
  },

  // Send welcome email to lawyer
  async sendLawyerWelcome(name, email, lskNumber) {
    const template = this.templates.lawyerWelcome(name, email, lskNumber);
    return await this.send({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      category: 'lawyer_welcome',
      customArgs: {
        user_type: 'lawyer',
        lsk_number: lskNumber || 'none',
        signup_date: new Date().toISOString()
      }
    });
  },

  // Send email verification
  async sendEmailVerification(name, email, verificationUrl) {
    const template = this.templates.emailVerification(name, verificationUrl);
    return await this.send({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      category: 'email_verification',
      customArgs: {
        verification_type: 'email',
        user_email: email
      }
    });
  }
};

module.exports = EmailService;
