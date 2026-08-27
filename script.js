// OUTR CGPA Calculator V3
// No external libraries. Works offline.

(function () {
  "use strict";

  const GRADE_POINTS = {
    O: 10, A: 9, B: 8, C: 7, D: 6, P: 5, F: 2
  };

  const SPECIAL = {
    M: "Malpractice",
    S: "Absent",
    T: "Shortage of attendance"
  };

  const subjectsBox = document.getElementById("subjects");
  const semestersBox = document.getElementById("semesters");

  function gradeOptions() {
    const grades = ["O","A","B","C","D","P","F","M","S","T"];
    return '<option value="">Grade</option>' +
      grades.map(function(g) {
        return '<option value="' + g + '">' + g + '</option>';
      }).join("");
  }

  function addSubject() {
    const row = document.createElement("div");
    row.className = "subject";

    const name = document.createElement("input");
    name.type = "text";
    name.className = "subjectName";
    name.placeholder = "Subject name";

    const credit = document.createElement("input");
    credit.type = "number";
    credit.className = "subjectCredit";
    credit.placeholder = "Credit";
    credit.min = "0";
    credit.step = "0.5";

    const grade = document.createElement("select");
    grade.className = "subjectGrade";
    grade.innerHTML = gradeOptions();

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.textContent = "×";
    remove.title = "Remove subject";
    remove.addEventListener("click", function() {
      row.remove();
    });

    row.appendChild(name);
    row.appendChild(credit);
    row.appendChild(grade);
    row.appendChild(remove);
    subjectsBox.appendChild(row);
  }

  function addSemester() {
    const row = document.createElement("div");
    row.className = "semester";

    const name = document.createElement("input");
    name.type = "text";
    name.className = "semesterName";
    name.placeholder = "Semester";

    const sgpa = document.createElement("input");
    sgpa.type = "number";
    sgpa.className = "semesterSgpa";
    sgpa.placeholder = "SGPA";
    sgpa.min = "0";
    sgpa.max = "10";
    sgpa.step = "0.01";

    const credit = document.createElement("input");
    credit.type = "number";
    credit.className = "semesterCredit";
    credit.placeholder = "Credits";
    credit.min = "0";
    credit.step = "0.5";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.textContent = "×";
    remove.addEventListener("click", function() {
      row.remove();
    });

    row.appendChild(name);
    row.appendChild(sgpa);
    row.appendChild(credit);
    row.appendChild(remove);
    semestersBox.appendChild(row);
  }

  function showResult(id, html) {
    const box = document.getElementById(id);
    box.innerHTML = html;
    box.classList.add("show");
  }

  function calculateSGPA() {
    let weightedPoints = 0;
    let totalCredits = 0;
    const special = [];

    const rows = subjectsBox.querySelectorAll(".subject");

    rows.forEach(function(row, index) {
      const credit = Number(row.querySelector(".subjectCredit").value);
      const grade = row.querySelector(".subjectGrade").value;

      if (credit > 0 && grade) {
        if (Object.prototype.hasOwnProperty.call(GRADE_POINTS, grade)) {
          weightedPoints += credit * GRADE_POINTS[grade];
          totalCredits += credit;
        } else {
          special.push("Subject " + (index + 1) + ": " + grade);
        }
      }
    });

    if (totalCredits === 0) {
      showResult("sgpaResult", "<b>Please enter a valid credit and grade for at least one subject.</b>");
      return;
    }

    const sgpa = weightedPoints / totalCredits;

    let extra = "";
    if (special.length) {
      extra = '<div class="warning">Special status not included in the calculation: ' +
        special.join(", ") + ".</div>";
    }

    showResult(
      "sgpaResult",
      '<div class="label">Your SGPA</div>' +
      '<div class="number">' + sgpa.toFixed(2) + "</div>" +
      '<div class="label">Total credits counted: ' + totalCredits + "</div>" +
      extra
    );
  }

  function calculateCGPA() {
    let weighted = 0;
    let credits = 0;

    semestersBox.querySelectorAll(".semester").forEach(function(row) {
      const sgpa = Number(row.querySelector(".semesterSgpa").value);
      const credit = Number(row.querySelector(".semesterCredit").value);

      if (sgpa >= 0 && sgpa <= 10 && credit > 0) {
        weighted += sgpa * credit;
        credits += credit;
      }
    });

    if (credits === 0) {
      showResult("cgpaResult", "<b>Please enter semester SGPA and credits.</b>");
      return;
    }

    const cgpa = weighted / credits;

    showResult(
      "cgpaResult",
      '<div class="label">Your CGPA</div>' +
      '<div class="number">' + cgpa.toFixed(2) + "</div>" +
      '<div class="label">Total credits counted: ' + credits + "</div>"
    );
  }

  // Event listeners are attached after the page is loaded.
  document.getElementById("addSubject").addEventListener("click", addSubject);
  document.getElementById("calcSgpa").addEventListener("click", calculateSGPA);
  document.getElementById("addSemester").addEventListener("click", addSemester);
  document.getElementById("calcCgpa").addEventListener("click", calculateCGPA);

  // Start with 5 subject rows and 2 semester rows.
  for (let i = 0; i < 5; i++) addSubject();
  for (let i = 0; i < 2; i++) addSemester();
})();