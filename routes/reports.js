const express = require('express');
const router = express.Router();
const Enrollment = require('../models/ENrollment');

// AGGREGATION: Popular courses report
router.get('/popular', async (req, res) => {
  try {
    const report = await Enrollment.aggregate([
      // 1. Match only active and completed enrollments (ignore dropped)
      { $match: { status: { $in: ['active', 'completed'] } } },
      
      // 2. Group by course ID and count students
      { $group: { _id: '$courseId', studentCount: { $sum: 1 } } },
      
      // 3. Lookup course details from the 'courses' collection
      { $lookup: { 
          from: 'courses', 
          localField: '_id', 
          foreignField: '_id', 
          as: 'courseDetails' 
      }},
      
      // 4. Flatten the array
      { $unwind: '$courseDetails' },
      
      // 5. Project (Select) only the fields we need
      { $project: {
          _id: 1,
          title: '$courseDetails.title',
          instructor: '$courseDetails.instructor',
          category: '$courseDetails.category',
          studentCount: 1
      }},
      
      // 6. Sort by most popular (highest student count first)
      { $sort: { studentCount: -1 } }
    ]);

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;