// server/routes/contact.js

import express from "express";
import rateLimit from "express-rate-limit";
import dbPool from "../config/db.js";

import {
  sendAdminNotification,
  sendCustomerConfirmation,
} from "../utils/email.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LENGTHS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 5000,
};

// Rate limiting: maximum 5 submissions per IP in 15 minutes.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submissions. Please try again later.",
  },
});

// Validate incoming contact form data.
const validateContactInput = (body = {}) => {
  const fields = ["name", "email", "subject", "message"];

  for (const field of fields) {
    if (typeof body[field] !== "string") {
      return `${field} is required and must be valid text.`;
    }

    const value = body[field].trim();

    if (!value) {
      return `${field} is required.`;
    }

    if (value.length > MAX_LENGTHS[field]) {
      return `${field} cannot exceed ${MAX_LENGTHS[field]} characters.`;
    }
  }

  if (!EMAIL_REGEX.test(body.email.trim())) {
    return "Please enter a valid email address.";
  }

  return null;
};

// Send both emails independently.
const sendEmailsAsync = async (contactData) => {
  const results = await Promise.allSettled([
    sendAdminNotification(contactData),
    sendCustomerConfirmation(contactData),
  ]);

  results.forEach((result, index) => {
    const emailType =
      index === 0 ? "Admin notification" : "Customer confirmation";

    if (result.status === "rejected") {
      console.error(`${emailType} failed:`, result.reason);
      return;
    }

    if (!result.value.success) {
      console.error(`${emailType} failed:`, result.value.error);
      return;
    }

    console.log(`${emailType} sent successfully.`);
  });
};

// POST /api/contact
router.post("/", contactLimiter, async (req, res) => {
  try {
    const validationError = validateContactInput(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const subject = req.body.subject.trim();
    const message = req.body.message.trim();

    // Save contact query in MySQL.
    const [result] = await dbPool.execute(
      `INSERT INTO contacts (name, email, subject, message)
       VALUES (?, ?, ?, ?)`,
      [name, email, subject, message]
    );

    const contactData = {
      id: result.insertId,
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    };

    // Emails are sent after successful database insertion.
    // Their failure will not affect the saved query.
    void sendEmailsAsync(contactData).catch((error) => {
      console.error("Contact email processing error:", error);
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been submitted successfully.",
      contactId: result.insertId,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your message right now. Please try again later.",
    });
  }
});

export default router;