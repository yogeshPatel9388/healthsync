const nodemailer = require("nodemailer");

/**
 * Utility to send professional emails with a No-Reply sender name.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} text - Plain text version of the message
 */
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Secure port for SSL
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        // Prevents failure on local networks with self-signed certificates
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      // SETTING NO-REPLY NAME HERE:
      from: `"no-reply@HealthSync" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text, // Fallback for email clients that don't support HTML
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

          <div style="margin-top: 30px; padding: 15px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
            <p style="font-size: 12px; color: #64748b; margin: 0;">
              <strong>Note:</strong> This is an automated notification. Please <strong>do not reply</strong> to this email directly. 
              For support, visit our help center or contact us through the app dashboard.
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
    console.log("✅ Confirmation Email Sent. Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Email Error Details:", error);
  }
};

module.exports = sendEmail;
