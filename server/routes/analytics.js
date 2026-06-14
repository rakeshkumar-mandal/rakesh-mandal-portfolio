const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const { verifyToken } = require('../middleware/auth');

// POST /api/analytics — Public: track a page visit
router.post('/', async (req, res) => {
  try {
    const { page, sessionId, referrer } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const userAgent = req.headers['user-agent'] || '';

    await Analytics.create({
      page: page || 'home',
      ipAddress,
      userAgent,
      sessionId: sessionId || '',
      referrer: referrer || req.headers.referer || '',
    });

    res.json({ success: true });
  } catch (err) {
    // Don't expose analytics errors to users
    res.json({ success: true });
  }
});

// GET /api/analytics — Admin: get visitor stats
router.get('/', verifyToken, async (req, res) => {
  try {
    const totalVisits = await Analytics.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisits = await Analytics.countDocuments({ createdAt: { $gte: today } });

    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekVisits = await Analytics.countDocuments({ createdAt: { $gte: last7Days } });

    const uniqueIPs = await Analytics.distinct('ipAddress');
    const recentVisits = await Analytics.find().sort({ createdAt: -1 }).limit(20);

    // Page breakdown
    const pageBreakdown = await Analytics.aggregate([
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalVisits,
        todayVisits,
        weekVisits,
        uniqueVisitors: uniqueIPs.length,
        pageBreakdown,
        recentVisits,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
