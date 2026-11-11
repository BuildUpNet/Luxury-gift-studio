# Email Integration Setup Guide

## Overview
The Contact Us feature includes email notifications for both administrators and customers. This guide explains how to configure the email system.

## Environment Configuration

### 1. Edit the `.env` file
Update the following variables in `server/.env`:

```env
# Email Configuration for Contact Us Feature
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@thegiftstudio.com
EMAIL_FROM=noreply@thegiftstudio.com
```

### 2. Gmail Setup (Recommended)
For Gmail, you need to use an **App Password** instead of your regular password:

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Sign in with your Google account
3. Select "Mail" as the app
4. Select your device (or "Other" and name it "The Gift Studio")
5. Click "Generate"
6. Copy the 16-character password
7. Use this password as `SMTP_PASS`

### 3. Other Email Providers
For other email providers, use these settings:

| Provider | SMTP_HOST | SMTP_PORT | SMTP_SECURE |
|----------|-----------|-----------|-------------|
| Outlook | smtp-mail.outlook.com | 587 | false |
| Yahoo | smtp.mail.yahoo.com | 587 | false |
| iCloud | smtp.mail.me.com | 587 | false |
| Zoho | smtp.zoho.com | 587 | false |
| Custom | your-smtp-server.com | 587 | false |

## Testing the Email Configuration

### Option 1: Using npm script
```bash
cd server
npm run test-email
```

### Option 2: Direct test
```bash
cd server
node test-email.js
```

Expected output if successful:
```
✅ SUCCESS: Email configuration is working correctly.
Email configuration is working correctly!
```

### Option 3: Test via API
You can also test by submitting a contact form through the frontend or using curl:

```bash
curl -X POST http://localhost:5002/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Contact",
    "message": "This is a test message"
  }'
```

## Troubleshooting

### Common Issues

1. **"Email transporter not configured"**
   - Check that all SMTP_* variables are set in `.env`
   - Restart the server after changing `.env`

2. **Authentication failed**
   - For Gmail: Ensure you're using an App Password, not your regular password
   - Check that "Less secure app access" is enabled (for older accounts)
   - Verify email and password are correct

3. **Connection refused**
   - Check firewall settings for port 587
   - Verify SMTP server address is correct
   - Try using port 465 with `SMTP_SECURE=true`

4. **Emails not sending but no errors**
   - Check server logs for email sending attempts
   - Verify `ADMIN_EMAIL` is set correctly
   - Check spam/junk folders

### Debug Mode
To enable verbose logging, add this to your `.env`:
```env
EMAIL_DEBUG=true
```

## Email Templates

### 1. Admin Notification
- **To:** `ADMIN_EMAIL` from `.env`
- **Subject:** `[The Gift Studio] New Contact Form Submission: {subject}`
- **Content:** Includes all contact details, timestamp, and contact ID

### 2. Customer Confirmation
- **To:** Customer's email address
- **Subject:** `Thank you for contacting The Gift Studio!`
- **Content:** Thank you message, summary of submission, next steps

## Security Notes

1. **Never commit `.env` to version control**
2. **Use environment-specific credentials** (development/production)
3. **Regularly rotate App Passwords** for security
4. **Monitor email sending logs** for suspicious activity
5. **Consider rate limiting** to prevent spam

## Production Considerations

For production deployment:

1. Use a dedicated email service (SendGrid, Amazon SES, etc.)
2. Configure DKIM/SPF records for better deliverability
3. Implement email queuing for high-volume sites
4. Set up email bounce handling
5. Monitor email delivery rates

## Support
If you encounter issues:
1. Check server logs for error messages
2. Verify all environment variables are set
3. Test with the `npm run test-email` command
4. Consult the email provider's SMTP documentation