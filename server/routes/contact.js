const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const { verifyToken } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');

// Initialize Resend (only if API key exists)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// POST /api/contact — Public (rate limited)
router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, subject, message } = req.body;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
      const userAgent = req.headers['user-agent'] || '';

      // Save message to DB first
      const saved = await Message.create({ name, email, subject, message, ipAddress, userAgent });

      if (resend && process.env.EMAIL_TO) {
        // Owner notification only
        try {
          const ownerResult = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: [process.env.EMAIL_TO],
            subject: `New Contact: ${subject}`,
            html: `
              <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#050816;color:#fff;border-radius:16px;padding:32px;border:1px solid rgba(0,245,255,0.2)">
                <h2 style="color:#00F5FF;margin:0 0 24px">New Portfolio Contact</h2>
                <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
                  <tr><td style="padding:8px 0;color:#888;width:80px">From</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
                  <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#00F5FF">${email}</a></td></tr>
                  <tr><td style="padding:8px 0;color:#888">Subject</td><td style="padding:8px 0">${subject}</td></tr>
                </table>
                <div style="background:rgba(255,255,255,0.05);border-left:3px solid #00F5FF;border-radius:8px;padding:16px">
                  <p style="color:#ccc;line-height:1.7;margin:0">${message.replace(/\n/g, '<br>')}</p>
                </div>
                <p style="margin-top:20px;color:#555;font-size:12px">Time: ${new Date().toLocaleString()} | IP: ${ipAddress}</p>
              </div>
            `,
          });
          console.log('✅ Owner notification sent! ID:', ownerResult?.data?.id);
        } catch (err) {
          console.error('❌ Owner notification FAILED:', err.message);
        }
      } else {
        console.log('INFO: Email skipped — RESEND_API_KEY or EMAIL_TO not set. Message saved to DB only.');
      }

      res.status(201).json({
        success: true,
        message: "Message sent successfully! I'll get back to you within 24-48 hours.",
        id: saved._id,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// GET /api/contact — Admin: all messages
router.get('/', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    const unreadCount = await Message.countDocuments({ isRead: false });
    res.json({ success: true, count: messages.length, unreadCount, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/contact/:id/read — Admin: mark as read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/contact/:id — Admin
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
