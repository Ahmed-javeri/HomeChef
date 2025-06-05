const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST feedback
router.post('/submit', async (req, res) => {
  try {
    const { customerId, chefId, message } = req.body;

    if (!customerId || !chefId || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newFeedback = new Feedback({
      customerId,
      chefId,
      message
    });

    const saved = await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted', feedback: saved });

  } catch (err) {
    console.error('❌ Error submitting feedback:', err);
    res.status(500).json({ message: 'Failed to submit feedback', error: err });
  }
});
// GET all feedbacks (admin view)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('customerId', 'name email')
      .populate('chefId', 'name email');
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error('❌ Failed to fetch feedback:', err);
    res.status(500).json({ message: 'Error fetching feedback', err });
  }
});

module.exports = router;
