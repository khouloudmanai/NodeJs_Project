require('dotenv').config();
const EmailService = require('./mailer/Emailservice.js');

const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const emailService = new EmailService(emailConfig);

async function testEmailService() {
  // Verify connection
  const isConnected = await emailService.verifyConnection();
  if (!isConnected) {
    console.error('Failed to connect to email service');
    return;
  }

  // Send a test email
  const emailSent = await emailService.sendEmail({
    to: 'saifeddineridene@gmail.com', // Replace with recipient email
    subject: 'Test Email',
    text: 'This is a test email.',
  });

  if (emailSent) {
    console.log('Test email sent successfully');
  } else {
    console.error('Failed to send test email');
  }

  // Send a welcome email
  const welcomeEmailSent = await emailService.sendWelcomeEmail('recipient@example.com', 'Recipient Name'); // Replace with recipient email and name

  if (welcomeEmailSent) {
    console.log('Welcome email sent successfully');
  } else {
    console.error('Failed to send welcome email');
  }
}

testEmailService();