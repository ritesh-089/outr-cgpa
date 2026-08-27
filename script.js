(function(){
"use strict";

const points={O:10,A:9,B:8,C:7,D:6,P:5,F:2};
const special={M:"Malpractice",S:"Absent",T:"Shortage of attendance"};
const subjects=document.getElementById("subjects");
const semesters=document.getElementById("semesters");

function options(){
  return '<option value="">Grade</option>'+
    ["O","A","B","C","D","P","F","M","S","T"].map(g=>`<option value="${g}">${g}</option>`).join("");
}
function updateCounts(){
  document.getElementById("subjectCount").textContent=subjects.children.length;
  document.getElementById("semesterCount").textContent=semesters.children.length;
}
function addSubject(){
  const row=document.createElement("div");
  row.className="subject-row";
  row.innerHTML=`
    <input class="subject-name" placeholder="Subject name" aria-label="Subject name">
    <input class="credit" type="number" min="0" step="0.5" placeholder="Credit" aria-label="Credit">
    <select class="grade" aria-label="Grade">${options()}</select>
    <button type="button" class="remove" aria-label="Remove subject">×</button>`;
  row.querySelector(".remove").onclick=()=>{row.remove();updateCounts()};
  subjects.appendChild(row);updateCounts();
}
function addSemester(){
  const row=document.createElement("div");
  row.className="subject-row";
  row.innerHTML=`
    <input class="semester-name" placeholder="Semester" aria-label="Semester">
    <input class="sgpa" type="number" min="0" max="10" step="0.01" placeholder="SGPA" aria-label="SGPA">
    <input class="sem-credit" type="number" min="0" step="0.5" placeholder="Credit" aria-label="Credits">
    <button type="button" class="remove" aria-label="Remove semester">×</button>`;
  row.querySelector(".remove").onclick=()=>{row.remove();updateCounts()};
  semesters.appendChild(row);updateCounts();
}
function showResult(id,number,meta,warning){
  const box=document.getElementById(id);
  box.innerHTML=`
    <div class="result-label">${id==="sgpaResult"?"Your SGPA":"Your CGPA"}</div>
    <div class="result-number">${number.toFixed(2)}</div>
    <div class="result-meta">${meta}</div>
    ${warning?`<div class="warning">${warning}</div>`:""}
    <button type="button" class="print-button" onclick="window.print()">🖨 Print Result</button>`;
  box.classList.add("show");
}
function calcSGPA(){
  let weighted=0,total=0,specials=[];
  [...subjects.children].forEach((row,i)=>{
    const c=Number(row.querySelector(".credit").value);
    const g=row.querySelector(".grade").value;
    if(c>0&&g){
      if(points[g]!==undefined){weighted+=c*points[g];total+=c}
      else specials.push(`Subject ${i+1}: ${g} (${special[g]})`);
    }
  });
  if(!total){
    const box=document.getElementById("sgpaResult");
    box.innerHTML='<b>Please enter credit and grade for at least one subject.</b><div class="warning">M, S and T are status grades and are not included in SGPA.</div>';
    box.classList.add("show");return;
  }
  showResult("sgpaResult",weighted/total,`Total credits counted: ${total}`,specials.length?`Not included: ${specials.join(", ")}`:"");
}
function calcCGPA(){
  let weighted=0,total=0;
  [...semesters.children].forEach(row=>{
    const s=Number(row.querySelector(".sgpa").value);
    const c=Number(row.querySelector(".sem-credit").value);
    if(s>=0&&s<=10&&c>0){weighted+=s*c;total+=c}
  });
  if(!total){
    const box=document.getElementById("cgpaResult");
    box.innerHTML='<b>Please enter semester SGPA and credits.</b>';
    box.classList.add("show");return;
  }
  showResult("cgpaResult",weighted/total,`Total credits counted: ${total}`,"");
}

document.getElementById("addSubject").onclick=addSubject;
document.getElementById("addSemester").onclick=addSemester;
document.getElementById("calcSgpa").onclick=calcSGPA;
document.getElementById("calcCgpa").onclick=calcCGPA;

document.querySelectorAll(".tab").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(x=>x.classList.remove("active-panel"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab+"Panel").classList.add("active-panel");
  };
});

for(let i=0;i<4;i++)addSubject();
for(let i=0;i<2;i++)addSemester();
updateCounts();
})();