const nodemailer = require("nodemailer");

/**
 * Utility to send professional emails with a No-Reply sender name.
 * Optimized for Port 587 to avoid Render ETIMEDOUT errors.
 */
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // ✅ Correct port for STARTTLS (Standard for cloud hosting)
      pool: true, // ✅ Reuses connection for dual emails (Patient & Doctor)
      secure: false, // ✅ Must be false for Port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Your 16-digit App Password
      },
      tls: {
        // Essential to bypass Render's network handshaking blocks
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"HealthSync No-Reply" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text, // Fallback for plain-text email clients
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #e0e0e0; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0;">HealthSync</h1>
            <p style="color: #64748b; font-size: 14px;">Your Trusted Healthcare Partner</p>
          </div>
          
          <div style="color: #1e293b; line-height: 1.6; font-size: 16px;">
            <h3 style="color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Appointment Notification</h3>
            <p>${text.replace(/\n/g, "<br>")}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://healthsync-two.vercel.app/" 
               style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
               Visit Patient Dashboard
            </a>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
            <p style="font-size: 12px; color: #64748b; margin: 0;">
              <strong>Note:</strong> This is an automated notification. Please <strong>do not reply</strong> to this email directly. 
              Manage your schedule at <a href="https://healthsync-two.vercel.app/" style="color: #2563eb; font-weight: bold;">HealthSync</a>.
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <footer style="text-align: center; font-size: 11px; color: #94a3b8;">
            © 2025 HealthSync Hospital Management System. All rights reserved.
          </footer>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation Email Sent to ${to}. ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Email Delivery Failed:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
