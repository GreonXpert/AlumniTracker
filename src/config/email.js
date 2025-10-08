const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Alumni Tracker <onboarding@resend.dev>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log('Email sent via Resend');
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
