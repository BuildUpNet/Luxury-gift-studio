// server/utils/email.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter = null;

// Escape HTML to prevent HTML injection.
const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Convert plain text into safe HTML with line breaks.
const formatMessage = (value = "") => {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
};

// Create SMTP transporter.
const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP configuration is incomplete.");
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
};

// Admin notification email.
export const sendAdminNotification = async (contactData) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      throw new Error("ADMIN_EMAIL is not configured.");
    }

    const mailer = getTransporter();

    const name = escapeHtml(contactData.name);
    const email = escapeHtml(contactData.email);
    const subject = escapeHtml(contactData.subject);
    const message = formatMessage(contactData.message);

    const contactId = escapeHtml(contactData.id ?? "N/A");

    const submittedAt = new Date(
      contactData.createdAt || Date.now()
    ).toLocaleString();

    await mailer.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,

      to: adminEmail,

      replyTo: {
        name: contactData.name,
        address: contactData.email,
      },

      subject: `New Contact Us Query: ${contactData.subject}`,

      text: `
New Contact Us Query

Query ID: ${contactData.id ?? "N/A"}
Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.subject}

Message:
${contactData.message}

Submitted At: ${submittedAt}
      `.trim(),

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

          <h2>New Contact Us Query</h2>

          <p><strong>Query ID:</strong> ${contactId}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>

          <div style="margin-top: 16px;">
            <strong>Message:</strong>
            <p>${message}</p>
          </div>

          <p>
            <strong>Submitted At:</strong>
            ${escapeHtml(submittedAt)}
          </p>

        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Admin notification email failed:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

// Customer acknowledgement email.
export const sendCustomerConfirmation = async (contactData) => {
  try {
    const mailer = getTransporter();

    const name = escapeHtml(contactData.name);
    const subject = escapeHtml(contactData.subject);
    const message = formatMessage(contactData.message);

    await mailer.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,

      to: contactData.email,

      subject: "We have received your message - The Gift Studio",

      text: `
Hi ${contactData.name},

Thank you for contacting The Gift Studio.

We have received your message and our team will review it.

Your query details:

Subject: ${contactData.subject}

Message:
${contactData.message}

Our team will get back to you as soon as possible.

Regards,
The Gift Studio Team
      `.trim(),

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

          <h2>Thank you for contacting The Gift Studio!</h2>

          <p>Hi ${name},</p>

          <p>
            We have received your message.
            Thank you for reaching out to us.
          </p>

          <h3>Your submitted query</h3>

          <p><strong>Subject:</strong> ${subject}</p>

          <p><strong>Message:</strong></p>

          <p>${message}</p>

          <p>
            Our team will review your query and get back to you.
          </p>

          <p>
            Regards,<br />
            The Gift Studio Team
          </p>

        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Customer confirmation email failed:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

// Verify SMTP connection when explicitly called.
export const testEmailConfiguration = async () => {
  try {
    const mailer = getTransporter();

    await mailer.verify();

    console.log("SMTP connection verified successfully.");

    return {
      success: true,
      message: "SMTP connection verified successfully.",
    };
  } catch (error) {
    console.error("SMTP verification failed:", error.message);

    return {
      success: false,
      message: error.message,
      error: error.message,
    };
  }
};