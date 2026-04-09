const express = require('express');
const router = express.Router();
const Enrollment = require('../models/ENrollment');

// GET all enrollments (Populate Student and Course data)
router.get('/', async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('studentId', 'name email')
      .populate('courseId', 'title category');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new enrollment
router.post('/', async (req, res) => {
  try {
    const newEnrollment = new Enrollment(req.body);
    const savedEnrollment = await newEnrollment.save();
    res.status(201).json(savedEnrollment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE enrollment
router.delete('/:id', async (req, res) => {
  try {
    await Enrollment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enrollment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;