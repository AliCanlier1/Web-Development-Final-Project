//Firsly I took all buttons to write button event handlers.
const addCourseButton = document.getElementById("add-course-button");
const addStudentButton = document.getElementById("add-student-button");
const showStudentsButton = document.getElementById("show-students-button");
const findStudentsButton = document.getElementById("find-student-button");
const findByLectureButton = document.getElementById("find-by-course-button");
const showPassedStudentsButton = document.getElementById("show-passed-students-button");
const showFailedStudentsButton = document.getElementById("show-failed-students-button");
const showLectureDetailsButton = document.getElementById("show-lecture-details-button");

//These are the button event handlers that I have specified above.
addCourseButton.addEventListener("click", addNewCourse);
addStudentButton.addEventListener("click", addNewStudent);
showStudentsButton.addEventListener("click", showStudents);
findStudentsButton.addEventListener("click", findStudent);
findByLectureButton.addEventListener("click", findByLecture);
showPassedStudentsButton.addEventListener("click", showPassedStudents);
showFailedStudentsButton.addEventListener("click", showFailedStudents);
showLectureDetailsButton.addEventListener("click", showLectureDetails);

//I setted two id values of each course and student which has been added by user.
//Each course and student adding function will use this variables and then icrements itself.
let courseID = 1;
let studentID = 1;

//I created a student class for each student. Input fields are clearing itself after creating student.
//Letter grade will be calculated according to course has been entered to the student in the addNewStudent function.
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


//This function adding and student and calculating course grade according to selected course.
//The last line of the function is showing the students.
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

//This function adding a new course according to input fields.
//When the page loaded first time the input fields of courses has 0 course.
//After inserting a course with this function the input fileds of courses are reloading and updating itselfs.
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

//This function is showing the students according to the specific course which is selected by the user.
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

//This function is running with findByLecture(above) function. 
//After loading students according to specific course this function is looking each students letterGrades and 
//showing students whose letter grades higher than "F".
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

//This function is running with findByLecture function. 
//After loading students according to specific course this function is looking each students letterGrades and 
//showing students whose letter grades equals the "F".
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

//This function is writing the number of students are passed or failed to the specific course.
//This function is also running with findByLecture function.
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


//Load courses function is creating an options for all required course input fields.
//First taking the course name and course scale from the user and then adds the values to the localStorage.
//Other functions are using this function.
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

//This function is almost same the loadCourses()(above) function.
//The only difference is this function is taking "filtered-courses" select fields as a root.
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

//This function is used for showing students.
//Iterating all the localStorage items and taking the items which is student object.
//After that creating a div element and appending the element to the "student-items" div.
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

//This function will find out the student according the values that has been entered by the user.
//After that append this student's information to the find-student root.
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

//This function is taking two parameter and calculating the letterGrade according to the 10 based system.
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

//This function is taking two parameter and calculating the letterGrade according to the 7 based system.
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
