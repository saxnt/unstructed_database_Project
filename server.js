const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
const app      = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/learnverse')
  .then(() => {
    console.log('✅  MongoDB connected → learnverse');
    startServer();
  })
  .catch(err => {
    console.error('❌  MongoDB connection failed:', err.message);
    console.error('Make sure MongoDB is running: mongod');
    process.exit(1);
  });

app.use('/api/courses',     require('./routes/courses'));
app.use('/api/students',    require('./routes/students'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/reports',     require('./routes/reports'));

app.get('*', (req, res) => res.sendFile(path.join(__dirname,'public','index.html')));

function startServer() {
  app.listen(3000, () => console.log('🚀  http://localhost:3000'));
}