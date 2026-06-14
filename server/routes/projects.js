const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { verifyToken } = require('../middleware/auth');

// GET /api/projects — Public: visible projects only
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ isVisible: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/projects/all — Admin: all projects including hidden
router.get('/all', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/projects — Admin
router.post('/', verifyToken, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project, message: 'Project created successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/projects/:id — Admin
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project, message: 'Project updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/projects/:id — Admin
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
