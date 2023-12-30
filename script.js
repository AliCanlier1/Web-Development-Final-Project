const addCourseButton = document.getElementById("add-course-button");
const addStudentButton = document.getElementById("add-student-button");
const showStudentsButton = document.getElementById("show-students-button");
const findStudentsButton = document.getElementById("find-student-button");
const findByLectureButton = document.getElementById("find-by-course-button");
const showPassedStudentsButton = document.getElementById("show-passed-students-button");
const showFailedStudentsButton = document.getElementById("show-failed-students-button");
const showLectureDetailsButton = document.getElementById("show-lecture-details-button");

addCourseButton.addEventListener("click", addNewCourse);
addStudentButton.addEventListener("click", addNewStudent);
showStudentsButton.addEventListener("click", showStudents);
findStudentsButton.addEventListener("click", findStudent);
findByLectureButton.addEventListener("click", findByLecture);
showPassedStudentsButton.addEventListener("click", showPassedStudents);
showFailedStudentsButton.addEventListener("click", showFailedStudents);
showLectureDetailsButton.addEventListener("click", showLectureDetails);

let courseID = 1;
let studentID = 1;

class Student {
  constructor() {
    this._courses = [];
    this.id = studentID++;
    this.name = document.getElementById("first-name").value;
    this.lastName = document.getElementById("last-name").value;
    this.course = document.getElementById("course-name").value;
    this.midtermGrade = document.getElementById("midterm-grade").value;
    this.finalGrade = document.getElementById("final-grade").value;
    document.getElementById("first-name").value = "";
    document.getElementById("last-name").value = "";
    document.getElementById("midterm-grade").value = "";
    document.getElementById("final-grade").value = "";
    this.pushCourses();
  }
  pushCourses() {
    let courseObj = { courseName: this.course, letterGrade: {} };
    this._courses.unshift(courseObj);
  }
}

function addNewStudent() {
  let student = new Student();
  let letterScale;
  if (
    student.midtermGrade > 100 ||
    student.midtermGrade < 0 ||
    student.finalGrade > 100 ||
    student.midtermGrade < 0
  ) {
    alert("CHECK YOUR GRADES!");
  } else {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (
        key.startsWith("course") &&
        JSON.parse(localStorage.getItem(key)).courseName === student.course
      ) {
        let grade = JSON.parse(localStorage.getItem(key)).courseScale;
        if (grade === "7") {
          letterScale = calculate7(student.midtermGrade, student.finalGrade);
        } else if (grade === "10") {
          letterScale = calculate10(student.midtermGrade, student.finalGrade);
        }
      }
    }
    let currentCourse = student._courses[0];
    currentCourse.letterGrade = letterScale;
    localStorage.setItem(studentID, JSON.stringify(student));
    showStudents();
  }
}

function addNewCourse() {
  let courseName = document.getElementById("new-course").value;
  let courseScale = document.getElementById("course-scale").value;
  document.getElementById("new-course").value = "";
  let newCourse = {
    courseName: courseName,
    courseScale: courseScale,
  };
  localStorage.setItem(`course${courseID++}`, JSON.stringify(newCourse));
  document.getElementById("course-scale").value = "10";
  loadCourses();
  loadFilteredCourses();
}
function findByLecture() {
  let studentsList = document.getElementById("student-items");
  studentsList.innerHTML = "";
  let courseValue = document.getElementById("filtered-courses").value;
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (!key.startsWith("course")) {
      let student = JSON.parse(localStorage.getItem(key));
      for (let i = 0; i < student._courses.length; i++) {
        if (student._courses[i].courseName === courseValue) {
          const studentInformationDiv = document.createElement("div");
          studentInformationDiv.classList.add("student-item");
          studentInformationDiv.textContent = `Name: ${
            student.name + " " + student.lastName
          }, Course: ${student._courses[i].courseName}, LetterGrade: ${
            student._courses[i].letterGrade
          }, Midterm Grade: ${student.midtermGrade}, Final Grade: ${
            student.finalGrade
          }`;
          studentsList.appendChild(studentInformationDiv);
        }
      }
    }
  }
}
function showPassedStudents() {
  let studentsList = document.getElementById("student-items");
  studentsList.innerHTML = "";
  let courseValue = document.getElementById("filtered-courses").value;
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (!key.startsWith("course")) {
      let student = JSON.parse(localStorage.getItem(key));
      for (let i = 0; i < student._courses.length; i++) {
        if (
          student._courses[i].courseName === courseValue &&
          student._courses[i].letterGrade !== "F"
        ) {
          const studentInformationDiv = document.createElement("div");
          studentInformationDiv.classList.add("student-item");
          studentInformationDiv.textContent = `Name: ${
            student.name + " " + student.lastName
          }, Course: ${student._courses[i].courseName}, LetterGrade: ${
            student._courses[i].letterGrade
          }, Midterm Grade: ${student.midtermGrade}, Final Grade: ${
            student.finalGrade
          }`;
          studentsList.appendChild(studentInformationDiv);
        }
      }
    }
  }
}

function showFailedStudents() {
  let studentsList = document.getElementById("student-items");
  studentsList.innerHTML = "";
  let courseValue = document.getElementById("filtered-courses").value;
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (!key.startsWith("course")) {
      let student = JSON.parse(localStorage.getItem(key));
      for (let i = 0; i < student._courses.length; i++) {
        if (
          student._courses[i].courseName === courseValue &&
          student._courses[i].letterGrade === "F"
        ) {
          const studentInformationDiv = document.createElement("div");
          studentInformationDiv.classList.add("student-item");
          studentInformationDiv.textContent = `Name: ${
            student.name + " " + student.lastName
          }, Course: ${student._courses[i].courseName}, LetterGrade: ${
            student._courses[i].letterGrade
          }, Midterm Grade: ${student.midtermGrade}, Final Grade: ${
            student.finalGrade
          }`;
          studentsList.appendChild(studentInformationDiv);
        }
      }
    }
  }
}
function showLectureDetails() {
  let lectureDetail = document.getElementById("student-items");
  lectureDetail.innerHTML = "";
  let courseValue = document.getElementById("filtered-courses").value;
  let passedStudents = 0;
  let failedStudents = 0;
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (!key.startsWith("course")) {
      let student = JSON.parse(localStorage.getItem(key));
      for (let i = 0; i < student._courses.length; i++) {
        if (
          student._courses[i].courseName === courseValue &&
          student._courses[i].letterGrade === "F"
        ) {
          failedStudents += 1;
        } else if(student._courses[i].courseName === courseValue){
          passedStudents += 1;
        }
      }
    }
  }
  const lectureInformationDiv = document.createElement("div");
  lectureInformationDiv.classList.add("student-item");
  lectureInformationDiv.textContent = `Passed Students: ${passedStudents}, Failed Students: ${failedStudents}, Mean Value:`;
  lectureDetail.appendChild(lectureInformationDiv);
}
function loadCourses() {
  let courses = document.getElementById("course-name");
  courses.innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith("course")) {
      let value = JSON.parse(localStorage.getItem(key));
      let courseOption = document.createElement("option");
      courseOption.value = value.courseName;
      courseOption.innerText = value.courseName;
      courses.appendChild(courseOption);
    }
  }
}
function loadFilteredCourses() {
  let filteredCourses = document.getElementById("filtered-courses");
  filteredCourses.innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith("course")) {
      let value = JSON.parse(localStorage.getItem(key));
      let courseOption = document.createElement("option");
      courseOption.value = value.courseName;
      courseOption.innerText = value.courseName;
      filteredCourses.appendChild(courseOption);
    }
  }
}

function showStudents() {
  let studentsList = document.getElementById("student-items");
  studentsList.innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (!key.startsWith("course")) {
      let student = JSON.parse(localStorage.getItem(key));
      const studentInformationDiv = document.createElement("div");
      studentInformationDiv.classList.add("student-item");
      let studentCourses = student._courses.map(
        (course) => `${course.courseName}: ${course.letterGrade}`
      );
      studentInformationDiv.textContent = `Name: ${
        student.name + " " + student.lastName
      }, Courses: ${studentCourses.join(", ")}, Midterm Grade: ${
        student.midtermGrade
      }, Final Grade: ${student.finalGrade}`;
      studentsList.appendChild(studentInformationDiv);
    }
  }
}

function findStudent() {
  let descendantItem = document.getElementById("find-student");
  descendantItem.innerHTML = "";
  let input = document.getElementById("find-student-input").value;
  document.getElementById("find-student-input").value = "";
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (!key.startsWith("course")) {
      let student = JSON.parse(localStorage.getItem(key));
      if (
        (student.name + " " + student.lastName).toLowerCase() ===
        input.toLowerCase()
      ) {
        const studentInformationDiv = document.createElement("div");
        studentInformationDiv.classList.add("found-student-item");
        let studentCourses = student._courses.map(
          (course) => `${course.courseName}: ${course.letterGrade}`
        );
        studentInformationDiv.textContent = `Name: ${
          student.name + " " + student.lastName
        }, Courses: ${studentCourses.join(", ")}, Midterm Grade: ${
          student.midtermGrade
        }, Final Grade :${student.finalGrade}`;
        descendantItem.appendChild(studentInformationDiv);
      }
    }
  }
}

function calculate10(midterm, final) {
  let value = (parseInt(midterm) * 2) / 5 + (parseInt(final) * 3) / 5;
  let letter;
  if (value > 89) {
    letter = "A";
  } else if (value > 79) {
    letter = "B";
  } else if (value > 69) {
    letter = "C";
  } else if (value > 59) {
    letter = "D";
  } else {
    letter = "F";
  }

  return letter;
}

function calculate7(midterm, final) {
  let value = (parseInt(midterm) * 2) / 5 + (parseInt(final) * 3) / 5;
  let letter;
  if (value > 92) {
    letter = "A";
  } else if (value > 84) {
    letter = "B";
  } else if (value > 76) {
    letter = "C";
  } else if (value > 69) {
    letter = "D";
  } else {
    letter = "F";
  }

  return letter;
}
