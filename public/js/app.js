const API_URL = 'http://localhost:3000/api';

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  loadDashboardData();
});

// --- NAVIGATION ---
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update Active Nav
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      // Update Active Page
      const targetPage = item.getAttribute('data-page');
      pages.forEach(p => p.classList.remove('active'));
      document.getElementById(`page-${targetPage}`).classList.add('active');

      // Load specific page data
      if (targetPage === 'dashboard') loadDashboardData();
      if (targetPage === 'courses') loadCourses();
      if (targetPage === 'students') loadStudents();
      if (targetPage === 'enrollments') loadEnrollments();
      if (targetPage === 'analytics') loadAnalytics();
    });
  });
}

function navigateTo(pageId) {
  document.querySelector(`[data-page="${pageId}"]`).click();
}

// --- MODAL CONTROLS ---
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// --- DATA FETCHING & RENDERING ---

async function loadDashboardData() {
  try {
    const [courses, students, enrollments, reports] = await Promise.all([
      fetch(`${API_URL}/courses`).then(res => res.json()),
      fetch(`${API_URL}/students`).then(res => res.json()),
      fetch(`${API_URL}/enrollments`).then(res => res.json()),
      fetch(`${API_URL}/reports/popular`).then(res => res.json())
    ]);

    // 1. Update the Top Stat Cards
    document.getElementById('totalCourses').textContent = courses.length;
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalEnrollments').textContent = enrollments.length;
    
    if (reports.length > 0) {
      document.getElementById('popularCourse').textContent = reports[0].title.substring(0, 15) + '...';
    }

    // 2. Render Popular Courses List (Top 3)
    const popularList = document.getElementById('popularList');
    popularList.innerHTML = ''; // Clear the skeleton loaders
    
    reports.slice(0, 3).forEach(report => {
      popularList.innerHTML += `
        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border);">
          <div>
            <div style="font-weight: 600; color: var(--text);">${report.title}</div>
            <div style="font-size: 12px; color: var(--text2); margin-top: 4px;">${report.category}</div>
          </div>
          <div style="font-weight: 600; color: var(--accent);">${report.studentCount} students</div>
        </div>
      `;
    });

    // 3. Render Recent Enrollments List (Last 3)
    const recentList = document.getElementById('recentEnrollments');
    recentList.innerHTML = ''; // Clear the skeleton loaders
    
    // Reverse the array to get the newest ones first, then grab the top 3
    const recent = [...enrollments].reverse().slice(0, 3);
    
    recent.forEach(en => {
      const studentName = en.studentId ? en.studentId.name : 'Unknown Student';
      const courseTitle = en.courseId ? en.courseId.title : 'Unknown Course';
      
      recentList.innerHTML += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border);">
          <div>
            <div style="font-weight: 600; color: var(--text);">${studentName}</div>
            <div style="font-size: 12px; color: var(--text2); margin-top: 4px;">enrolled in ${courseTitle}</div>
          </div>
          <span class="badge" style="text-transform: capitalize;">${en.status}</span>
        </div>
      `;
    });

  } catch (error) {
    console.error('Error loading dashboard stats', error);
  }
}

async function loadCourses() {
  try {
    const res = await fetch(`${API_URL}/courses`);
    const courses = await res.json();
    const grid = document.getElementById('coursesGrid');
    grid.innerHTML = '';

    courses.forEach(course => {
      grid.innerHTML += `
        <div class="card">
          <div class="card-header">
            <h3>${course.title}</h3>
            <span class="badge">${course.category}</span>
          </div>
          <p>${course.description}</p>
          <div style="margin-top: 10px; color: var(--text2); font-size: 12px;">
            <p>Instructor: ${course.instructor}</p>
            <p>Price: $${course.price}</p>
          </div>
          <button class="btn-ghost" style="margin-top: 10px; width: 100%;" onclick="deleteCourse('${course._id}')">Delete Course</button>
        </div>
      `;
    });
  } catch (error) {
    console.error('Error loading courses:', error);
  }
}

async function loadStudents() {
  try {
    const res = await fetch(`${API_URL}/students`);
    const students = await res.json();
    const tbody = document.getElementById('studentsBody');
    tbody.innerHTML = '';

    students.forEach((student, index) => {
      tbody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.city || 'N/A'}</td>
          <td>${new Date(student.enrolledAt).toLocaleDateString()}</td>
          <td><button class="btn-ghost" onclick="deleteStudent('${student._id}')">Delete</button></td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Error loading students:', error);
  }
}

async function loadEnrollments() {
  try {
    const res = await fetch(`${API_URL}/enrollments`);
    const enrollments = await res.json();
    const tbody = document.getElementById('enrollBody');
    tbody.innerHTML = '';

    // Populate dropdowns for the modal
    populateEnrollmentDropdowns();

    enrollments.forEach((en, index) => {
      const studentName = en.studentId ? en.studentId.name : 'Unknown Student';
      const courseTitle = en.courseId ? en.courseId.title : 'Unknown Course';
      
      tbody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${studentName}</td>
          <td>${courseTitle}</td>
          <td>${new Date(en.enrolledAt).toLocaleDateString()}</td>
          <td><span class="badge">${en.status}</span></td>
          <td><button class="btn-ghost" onclick="deleteEnrollment('${en._id}')">Delete</button></td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Error loading enrollments:', error);
  }
}

async function populateEnrollmentDropdowns() {
  const [students, courses] = await Promise.all([
    fetch(`${API_URL}/students`).then(res => res.json()),
    fetch(`${API_URL}/courses`).then(res => res.json())
  ]);

  const studentSelect = document.getElementById('enrollStudent');
  const courseSelect = document.getElementById('enrollCourse');

  studentSelect.innerHTML = '<option value="">Choose student...</option>';
  courseSelect.innerHTML = '<option value="">Choose course...</option>';

  students.forEach(s => studentSelect.innerHTML += `<option value="${s._id}">${s.name}</option>`);
  courses.forEach(c => courseSelect.innerHTML += `<option value="${c._id}">${c.title}</option>`);
}

async function loadAnalytics() {
  try {
    const res = await fetch(`${API_URL}/reports/popular`);
    const reports = await res.json();
    
    // 1. Full Popularity Report (Table)
    const tbody = document.getElementById('reportBody');
    tbody.innerHTML = '';

    reports.forEach((report, index) => {
      tbody.innerHTML += `
        <tr>
          <td>#${index + 1}</td>
          <td>${report.title}</td>
          <td>${report.instructor}</td>
          <td>${report.category}</td>
          <td><strong>${report.studentCount}</strong></td>
          <td>${index === 0 ? '🏆 Top Pick' : 'Trending'}</td>
        </tr>
      `;
    });

    if (reports.length === 0) return; // Exit if no data

    // 2. Most Popular Course (Spotlight Card)
    const topCourse = reports[0];
    const spotlight = document.getElementById('popularSpotlight');
    spotlight.innerHTML = `
      <div style="text-align: center; padding: 20px 10px;">
        <div style="font-size: 48px; margin-bottom: 12px;">🏆</div>
        <h2 style="color: var(--accent); margin-bottom: 8px; font-family: var(--font-display);">${topCourse.title}</h2>
        <p style="color: var(--text2); margin-bottom: 20px;">Taught by ${topCourse.instructor}</p>
        <div style="display: inline-block; background: rgba(200,240,96,0.1); border: 1px solid rgba(200,240,96,0.3); color: var(--accent); padding: 8px 16px; border-radius: 20px; font-weight: 600;">
          ${topCourse.studentCount} Active Enrollments
        </div>
      </div>
    `;

    // 3. Students per Course (CSS Bar Chart - Top 5)
    const barChart = document.getElementById('barChart');
    barChart.innerHTML = '<div style="padding-top: 10px;"></div>';
    
    // Find the highest student count to calculate percentage widths for the bars
    const maxStudents = Math.max(...reports.map(r => r.studentCount));

    reports.slice(0, 5).forEach(report => {
      const widthPct = (report.studentCount / maxStudents) * 100;
      // Truncate long titles so they fit nicely
      const shortTitle = report.title.length > 30 ? report.title.substring(0, 30) + '...' : report.title;
      
      barChart.innerHTML += `
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
            <span style="color: var(--text);">${shortTitle}</span>
            <span style="color: var(--text2); font-weight: 600;">${report.studentCount}</span>
          </div>
          <div style="width: 100%; background: var(--bg3); height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="width: ${widthPct}%; background: var(--accent2); height: 100%; border-radius: 4px; transition: width 1s ease;"></div>
          </div>
        </div>
      `;
    });

    // 4. Enrollment Distribution (Category Breakdown)
    const donutChart = document.getElementById('donutChart');
    
    // Group all enrollments by category
    const categoryCounts = {};
    let totalEnrollments = 0;
    
    reports.forEach(r => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + r.studentCount;
      totalEnrollments += r.studentCount;
    });

    // Generate a clean list view with indicator dots
    donutChart.innerHTML = '<div style="display: flex; flex-direction: column; gap: 14px; padding-top: 10px;">';
    const colors = ['var(--accent)', 'var(--accent2)', 'var(--accent3)', '#4ade80', '#fbbf24', '#60a5fa'];
    let colorIdx = 0;

    for (const [category, count] of Object.entries(categoryCounts)) {
      const pct = Math.round((count / totalEnrollments) * 100);
      const color = colors[colorIdx % colors.length];
      
      donutChart.innerHTML += `
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${color};"></div>
            <span style="color: var(--text); font-size: 14px;">${category}</span>
          </div>
          <div style="text-align: right;">
            <span style="color: var(--text); font-weight: 600; font-size: 14px;">${pct}%</span>
            <span style="color: var(--text3); font-size: 12px; margin-left: 6px;">(${count})</span>
          </div>
        </div>
      `;
      colorIdx++;
    }
    donutChart.innerHTML += '</div>';

  } catch (error) {
    console.error('Error loading analytics:', error);
  }
}

// --- FORM SUBMISSIONS (CRUD) ---

async function submitCourse(event) {
  event.preventDefault();
  const data = {
    title: document.getElementById('courseTitle').value,
    description: document.getElementById('courseDesc').value,
    instructor: document.getElementById('courseInstructor').value,
    category: document.getElementById('courseCategory').value,
    price: document.getElementById('coursePrice').value || 0
  };

  try {
    await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    closeModal('courseModal');
    document.getElementById('courseForm').reset();
    loadCourses();
    loadDashboardData();
  } catch (error) {
    console.error('Error adding course:', error);
  }
}

async function submitStudent(event) {
  event.preventDefault();
  const data = {
    name: document.getElementById('studentName').value,
    email: document.getElementById('studentEmail').value,
    phone: document.getElementById('studentPhone').value,
    city: document.getElementById('studentCity').value
  };

  try {
    await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    closeModal('studentModal');
    document.getElementById('studentForm').reset();
    loadStudents();
    loadDashboardData();
  } catch (error) {
    console.error('Error adding student:', error);
  }
}

async function submitEnrollment(event) {
  event.preventDefault();
  const data = {
    studentId: document.getElementById('enrollStudent').value,
    courseId: document.getElementById('enrollCourse').value,
    status: document.getElementById('enrollStatus').value
  };

  try {
    await fetch(`${API_URL}/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    closeModal('enrollModal');
    document.getElementById('enrollForm').reset();
    loadEnrollments();
    loadDashboardData();
  } catch (error) {
    console.error('Error adding enrollment:', error);
  }
}

// --- DELETE FUNCTIONS ---
async function deleteCourse(id) {
  if (confirm('Delete this course?')) {
    await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
    loadCourses();
    loadDashboardData();
  }
}

async function deleteStudent(id) {
  if (confirm('Delete this student?')) {
    await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
    loadStudents();
    loadDashboardData();
  }
}

async function deleteEnrollment(id) {
  if (confirm('Delete this enrollment?')) {
    await fetch(`${API_URL}/enrollments/${id}`, { method: 'DELETE' });
    loadEnrollments();
    loadDashboardData();
  }
}

// --- TEXT INDEX SEARCH ---
async function doTextSearch() {
  const query = document.getElementById('textSearch').value;
  const resultsDiv = document.getElementById('searchResults');
  const emptyDiv = document.getElementById('searchEmpty');
  
  if (!query) {
    resultsDiv.innerHTML = '';
    emptyDiv.style.display = 'none';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/courses/search?q=${encodeURIComponent(query)}`);
    const courses = await res.json();
    
    resultsDiv.innerHTML = '';
    if (courses.length === 0) {
      emptyDiv.style.display = 'flex';
    } else {
      emptyDiv.style.display = 'none';
      courses.forEach(course => {
        resultsDiv.innerHTML += `
          <div class="card">
            <div class="card-header">
              <h3>${course.title}</h3>
              <span class="badge">${course.category}</span>
            </div>
            <p>${course.description}</p>
          </div>
        `;
      });
    }
  } catch (error) {
    console.error('Search error:', error);
  }
}

function setSearch(term) {
  document.getElementById('textSearch').value = term;
  doTextSearch();
}