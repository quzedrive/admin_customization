// sendMail.ts
import nodemailer from "nodemailer";

export default async function sendMail(
  name: string,
  content: string,
  userType: string
) {
  try {
    // Mailjet SMTP Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,          // in-v3.mailjet.com
      port: Number(process.env.SMTP_PORT),  // 587
      secure: false,                        // TLS on 587 → keep false
      auth: {
        user: process.env.SMTP_USER,        // Mailjet API Key
        pass: process.env.SMTP_PASS,        // Mailjet Secret Key
      },
    });

    // Send To: host OR customer inbox
    const toEmail =
      userType === "host"
        ? "support@quzeedrive.in"
        : "customersupport@quzeedrive.com";

    const mailOptions = {
      from: `"QuzeeDrive" <${process.env.FROM_EMAIL || "customersupport@quzeedrive.com"}>`,
      to: toEmail,
      subject: `New Contact Request from ${name}`,
      html: content,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 EMAIL SENT →", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ EMAIL ERROR: ", error);
    return { success: false, error: error.message };
  }
}
