import nodemailer from 'nodemailer';
import axios from 'axios';

export async function sendEmailDynamicSMTP( recipient, formData, ApiURL) {

  const { data: settingsRes } = await axios.get(`${ApiURL}/EmailSetting`, {
    headers: {
      'APIKey': '1032',
    },
  });

  if (!settingsRes.success) {
    throw new Error('Failed to fetch SMTP settings');
  }

  const config = settingsRes.data;

  const transporter = nodemailer.createTransport({
    host: config.emailServer,
    port: config.portNumber,
    secure: config.useSSL,
    auth: {
      user: config.senderUsername,
      pass: config.senderPassword,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `"${config.senderName}" <${config.senderEmail}>`,
    to: recipient, // Change this to your desired recipient
    subject: formData.subject || 'New Contact Form Message',
    text: `
      Name: ${formData.name}
      Email: ${formData.email}
      Subject: ${formData.subject}
      Message: ${formData.message}
    `,
  };

  await transporter.sendMail(mailOptions);
}
