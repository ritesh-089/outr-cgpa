const gradePoints = {
  O:10, A:9, B:8, C:7, D:6, P:5, F:2,
  M:null, S:null, T:null, SA:0
};

const subjects = document.getElementById("subjects");
const semesters = document.getElementById("semesters");
const subjectCount = document.getElementById("subjectCount");
const semesterCount = document.getElementById("semesterCount");

function gradeOptions(){
  return `<option value="">Grade</option>
    <option value="O">O — Outstanding</option>
    <option value="A">A — Excellent</option>
    <option value="B">B — Very Good</option>
    <option value="C">C — Good</option>
    <option value="D">D — Fair</option>
    <option value="P">P — Pass</option>
    <option value="F">F — Failed</option>
    <option value="M">M — Malpractice</option>
    <option value="S">S — Absent</option>
    <option value="T">T — Attendance shortage</option>
    <option value="SA">SA — Satisfactory</option>`;
}

function creditOptions(){
  return `<option value="">Credit</option>
    <option>0</option><option>1</option><option>1.5</option>
    <option>2</option><option>3</option><option>4</option><option>6</option>
    <option value="custom">Custom</option>`;
}

function addSubject(){
  const row = document.createElement("div");
  row.className = "row subject-row";
  row.innerHTML = `
    <input class="subject-name" placeholder="Subject name" aria-label="Subject name">
    <div class="credit-wrap"><select class="credit">${creditOptions()}</select></div>
    <select class="grade">${gradeOptions()}</select>
    <button class="delete" type="button" aria-label="Remove subject">×</button>`;
  subjects.appendChild(row);
  bindRow(row);
  updateCounts();
}

function bindRow(row){
  const credit = row.querySelector(".credit");
  credit.addEventListener("change", ()=>{
    if(credit.value === "custom"){
      const wrap = row.querySelector(".credit-wrap");
      wrap.innerHTML = `<input class="credit custom-credit" type="number" min="0" step="0.5" placeholder="Credit">`;
      wrap.querySelector("input").focus();
    }
  });
  row.querySelector(".delete").addEventListener("click", ()=>{
    row.remove(); updateCounts();
  });
}

function updateCounts(){
  subjectCount.textContent = subjects.querySelectorAll(".subject-row").length;
  semesterCount.textContent = semesters.querySelectorAll(".semester-row").length;
}

function addSemester(){
  const row = document.createElement("div");
  row.className = "row semester-row";
  row.innerHTML = `
    <input placeholder="Semester" aria-label="Semester">
    <input class="sem-sgpa" type="number" min="0" max="10" step="0.01" placeholder="SGPA">
    <input class="sem-credit" type="number" min="0" step="0.5" placeholder="Credit">
    <button class="delete" type="button" aria-label="Remove semester">×</button>`;
  semesters.appendChild(row);
  row.querySelector(".delete").addEventListener("click", ()=>{row.remove();updateCounts()});
  updateCounts();
}

function showResult(el, title, value, extra=""){
  el.innerHTML = `<div>${title}</div><b>${value}</b>${extra ? `<div>${extra}</div>`:""}`;
  el.classList.remove("hidden");
}

document.getElementById("addSubject").addEventListener("click", addSubject);
document.getElementById("addSemester").addEventListener("click", addSemester);

document.getElementById("calcSGPA").addEventListener("click", ()=>{
  const rows = [...subjects.querySelectorAll(".subject-row")];
  if(!rows.length){ alert("Add at least one subject."); return; }

  let weighted = 0, credits = 0, invalid = false, nonCounted = 0;
  rows.forEach(r=>{
    const cEl = r.querySelector(".credit");
    const custom = r.querySelector(".custom-credit");
    const c = parseFloat(custom ? custom.value : cEl.value);
    const g = r.querySelector(".grade").value;
    if(!Number.isFinite(c) || c < 0 || !g){ invalid=true; return; }
    const p = gradePoints[g];
    if(p === null){ nonCounted++; return; }
    weighted += c*p; credits += c;
  });
  if(invalid){alert("Please enter credit and grade for every subject.");return;}
  if(credits === 0){alert("No credit-bearing grade is available for SGPA calculation.");return;}
  const sgpa = weighted/credits;
  showResult(document.getElementById("sgpaResult"),"Your SGPA",sgpa.toFixed(2),
    nonCounted ? `${nonCounted} subject(s) with M/S/T are not included.` : "");
});

document.getElementById("calcCGPA").addEventListener("click", ()=>{
  const rows = [...semesters.querySelectorAll(".semester-row")];
  if(!rows.length){alert("Add at least one semester.");return;}
  let weighted=0, credits=0;
  for(const r of rows){
    const s=parseFloat(r.querySelector(".sem-sgpa").value);
    const c=parseFloat(r.querySelector(".sem-credit").value);
    if(!Number.isFinite(s)||!Number.isFinite(c)||c<=0){alert("Please enter valid SGPA and credits for every semester.");return;}
    weighted += s*c; credits += c;
  }
  showResult(document.getElementById("cgpaResult"),"Your CGPA",(weighted/credits).toFixed(2));
});

document.querySelectorAll(".tab").forEach(tab=>{
  tab.addEventListener("click",()=>{
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("sgpaPanel").classList.toggle("hidden",tab.dataset.tab!=="sgpa");
    document.getElementById("cgpaPanel").classList.toggle("hidden",tab.dataset.tab!=="cgpa");
  });
});

function printPage(){ window.print(); }
document.getElementById("printBtn").addEventListener("click",printPage);
document.getElementById("printBtn2").addEventListener("click",printPage);

for(let i=0;i<6;i++) addSubject();
for(let i=0;i<2;i++) addSemester();
