import express from 'express';
import dbPool, { executeWithRetry } from '../config/db.js';
import { sendSubscriptionWelcomeEmail } from '../utils/email.js';

const router = express.Router();

// Email validation helper
const isValidEmail = (email) => {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

/**
 * POST /api/subscribe
 * Subscribe an email address to the newsletter, save in MySQL, and send confirmation email.
 */
router.post('/', async (req, res) => {
  const { email } = req.body || {};

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // Check if email already subscribed
    const [existing] = await executeWithRetry(
      'SELECT id, email, subscribed_at FROM subscribers WHERE LOWER(email) = ? LIMIT 1',
      [cleanEmail]
    );

    if (existing && existing.length > 0) {
      return res.status(200).json({
        success: true,
        alreadySubscribed: true,
        message: 'You are already subscribed to The Gift Studio newsletter!'
      });
    }

    // Insert new subscriber into MySQL
    const [result] = await executeWithRetry(
      'INSERT INTO subscribers (email) VALUES (?)',
      [cleanEmail]
    );

    // Send confirmation welcome email asynchronously
    sendSubscriptionWelcomeEmail(cleanEmail)
      .then((mailRes) => {
        if (!mailRes?.success) {
          console.warn(`[Subscribe] Email delivery failed for ${cleanEmail}:`, mailRes?.error);
        } else {
          console.log(`[Subscribe] Welcome email sent successfully to ${cleanEmail}`);
        }
      })
      .catch((mailErr) => {
        console.error(`[Subscribe] Error sending welcome email to ${cleanEmail}:`, mailErr.message);
      });

    return res.status(201).json({
      success: true,
      subscriberId: result.insertId,
      message: 'Thank you for subscribing! A confirmation email has been sent to your inbox.'
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to process subscription right now. Please try again later.'
    });
  }
});

/**
 * GET /api/subscribe (Optional admin/diagnostic endpoint to list subscribers count)
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await executeWithRetry(
      'SELECT id, email, subscribed_at FROM subscribers ORDER BY subscribed_at DESC LIMIT 50'
    );
    return res.json({
      success: true,
      count: rows.length,
      subscribers: rows
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
