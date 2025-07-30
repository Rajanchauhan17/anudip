const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const createTransporter = () => {
  const config = {
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };

  return nodemailer.createTransporter(config);
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Welcome to SHOPINDIA - Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - SHOPINDIA</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF6B35, #004E89); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #FF6B35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
          .logo { font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🛍️ SHOPINDIA</div>
          <p>Discover Incredible India</p>
        </div>
        <div class="content">
          <h2>Welcome to SHOPINDIA, ${data.name}!</h2>
          <p>Thank you for joining our community of authentic Indian product lovers. To complete your registration and start shopping, please verify your email address.</p>
          <p>Click the button below to verify your email:</p>
          <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <p>If you didn't create an account with SHOPINDIA, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2024 SHOPINDIA. All rights reserved.</p>
          <p>Made with ❤️ for showcasing India's incredible heritage</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to SHOPINDIA, ${data.name}!
      
      Thank you for joining our community. Please verify your email address by visiting:
      ${data.verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account, please ignore this email.
      
      © 2024 SHOPINDIA
    `
  }),

  passwordReset: (data) => ({
    subject: 'SHOPINDIA - Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - SHOPINDIA</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF6B35, #004E89); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #FF6B35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
          .logo { font-size: 24px; font-weight: bold; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🛍️ SHOPINDIA</div>
          <p>Discover Incredible India</p>
        </div>
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Hello ${data.name},</p>
          <p>We received a request to reset your password for your SHOPINDIA account. Click the button below to create a new password:</p>
          <a href="${data.resetUrl}" class="button">Reset Password</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in 30 minutes</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password will remain unchanged until you create a new one</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p>© 2024 SHOPINDIA. All rights reserved.</p>
          <p>For security reasons, this email was sent from an automated system. Please do not reply.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request - SHOPINDIA
      
      Hello ${data.name},
      
      We received a request to reset your password. Visit this link to create a new password:
      ${data.resetUrl}
      
      This link will expire in 30 minutes.
      
      If you didn't request this reset, please ignore this email.
      
      © 2024 SHOPINDIA
    `
  }),

  orderConfirmation: (data) => ({
    subject: `Order Confirmation - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - SHOPINDIA</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF6B35, #004E89); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; font-size: 18px; color: #FF6B35; }
          .button { display: inline-block; background: #FF6B35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
          .logo { font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🛍️ SHOPINDIA</div>
          <p>Discover Incredible India</p>
        </div>
        <div class="content">
          <h2>Order Confirmed! 🎉</h2>
          <p>Hello ${data.customerName},</p>
          <p>Thank you for your order! We're excited to get your authentic Indian products to you.</p>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p><strong>Order Date:</strong> ${data.orderDate}</p>
            
            <h4>Items Ordered:</h4>
            ${data.items.map(item => `
              <div class="item">
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${item.price}</span>
              </div>
            `).join('')}
            
            <div class="item total">
              <span>Total Amount:</span>
              <span>₹${data.totalAmount}</span>
            </div>
          </div>
          
          <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
          
          <a href="${data.trackingUrl}" class="button">Track Your Order</a>
          
          <p>We'll send you updates as your order progresses. If you have any questions, feel free to contact our support team.</p>
        </div>
        <div class="footer">
          <p>© 2024 SHOPINDIA. All rights reserved.</p>
          <p>📞 +91-800-SHOPINDIA | 📧 support@shopindia.com</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Order Confirmed! - SHOPINDIA
      
      Hello ${data.customerName},
      
      Thank you for your order!
      
      Order Number: ${data.orderNumber}
      Order Date: ${data.orderDate}
      Total Amount: ₹${data.totalAmount}
      Estimated Delivery: ${data.estimatedDelivery}
      
      Track your order: ${data.trackingUrl}
      
      © 2024 SHOPINDIA
    `
  }),

  welcome: (data) => ({
    subject: 'Welcome to SHOPINDIA - Your Journey Begins!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SHOPINDIA</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF6B35, #004E89); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .feature { background: white; padding: 20px; border-radius: 5px; text-align: center; }
          .button { display: inline-block; background: #FF6B35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
          .logo { font-size: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🛍️ SHOPINDIA</div>
          <p>Discover Incredible India</p>
        </div>
        <div class="content">
          <h2>Welcome to SHOPINDIA, ${data.name}! 🎉</h2>
          <p>We're thrilled to have you join our community of authentic Indian product enthusiasts!</p>
          
          <p>At SHOPINDIA, you'll discover:</p>
          <div class="features">
            <div class="feature">
              <h4>🎨 Authentic Handicrafts</h4>
              <p>Traditional art and crafts from across India</p>
            </div>
            <div class="feature">
              <h4>🌶️ Premium Spices</h4>
              <p>Fresh, aromatic spices directly from farms</p>
            </div>
            <div class="feature">
              <h4>👗 Traditional Fashion</h4>
              <p>Beautiful ethnic wear and accessories</p>
            </div>
            <div class="feature">
              <h4>🏠 Home Decor</h4>
              <p>Elegant pieces to beautify your space</p>
            </div>
          </div>
          
          <a href="${data.shopUrl}" class="button">Start Shopping</a>
          
          <p>Get 10% off your first order with code: <strong>WELCOME10</strong></p>
          
          <p>Happy shopping!</p>
        </div>
        <div class="footer">
          <p>© 2024 SHOPINDIA. All rights reserved.</p>
          <p>Made with ❤️ for showcasing India's incredible heritage</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to SHOPINDIA, ${data.name}!
      
      We're thrilled to have you join our community!
      
      Discover authentic Indian products:
      - Traditional Handicrafts
      - Premium Spices
      - Traditional Fashion
      - Home Decor
      
      Get 10% off your first order with code: WELCOME10
      
      Start shopping: ${data.shopUrl}
      
      © 2024 SHOPINDIA
    `
  })
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Get template if specified
    let emailContent = {
      subject: options.subject,
      html: options.html,
      text: options.text
    };
    
    if (options.template && emailTemplates[options.template]) {
      emailContent = emailTemplates[options.template](options.data);
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"SHOPINDIA" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };
    
    // Add attachments if provided
    if (options.attachments) {
      mailOptions.attachments = options.attachments;
    }
    
    const result = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent successfully to ${options.email}`, {
      messageId: result.messageId,
      subject: emailContent.subject
    });
    
    return result;
    
  } catch (error) {
    logger.error('Email sending failed:', {
      error: error.message,
      to: options.email,
      subject: options.subject
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send bulk emails
const sendBulkEmail = async (recipients, emailOptions) => {
  const results = [];
  const batchSize = 10; // Send in batches to avoid rate limiting
  
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (recipient) => {
      try {
        const result = await sendEmail({
          ...emailOptions,
          email: recipient.email,
          data: { ...emailOptions.data, name: recipient.name }
        });
        
        return { email: recipient.email, success: true, messageId: result.messageId };
      } catch (error) {
        logger.error(`Bulk email failed for ${recipient.email}:`, error);
        return { email: recipient.email, success: false, error: error.message };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Wait between batches to avoid rate limiting
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  logger.info(`Bulk email completed: ${successful} successful, ${failed} failed`);
  
  return {
    total: recipients.length,
    successful,
    failed,
    results
  };
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info('Email configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('Email configuration verification failed:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  verifyEmailConfig,
  emailTemplates
};