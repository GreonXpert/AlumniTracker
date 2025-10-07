const getInvitationTemplate = (registrationLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .header {
          background-color: #2c3e50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #27ae60;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">GreonXpert</div>
          <h2>Alumni Network Invitation</h2>
        </div>
        <div class="content">
          <h3>Welcome to Our Alumni Community!</h3>
          <p>Dear Alumni,</p>
          <p>We are excited to invite you to join the GreonXpert Alumni Network, a platform designed to keep our community connected and engaged.</p>
          <p>By joining, you'll be able to:</p>
          <ul>
            <li>Update and maintain your professional profile</li>
            <li>Connect with fellow alumni</li>
            <li>Share your career journey and achievements</li>
            <li>Stay updated with institution news and events</li>
          </ul>
          <p>Click the button below to create your account:</p>
          <center>
            <a href="${registrationLink}" class="button">Create Your Account</a>
          </center>
          <p style="font-size: 12px; color: #666;">
            Or copy and paste this link into your browser:<br>
            ${registrationLink}
          </p>
          <p><strong>Important:</strong> This invitation link will expire in 7 days for security reasons.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>The GreonXpert Team</p>
        </div>
        <div class="footer">
          <p>© 2024 GreonXpert. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getWelcomeTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .header {
          background-color: #27ae60;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">GreonXpert</div>
          <h2>Welcome to Alumni Network!</h2>
        </div>
        <div class="content">
          <h3>Account Successfully Created!</h3>
          <p>Dear ${name},</p>
          <p>Congratulations! Your alumni account has been successfully created.</p>
          <p>You can now:</p>
          <ul>
            <li>Complete your professional profile</li>
            <li>Add your work experiences and achievements</li>
            <li>Update your education details</li>
            <li>Connect with other alumni</li>
          </ul>
          <p>To get started, log in to your account and explore the features available to you.</p>
          <p>We're thrilled to have you as part of our alumni community!</p>
          <p>Best regards,<br>The GreonXpert Team</p>
        </div>
        <div class="footer">
          <p>© 2024 GreonXpert. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getPasswordResetTemplate = (resetLink, name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .header {
          background-color: #e74c3c;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #e74c3c;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Password Reset Request</h2>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
          <p>To reset your password, click the button below:</p>
          <center>
            <a href="${resetLink}" class="button">Reset Password</a>
          </center>
          <p style="font-size: 12px; color: #666;">
            Or copy and paste this link:<br>
            ${resetLink}
          </p>
          <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
          <p>Best regards,<br>The GreonXpert Team</p>
        </div>
        <div class="footer">
          <p>© 2024 GreonXpert. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  getInvitationTemplate,
  getWelcomeTemplate,
  getPasswordResetTemplate
};