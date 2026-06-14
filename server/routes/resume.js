const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

let downloadCount = 0;

// GET /api/resume/download — Public: download resume PDF
router.get('/download', (req, res) => {
  const resumePath = path.join(__dirname, '../uploads/Rakesh_resume.pdf');

  if (!fs.existsSync(resumePath)) {
    return res.status(404).json({
      success: false,
      message: 'Resume not found. Please place your resume.pdf in the server/uploads/ folder.',
    });
  }

  downloadCount++;
  console.log(`📄 Resume downloaded. Total downloads: ${downloadCount}`);

  res.download(resumePath, 'Rakesh_resume.pdf', (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ success: false, message: 'Error downloading file.' });
    }
  });
});

// GET /api/resume/count — Public: get download count
router.get('/count', (req, res) => {
  res.json({ success: true, count: downloadCount });
});

module.exports = router;
