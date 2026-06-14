const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['cyan', 'violet', 'green', 'orange'], default: 'cyan' },
}, { _id: false });

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Project title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    emoji: { type: String, default: '🚀' },
    gradient: {
      type: String,
      default: 'linear-gradient(135deg,#0a1628,#1a0540)',
    },
    tags: [tagSchema],
    liveUrl: { type: String, default: '', trim: true },
    githubUrl: { type: String, default: '', trim: true },
    featured: { type: Boolean, default: false },
    featuredLabel: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
