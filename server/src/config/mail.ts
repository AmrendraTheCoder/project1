import nodemailer from "nodemailer";
import "dotenv/config";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Add this for better debugging
  logger: process.env.NODE_ENV !== "production",
});

export const sendEmail = async (to: string, subject: string, body: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Use the same as auth user
      to: to,
      subject: subject,
      html: body,
    });
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error in sendEmail function:", error);
    throw error;
  }
};
