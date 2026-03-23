let selectedUniversity = "";
let loggedInTeacher = null;

// Teacher demo accounts
const teacherAccounts = [
  {
    id: "T001",
    password: "1234",
    name: "Teacher One",
    university: "Agriculture and Forestry University"
  },
  {
    id: "T002",
    password: "1234",
    name: "Teacher Two",
    university: "Tribhuvan University"
  },
  {
    id: "T003",
    password: "1234",
    name: "Teacher Three",
    university: "Kathmandu University"
  }
];

// Student master data
// If student signup exists, store students in this same key: hk_students_master
let students = JSON.parse(localStorage.getItem("hk_students_master")) || [
  {
    id: 1,
    name: "Ram Thapa",
    roll: "A01",
    university: "Agriculture and Forestry University",
    program: "BSc Agriculture",
    studentClass: "1",
    section: "A",
    subject: "Crop Science",
    attendance: "Present"
  },
  {
    id: 2,
    name: "Sita Rai",
    roll: "A02",
    university: "Agriculture and Forestry University",
    program: "BSc Agriculture",
    studentClass: "1",
    section: "A",
    subject: "Crop Science",
    attendance: "Absent"
  },
  {
    id: 3,
    name: "Hari Sharma",
    roll: "B01",
    university: "Agriculture and Forestry University",
    program: "BSc Agriculture",
    studentClass: "2",
    section: "B",
    subject: "Soil Science",
    attendance: "Present"
  },
  {
    id: 4,
    name: "Gita Karki",
    roll: "TU01",
    university: "Tribhuvan University",
    program: "Science",
    studentClass: "3",
    section: "A",
    subject: "Agronomy",
    attendance: "Leave"
  }
];

let notices = JSON.parse(localStorage.getItem("hk_teacher_notices")) || [];

function saveStudents() {
  localStorage.setItem("hk_students_master", JSON.stringify(students));
}

function saveNotices() {
  localStorage.setItem("hk_teacher_notices", JSON.stringify(notices));
}

function goToTeacherLogin() {
  const university = document.getElementById("universitySelect").value;

  if (!university) {
    alert("Please select a university.");
    return;
  }

  selectedUniversity = university;
  localStorage.setItem("hk_selected_teacher_university", university);

  document.getElementById("universityPage").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
  document.getElementById("selectedUniversityInput").value = university;
}

function backToUniversity() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("universityPage").classList.remove("hidden");
}

function teacherLogin() {
  const teacherId = document.getElementById("teacherId").value.trim();
  const password = document.getElementById("teacherPassword").value.trim();
  const university = document.getElementById("selectedUniversityInput").value.trim();

  if (!teacherId || !password) {
    alert("Please enter Teacher ID and Password.");
    return;
  }

  const teacher = teacherAccounts.find(
    t => t.id === teacherId && t.password === password && t.university === university
  );

  if (!teacher) {
    alert("Invalid login details for selected university.");
    return;
  }

  loggedInTeacher = teacher;
  localStorage.setItem("hk_teacher_login", JSON.stringify(teacher));

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("dashboardPage").classList.remove("hidden");

  loadTeacherDashboard();
}

function loadTeacherDashboard() {
  const teacher = JSON.parse(localStorage.getItem("hk_teacher_login"));
  if (!teacher) return;

  loggedInTeacher = teacher;
  selectedUniversity = teacher.university;

  document.getElementById("teacherWelcomeText").innerText = `Welcome, ${teacher.name}`;
  document.getElementById("teacherUniversityText").innerText = teacher.university;

  renderStudents();
  renderNotices();
  updateSummary();
}

function handleMenu() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuBtn = document.getElementById("menuBtn");

  sidebar.classList.toggle("active");
  overlay.classList.toggle("show");
  menuBtn.classList.toggle("is-active");
}

function closeMenu() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuBtn = document.getElementById("menuBtn");

  sidebar.classList.remove("active");
  overlay.classList.remove("show");
  menuBtn.classList.remove("is-active");
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
  closeMenu();
}

function syncSearchTop() {
  document.getElementById("searchInput").value = document.getElementById("searchInputTop").value;
  renderStudents();
}

function syncTopClassFilter() {
  document.getElementById("filterClass").value = document.getElementById("topClassFilter").value;
  renderStudents();
}

function syncTopSectionFilter() {
  document.getElementById("filterSection").value = document.getElementById("topSectionFilter").value;
  renderStudents();
}

function syncTopSubjectFilter() {
  document.getElementById("filterSubject").value = document.getElementById("subjectFilterTop").value;
  renderStudents();
}

function resetFilters() {
  document.getElementById("filterProgram").value = "all";
  document.getElementById("filterClass").value = "all";
  document.getElementById("filterSection").value = "all";
  document.getElementById("filterSubject").value = "all";
  document.getElementById("attendanceFilter").value = "all";
  document.getElementById("searchInput").value = "";
  document.getElementById("searchInputTop").value = "";
  document.getElementById("topClassFilter").value = "all";
  document.getElementById("topSectionFilter").value = "all";
  document.getElementById("subjectFilterTop").value = "all";

  renderStudents();
}

function getFilteredStudents() {
  const program = document.getElementById("filterProgram").value;
  const studentClass = document.getElementById("filterClass").value;
  const section = document.getElementById("filterSection").value;
  const subject = document.getElementById("filterSubject").value;
  const attendance = document.getElementById("attendanceFilter").value;
  const search = document.getElementById("searchInput").value.toLowerCase().trim();

  return students.filter(student => {
    const sameUniversity = student.university === selectedUniversity;
    const sameProgram = program === "all" || student.program === program;
    const sameClass = studentClass === "all" || student.studentClass === studentClass;
    const sameSection = section === "all" || student.section === section;
    const sameSubject = subject === "all" || student.subject === subject;
    const sameAttendance = attendance === "all" || student.attendance === attendance;
    const sameSearch =
      student.name.toLowerCase().includes(search) ||
      student.roll.toLowerCase().includes(search);

    return sameUniversity && sameProgram && sameClass && sameSection && sameSubject && sameAttendance && sameSearch;
  });
}

function renderStudents() {
  const tableBody = document.getElementById("studentTableBody");
  const filteredStudents = getFilteredStudents();

  tableBody.innerHTML = "";

  if (filteredStudents.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:25px;">No students found for selected filters.</td>
      </tr>
    `;
    updateSummary([]);
    return;
  }

  filteredStudents.forEach(student => {
    const statusClass =
      student.attendance === "Present" ? "present" :
      student.attendance === "Absent" ? "absent" : "leave";

    tableBody.innerHTML += `
      <tr>
        <td>${student.name}</td>
        <td>${student.roll}</td>
        <td>${student.university}</td>
        <td>${student.program}</td>
        <td>${student.studentClass}</td>
        <td>${student.section}</td>
        <td>${student.subject}</td>
        <td><span class="badge ${statusClass}">${student.attendance}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-blue" onclick="setAttendance(${student.id}, 'Present')">Present</button>
            <button class="btn btn-danger" onclick="setAttendance(${student.id}, 'Absent')">Absent</button>
            <button class="btn btn-warning" onclick="setAttendance(${student.id}, 'Leave')">Leave</button>
          </div>
        </td>
      </tr>
    `;
  });

  updateSummary(filteredStudents);
}

function setAttendance(studentId, status) {
  students = students.map(student => {
    if (student.id === studentId) {
      student.attendance = status;
    }
    return student;
  });

  saveStudents();
  renderStudents();
}

function markAllPresent() {
  const filteredStudents = getFilteredStudents();
  const ids = filteredStudents.map(student => student.id);

  students = students.map(student => {
    if (ids.includes(student.id)) {
      student.attendance = "Present";
    }
    return student;
  });

  saveStudents();
  renderStudents();
  closeMenu();
}

function markAllAbsent() {
  const filteredStudents = getFilteredStudents();
  const ids = filteredStudents.map(student => student.id);

  students = students.map(student => {
    if (ids.includes(student.id)) {
      student.attendance = "Absent";
    }
    return student;
  });

  saveStudents();
  renderStudents();
  closeMenu();
}

function updateSummary(filteredStudents = null) {
  const currentStudents = filteredStudents || getFilteredStudents();

  const totalStudents = currentStudents.length;
  const totalPresent = currentStudents.filter(s => s.attendance === "Present").length;
  const totalAbsent = currentStudents.filter(s => s.attendance === "Absent").length;
  const totalLeave = currentStudents.filter(s => s.attendance === "Leave").length;

  const currentNotices = notices.filter(n => n.university === selectedUniversity);

  document.getElementById("totalStudents").innerText = totalStudents;
  document.getElementById("totalPresent").innerText = totalPresent;
  document.getElementById("totalAbsent").innerText = totalAbsent;
  document.getElementById("totalLeave").innerText = totalLeave;
  document.getElementById("totalNotices").innerText = currentNotices.length;
}

function sendNotice() {
  const type = document.getElementById("noticeType").value;
  const title = document.getElementById("noticeTitle").value.trim();
  const message = document.getElementById("noticeMessage").value.trim();

  const program = document.getElementById("filterProgram").value;
  const studentClass = document.getElementById("filterClass").value;
  const section = document.getElementById("filterSection").value;
  const subject = document.getElementById("filterSubject").value;

  if (!title || !message) {
    alert("Please enter title and message.");
    return;
  }

  const newNotice = {
    id: Date.now(),
    type,
    title,
    message,
    university: selectedUniversity,
    targetProgram: program,
    targetClass: studentClass,
    targetSection: section,
    targetSubject: subject,
    teacherName: loggedInTeacher ? loggedInTeacher.name : "Teacher",
    date: new Date().toLocaleDateString()
  };

  notices.unshift(newNotice);
  saveNotices();

  document.getElementById("noticeTitle").value = "";
  document.getElementById("noticeMessage").value = "";

  renderNotices();
  updateSummary();
}

function renderNotices() {
  const noticeList = document.getElementById("noticeList");
  if (!noticeList) return;

  const currentNotices = notices.filter(n => n.university === selectedUniversity);

  if (currentNotices.length === 0) {
    noticeList.innerHTML = `<div class="small-text">No notices sent yet.</div>`;
    return;
  }

  noticeList.innerHTML = currentNotices.map(notice => `
    <div class="notice-item">
      <h4>${notice.type}: ${notice.title}</h4>
      <div class="small-text">
        ${notice.date} | ${notice.teacherName}
      </div>
      <p>${notice.message}</p>
      <div class="small-text">
        Target:
        ${notice.targetProgram === "all" ? "All Programs" : notice.targetProgram},
        ${notice.targetClass === "all" ? "All Classes" : "Class " + notice.targetClass},
        ${notice.targetSection === "all" ? "All Sections" : "Section " + notice.targetSection},
        ${notice.targetSubject === "all" ? "All Subjects" : notice.targetSubject}
      </div>
    </div>
  `).join("");
}

function logoutTeacher() {
  localStorage.removeItem("hk_teacher_login");
  location.reload();
}

// Auto open dashboard if already logged in
window.onload = function () {
  const savedTeacher = JSON.parse(localStorage.getItem("hk_teacher_login"));
  const savedUniversity = localStorage.getItem("hk_selected_teacher_university");

  if (savedUniversity) {
    selectedUniversity = savedUniversity;
  }

  if (savedTeacher) {
    loggedInTeacher = savedTeacher;
    selectedUniversity = savedTeacher.university;
    document.getElementById("universityPage").classList.add("hidden");
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboardPage").classList.remove("hidden");
    loadTeacherDashboard();
  }
};