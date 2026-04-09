const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/learnverse')
  .then(async () => {
    await mongoose.connection.collection('students').dropIndexes();
    console.log('All student indexes dropped!');
    process.exit(0);
  })
  .catch(err => {
    console.error("Error:", err.message);
    process.exit(1);
  });