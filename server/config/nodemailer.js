import nodemailer from 'nodemailer';

// Transporter (uses mock SMTP Trap or Twilio/Sendgrid values)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass'
  }
});

export const sendHtmlEmail = async (to, subject, htmlContent) => {
  try {
    // If SMTP is mock/placeholder, log and bypass
    if (process.env.SMTP_HOST === 'smtp.mailtrap.io' || !process.env.SMTP_HOST) {
      console.log(`[SMTP SIMULATOR] Bypassed email to: ${to} | Subject: ${subject}`);
      return { success: true, messageId: 'simulated_id' };
    }

    const info = await transporter.sendMail({
      from: `"UCab Platform" <${process.env.SMTP_FROM || 'noreply@ucab.com'}>`,
      to,
      subject,
      html: htmlContent
    });
    return info;
  } catch (err) {
    console.error('Nodemailer failed to send email:', err);
    throw err;
  }
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #121212;">
      <h2 style="color: #FFC107;">Welcome to UCab, ${user.fullName}!</h2>
      <p>Your account is registered successfully as a <strong>${user.role}</strong>.</p>
      <p>Start traveling or earning right away!</p>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <small style="color: #777;">This is a system email, please do not reply.</small>
    </div>
  `;
  return await sendHtmlEmail(user.email, 'Welcome to UCab!', html);
};

export const sendPaymentReceipt = async (user, amount, txnId) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #121212;">
      <h2 style="color: #FFC107;">Payment Receipt</h2>
      <p>Thank you for traveling with UCab.</p>
      <p><strong>Transaction ID:</strong> <code>${txnId}</code></p>
      <p><strong>Amount Charged:</strong> $${amount}</p>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <small style="color: #777;">This is a system email, please do not reply.</small>
    </div>
  `;
  return await sendHtmlEmail(user.email, 'Your UCab Payment Receipt', html);
};

export default transporter;
