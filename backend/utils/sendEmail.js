const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (16-char, no spaces)
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendEmail = async (options) => {
  const transporter = createTransporter();

  // Verify connection before sending
  try {
    await transporter.verify();
  } catch (err) {
    console.error('Email transporter verification failed:', err.message);
    throw new Error('Email service configuration error: ' + err.message);
  }

  const mailOptions = {
    from: `"StyleStore" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
  return info;
};

// Pre-built OTP email templates
const otpEmailTemplate = (otp, type = 'verification', expiryMins = 10) => {
  const isReset = type === 'reset';
  const title = isReset ? 'Reset Your Password' : 'Verify Your Email';
  const subtitle = isReset
    ? 'You requested a password reset for your StyleStore account.'
    : 'Welcome to StyleStore! Please verify your email to get started.';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background-color:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;max-width:90%;">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#1e293b,#0f172a);padding:32px 40px;text-align:center;border-bottom:1px solid #334155;">
                  <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">StyleStore</h1>
                  <p style="margin:8px 0 0;color:#64748b;font-size:13px;">Premium Fashion Destination</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <h2 style="margin:0 0 12px;color:#f1f5f9;font-size:20px;font-weight:700;">${title}</h2>
                  <p style="margin:0 0 32px;color:#94a3b8;font-size:15px;line-height:1.6;">${subtitle}</p>

                  <!-- OTP Box -->
                  <div style="background:#0f172a;border:1px solid #475569;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
                    <p style="margin:0 0 8px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Your OTP Code</p>
                    <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#ffffff;font-family:monospace;">${otp}</div>
                    <p style="margin:12px 0 0;color:#64748b;font-size:13px;">Valid for <strong style="color:#94a3b8;">${expiryMins} minutes</strong></p>
                  </div>

                  <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
                    ${isReset
                      ? 'Enter this OTP to reset your password. If you did not request a password reset, please ignore this email — your password will remain unchanged.'
                      : 'Enter this OTP in the verification screen to activate your account. If you did not sign up for StyleStore, please ignore this email.'}
                  </p>

                  <div style="border-top:1px solid #334155;padding-top:24px;">
                    <p style="margin:0;color:#475569;font-size:12px;text-align:center;">
                      🔒 For your security, never share this OTP with anyone.<br>
                      StyleStore will never ask for your OTP.
                    </p>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#0f172a;padding:20px 40px;text-align:center;border-top:1px solid #334155;">
                  <p style="margin:0;color:#475569;font-size:12px;">© 2024 StyleStore. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

module.exports = sendEmail;
module.exports.otpEmailTemplate = otpEmailTemplate;
