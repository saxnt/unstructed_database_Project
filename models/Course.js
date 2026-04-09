const mongoose = require('mongoose');
const sectionSchema = new mongoose.Schema({ sectionTitle: String, lessons: [String] });
const courseSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: String,
  instructor:  { type: String, required: true },
  category:    String,
  price:       { type: Number, default: 0 },
  duration:    { type: Number, default: 0 },
  level:       { type: String, enum: ['Beginner','Intermediate','Advanced'], default: 'Beginner' },
  thumbnail:   String,
  content:     [sectionSchema],
  createdAt:   { type: Date, default: Date.now }
});
courseSchema.index({ title: 'text', description: 'text', instructor: 'text' });
module.exports = mongoose.model('Course', courseSchema);