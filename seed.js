// seed.js — run once: node seed.js
const mongoose = require('mongoose');
const Course     = require('./models/Course');
const Student    = require('./models/Student');
const Enrollment = require('./models/ENrollment');

const courses = [
  { title:"Complete React Developer Bootcamp", description:"Master React from zero to hero.", instructor:"Dr. Sarah Khan", category:"Web Development", price:89.99, duration:32, level:"Intermediate", content:[{sectionTitle:"Getting Started",lessons:["Intro to React","JSX Basics","Setting up CRA"]},{sectionTitle:"Hooks & State",lessons:["useState","useEffect","Custom Hooks"]},{sectionTitle:"Advanced Topics",lessons:["Redux Toolkit","React Router","Deployment"]}] },
  { title:"Python for Data Science & ML", description:"Learn Python, NumPy, Pandas, TensorFlow.", instructor:"Prof. Arjun Mehta", category:"Data Science", price:94.99, duration:48, level:"Beginner", content:[{sectionTitle:"Python Fundamentals",lessons:["Data Types","Control Flow","Functions"]},{sectionTitle:"Data Manipulation",lessons:["NumPy Arrays","Pandas DataFrames","Visualization"]},{sectionTitle:"Machine Learning",lessons:["Regression","Classification","Neural Networks"]}] },
  { title:"UI/UX Design Masterclass", description:"Learn Figma, design principles, prototyping.", instructor:"Maya Rodriguez", category:"Design", price:74.99, duration:28, level:"Beginner", content:[{sectionTitle:"Design Fundamentals",lessons:["Color Theory","Typography","Layout & Grids"]},{sectionTitle:"Figma Essentials",lessons:["Interface Tour","Components","Prototyping"]},{sectionTitle:"UX Process",lessons:["User Research","Personas","Usability Testing"]}] },
  { title:"Node.js & Express Backend Development", description:"Build scalable REST APIs with Node.js.", instructor:"James O'Brien", category:"Web Development", price:79.99, duration:36, level:"Intermediate", content:[{sectionTitle:"Node.js Core",lessons:["Event Loop","Modules","File System"]},{sectionTitle:"Express Framework",lessons:["Routing","Middleware","REST Best Practices"]},{sectionTitle:"Database & Auth",lessons:["MongoDB & Mongoose","JWT Auth","Bcrypt"]}] },
  { title:"Digital Marketing Strategy", description:"SEO, SEM, Social Media, Email campaigns.", instructor:"Fatima Al-Hassan", category:"Marketing", price:59.99, duration:20, level:"Beginner", content:[{sectionTitle:"Foundations",lessons:["Marketing Funnel","Target Audience","Brand Positioning"]},{sectionTitle:"Digital Channels",lessons:["SEO Basics","Google Ads","Email Marketing"]},{sectionTitle:"Analytics & Growth",lessons:["Google Analytics","A/B Testing","Conversion Optimization"]}] },
  { title:"Advanced JavaScript & TypeScript", description:"Deep dive into closures, async/await, TypeScript.", instructor:"Dr. Sarah Khan", category:"Programming", price:84.99, duration:30, level:"Advanced", content:[{sectionTitle:"JS Deep Dive",lessons:["Closures","Prototypes","Event Loop"]},{sectionTitle:"Async JavaScript",lessons:["Promises","Async/Await","Generators"]},{sectionTitle:"TypeScript",lessons:["Types & Interfaces","Generics","Decorators"]}] },
  { title:"Business Strategy & Entrepreneurship", description:"From idea to launch. Business model canvas.", instructor:"Michael Chen", category:"Business", price:0, duration:15, level:"Beginner", content:[{sectionTitle:"Idea Validation",lessons:["Problem-Solution Fit","Market Research","MVP Design"]},{sectionTitle:"Business Fundamentals",lessons:["Financial Modeling","Pricing Strategy","Team Building"]}] },
  { title:"MongoDB & Database Design", description:"Master MongoDB schema design, aggregation pipelines.", instructor:"Prof. Arjun Mehta", category:"Programming", price:69.99, duration:22, level:"Intermediate", content:[{sectionTitle:"MongoDB Fundamentals",lessons:["Documents & Collections","CRUD Operations","Indexes"]},{sectionTitle:"Aggregation",lessons:["Pipeline Stages","Group & Sort","Lookup Joins"]},{sectionTitle:"Advanced",lessons:["Schema Design Patterns","Transactions","Atlas Search"]}] }
];

const students = [
  { name:"Ali Hassan",      email:"ali.hassan@email.com",    phone:"+880171234567", city:"Dhaka" },
  { name:"Priya Sharma",    email:"priya.sharma@email.com",  phone:"+919876543210", city:"Mumbai" },
  { name:"Md. Rafiq Islam", email:"rafiq.islam@email.com",   phone:"+880181234567", city:"Chittagong" },
  { name:"Sarah Ahmed",     email:"sarah.ahmed@email.com",   phone:"+880191234567", city:"Dhaka" },
  { name:"James Wilson",    email:"james.w@email.com",       phone:"+447911123456", city:"London" },
  { name:"Fatima Noor",     email:"fatima.noor@email.com",   phone:"+923001234567", city:"Karachi" },
  { name:"Chen Wei",        email:"chen.wei@email.com",      phone:"+8613912345678",city:"Beijing" },
  { name:"Lena Müller",     email:"lena.m@email.com",        phone:"+4915212345678",city:"Berlin" },
  { name:"Omar Abdullah",   email:"omar.ab@email.com",       phone:"+966501234567", city:"Riyadh" },
  { name:"Aisha Bello",     email:"aisha.b@email.com",       phone:"+2348012345678",city:"Lagos" }
];

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/learnverse');
  console.log('Connected...');

  // Clear old data
  await Course.deleteMany({});
  await Student.deleteMany({});
  await Enrollment.deleteMany({});
  console.log('Cleared old data.');

  // Insert courses & students
  const insertedCourses  = await Course.insertMany(courses);
  const insertedStudents = await Student.insertMany(students);
  console.log(`Inserted ${insertedCourses.length} courses, ${insertedStudents.length} students.`);

  // Map position → real MongoDB _id
  const C = insertedCourses;   // C[0]=React, C[1]=Python, etc.
  const S = insertedStudents;  // S[0]=Ali, S[1]=Priya, etc.

  const enrollments = [
    { studentId:S[0]._id, courseId:C[0]._id, status:'active' },
    { studentId:S[0]._id, courseId:C[1]._id, status:'active' },
    { studentId:S[1]._id, courseId:C[0]._id, status:'completed' },
    { studentId:S[1]._id, courseId:C[2]._id, status:'active' },
    { studentId:S[2]._id, courseId:C[1]._id, status:'active' },
    { studentId:S[2]._id, courseId:C[3]._id, status:'active' },
    { studentId:S[3]._id, courseId:C[0]._id, status:'active' },
    { studentId:S[3]._id, courseId:C[5]._id, status:'active' },
    { studentId:S[4]._id, courseId:C[3]._id, status:'completed' },
    { studentId:S[4]._id, courseId:C[7]._id, status:'active' },
    { studentId:S[5]._id, courseId:C[4]._id, status:'active' },
    { studentId:S[5]._id, courseId:C[2]._id, status:'active' },
    { studentId:S[6]._id, courseId:C[1]._id, status:'active' },
    { studentId:S[6]._id, courseId:C[7]._id, status:'active' },
    { studentId:S[7]._id, courseId:C[2]._id, status:'active' },
    { studentId:S[7]._id, courseId:C[5]._id, status:'dropped' },
    { studentId:S[8]._id, courseId:C[0]._id, status:'active' },
    { studentId:S[8]._id, courseId:C[6]._id, status:'active' },
    { studentId:S[9]._id, courseId:C[4]._id, status:'active' },
    { studentId:S[9]._id, courseId:C[1]._id, status:'active' }
  ];

  await Enrollment.insertMany(enrollments);
  console.log(`Inserted ${enrollments.length} enrollments.`);
  console.log('✅ Seed complete! Now run: node server.js');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });