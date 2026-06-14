const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    page: { type: String, default: 'home' },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    country: { type: String, default: 'Unknown' },
    city: { type: String, default: '' },
    referrer: { type: String, default: '' },
    sessionId: { type: String, default: '' },
    duration: { type: Number, default: 0 }, // seconds spent on page
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSchema);
