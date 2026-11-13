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

// Admin notification for custom gifting inquiry
export const sendGiftingInquiryAdminNotification = async (inquiryData) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new Error("ADMIN_EMAIL is not configured.");
    }

    const mailer = getTransporter();
    const name = escapeHtml(inquiryData.name);
    const email = escapeHtml(inquiryData.email);
    const phone = escapeHtml(inquiryData.phone);
    const cityPincode = escapeHtml(inquiryData.city_pincode);
    const message = inquiryData.message ? formatMessage(inquiryData.message) : '<em>None specified</em>';
    const submittedAt = new Date(inquiryData.createdAt || Date.now()).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    const dashboardUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/admin/dashboard`;

    await mailer.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: adminEmail,
      replyTo: {
        name: inquiryData.name,
        address: inquiryData.email,
      },
      subject: `🎁 New Custom Gift Hamper Inquiry from ${inquiryData.name}`,
      text: `
New Custom Gift Hamper Inquiry Received!
Inquiry ID: #${inquiryData.id ?? 'N/A'}
Client Name: ${inquiryData.name}
Email: ${inquiryData.email}
Phone: ${inquiryData.phone}
City / Pincode: ${inquiryData.city_pincode}
Message / Requirements:
${inquiryData.message || 'None specified'}
Submitted At: ${submittedAt}

View Lead in Admin Dashboard: ${dashboardUrl}
      `.trim(),
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #111; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          <div style="background: #0d0d12; padding: 26px 30px; border-bottom: 3px solid #F4C95D;">
            <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #F4C95D; text-transform: uppercase;">The Gift Studio • Admin Alert</div>
            <h1 style="color: #ffffff; margin: 6px 0 0; font-size: 22px; font-weight: 700;">🎁 New Custom Hamper Lead</h1>
            <p style="color: #94a3b8; margin: 4px 0 0; font-size: 13px;">A prospective client submitted a bespoke gifting request</p>
          </div>
          <div style="padding: 28px 30px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; width: 140px; color: #64748b;">Inquiry ID:</td>
                <td style="padding: 10px 0; font-weight: 700; color: #0f172a;">#${escapeHtml(inquiryData.id ?? 'N/A')}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Client Name:</td>
                <td style="padding: 10px 0; font-weight: 700; color: #0f172a; font-size: 15px;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Email Address:</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Mobile Phone:</td>
                <td style="padding: 10px 0;"><a href="tel:${phone}" style="color: #0f172a; text-decoration: none; font-weight: 600;">${phone}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #64748b;">City / Pincode:</td>
                <td style="padding: 10px 0; color: #0f172a;">${cityPincode}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px 0; font-weight: 600; color: #64748b; vertical-align: top;">Requirements:</td>
                <td style="padding: 10px 0; color: #0f172a;">${message}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Submitted At:</td>
                <td style="padding: 10px 0; color: #64748b; font-size: 13px;">${escapeHtml(submittedAt)}</td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <a href="${dashboardUrl}" style="display: inline-block; background: #0d0d12; color: #F4C95D; padding: 13px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; letter-spacing: 0.5px; border: 1px solid #F4C95D;">
                Open Admin Dashboard →
              </a>
            </div>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Inquiry admin notification failed:", error.message);
    return { success: false, error: error.message };
  }
};

// Customer confirmation for custom gifting inquiry
export const sendGiftingInquiryCustomerConfirmation = async (inquiryData) => {
  try {
    const mailer = getTransporter();
    const name = escapeHtml(inquiryData.name);
    const cityPincode = escapeHtml(inquiryData.city_pincode);
    const message = inquiryData.message ? formatMessage(inquiryData.message) : '';

    await mailer.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: inquiryData.email,
      subject: "We’ve Received Your Custom Hamper Request ✨ | The Gift Studio",
      text: `
Dear ${inquiryData.name},

Thank you for choosing The Gift Studio for your bespoke gifting celebration!

We have successfully received your custom gifting inquiry:
- Client Name: ${inquiryData.name}
- Delivery Location: ${inquiryData.city_pincode}
${inquiryData.message ? `- Requirements / Message: ${inquiryData.message}\n` : ''}
Our bespoke gifting concierge team is already reviewing your preferences and will connect with you via phone and WhatsApp shortly with tailor-made hamper catalogs, gourmet pairings, and pricing proposals.

If you have urgent requirements, feel free to reply directly to this email.

Warm regards,
The Gift Studio Concierge Team
      `.trim(),
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2d3748; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          <div style="background: #0d0d12; padding: 32px 30px; border-bottom: 3px solid #F4C95D; text-align: center;">
            <div style="font-size: 11px; font-weight: 700; letter-spacing: 3px; color: #F4C95D; text-transform: uppercase; margin-bottom: 6px;">Bespoke Luxury Curation</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">THE GIFT STUDIO</h1>
            <p style="color: #cbd5e1; margin: 6px 0 0; font-size: 13px;">Artisanal Gourmet Hampers & Personalized Keepsakes</p>
          </div>
          <div style="padding: 32px 30px;">
            <h2 style="color: #0f172a; font-size: 19px; margin-top: 0; font-weight: 700;">Dear ${name},</h2>
            <p style="color: #475569; font-size: 14px; margin-bottom: 20px;">
              Thank you for reaching out to us. We have received your custom gifting request, and our bespoke gifting concierge is already preparing a tailor-made curation for your special occasion.
            </p>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Your Inquiry Summary</div>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; width: 140px;">Client Name:</td>
                  <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Destination:</td>
                  <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${cityPincode}</td>
                </tr>
                ${message ? `
                <tr>
                  <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Requirements:</td>
                  <td style="padding: 6px 0; color: #0f172a;">${message}</td>
                </tr>` : ''}
              </table>
            </div>

            <p style="color: #475569; font-size: 14px; margin-bottom: 24px;">
              Our gifting specialist will connect with you shortly with bespoke catalog recommendations, artisanal gourmet selections, and personalized packaging options.
            </p>

            <div style="padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
              Warm regards,<br>
              <strong style="color: #0f172a; font-size: 14px;">The Gift Studio Concierge Team</strong><br>
              <span style="font-size: 12px; color: #94a3b8;">Mumbai • Delhi • Bengaluru • Pan-India Delivery</span>
            </div>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Inquiry customer confirmation email failed:", error.message);
    return { success: false, error: error.message };
  }
};
