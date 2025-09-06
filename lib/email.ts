// Email utility functions for sending transactional emails
// In production, you would use services like SendGrid, Mailgun, or AWS SES

import nodemailer from 'nodemailer'

// Create transporter (configure with your email service)
const createTransporter = () => {
  // For development, you can use a service like Gmail or Outlook
  // For production, use professional email services
  
  if (process.env.NODE_ENV === 'development') {
    // For development, you can use Ethereal Email (fake SMTP service)
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    })
  }
  
  // Production configuration (update with your email service)
  return nodemailer.createTransporter({
    service: 'gmail', // or your preferred service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
) {
  const transporter = createTransporter()
  
  // Create reset URL
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@springz.com',
    to: email,
    subject: 'Reset Your Springz Nutrition Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .warning { background: #fef3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌱 Springz Nutrition</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hello ${name || 'there'},</p>
              <p>We received a request to reset your password for your Springz Nutrition account. If you made this request, click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              
              <div class="warning">
                <p><strong>⚠️ Important:</strong></p>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this reset, you can safely ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="background: #f0f0f0; padding: 10px; border-radius: 4px; font-family: monospace; word-break: break-all;">
                ${resetUrl}
              </p>
              
              <p>Need help? Contact our support team at support@springz.com</p>
              
              <p>Best regards,<br>The Springz Nutrition Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Springz Nutrition. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Reset Your Springz Nutrition Password
      
      Hello ${name || 'there'},
      
      We received a request to reset your password for your Springz Nutrition account.
      
      To reset your password, visit this link:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request this reset, you can safely ignore this email.
      
      Need help? Contact our support team at support@springz.com
      
      Best regards,
      The Springz Nutrition Team
    `
  }
  
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    throw error
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const transporter = createTransporter()
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@springz.com',
    to: email,
    subject: 'Welcome to Springz Nutrition! 🌱',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Springz Nutrition</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌱 Welcome to Springz Nutrition!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'there'}!</h2>
              <p>Welcome to Springz Nutrition - your trusted partner in health and wellness!</p>
              <p>We're excited to have you join our community of health-conscious individuals who prioritize premium nutrition and natural supplements.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" class="button">Start Shopping</a>
              </div>
              
              <p>Here's what you can look forward to:</p>
              <ul>
                <li>🌿 Premium quality supplements and nutrition products</li>
                <li>📚 Expert health and wellness guidance</li>
                <li>🚚 Fast and reliable delivery</li>
                <li>💰 Exclusive member discounts and offers</li>
                <li>🤝 Dedicated customer support</li>
              </ul>
              
              <p>If you have any questions or need assistance, our support team is here to help at support@springz.com</p>
              
              <p>Thank you for choosing Springz Nutrition for your health journey!</p>
              
              <p>Best regards,<br>The Springz Nutrition Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Springz Nutrition. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
  
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    throw error
  }
}
