const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');

// @route GET /api/progress
router.get('/', protect, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user._id });
    }

    const aptPercent = Math.round((progress.aptitude.score / progress.aptitude.total) * 100);
    const dsaPercent = Math.round((progress.dsa.score / progress.dsa.total) * 100);
    const intScore = progress.interview.submissions.length > 0
      ? Math.round(progress.interview.submissions.reduce((s, i) => s + i.score, 0) / progress.interview.submissions.length)
      : 0;

    // Determine weak areas
    const areas = [
      { name: 'Aptitude', score: aptPercent },
      { name: 'DSA & Problem Solving', score: dsaPercent },
      { name: 'Interview & GD', score: intScore }
    ];
    const weakAreas = areas.filter(a => a.score < 50).sort((a, b) => a.score - b.score);

    res.json({
      aptitude: {
        score: progress.aptitude.score,
        total: progress.aptitude.total,
        percent: aptPercent,
        completed: progress.aptitude.completed,
        attempts: progress.aptitude.attempts
      },
      dsa: {
        score: progress.dsa.score,
        total: progress.dsa.total,
        percent: dsaPercent,
        completed: progress.dsa.completed
      },
      interview: {
        score: intScore,
        total: 100,
        percent: intScore,
        completed: progress.interview.completed,
        submissions: progress.interview.submissions
      },
      overallScore: Math.round((aptPercent + dsaPercent + intScore) / 3),
      weakAreas,
      lastUpdated: progress.lastUpdated
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route DELETE /api/progress/reset
router.delete('/reset', protect, async (req, res) => {
  try {
    await Progress.findOneAndDelete({ userId: req.user._id });
    await Progress.create({ userId: req.user._id });
    res.json({ message: 'Progress reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
