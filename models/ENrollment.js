const mongoose = require('mongoose');
const enrollmentSchema = new mongoose.Schema({
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Course',  required: true },
  status:     { type: String, enum: ['active','completed','dropped'], default: 'active' },
  enrolledAt: { type: Date, default: Date.now },
  progress:   { type: Number, default: 0 }
});
module.exports = mongoose.model('Enrollment', enrollmentSchema);