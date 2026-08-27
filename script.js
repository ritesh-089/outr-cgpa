const grades={O:10,A:9,B:8,C:7,D:6,P:5,F:2,M:null,S:null,T:null,SA:0};
const creditOptions=[0,1,1.5,2,3,4,6];

function creditSelect(){
  return `<select class="credit"><option value="">Credit</option>${creditOptions.map(x=>`<option value="${x}">${x}</option>`).join("")}<option value="custom">Custom</option></select>`;
}
function gradeSelect(){
  return `<select class="grade"><option value="">Grade</option>${Object.keys(grades).map(g=>`<option value="${g}">${g}</option>`).join("")}</select>`;
}
function addSubject(){
  const row=document.createElement("div"); row.className="row";
  row.innerHTML=`<input class="subject" placeholder="Subject name">${creditSelect()}${gradeSelect()}<button class="remove" type="button">×</button>`;
  row.querySelector(".remove").onclick=()=>{row.remove();updateCounts()};
  row.querySelector(".credit").onchange=e=>{
    if(e.target.value==="custom"){e.target.outerHTML='<input class="credit" type="number" min="0" step="0.5" placeholder="Credit">'}
  };
  document.getElementById("subjects").appendChild(row); updateCounts();
}
function updateCounts(){document.getElementById("subjectCount").textContent=document.querySelectorAll("#subjects .row").length}
function addSemester(){
  const row=document.createElement("div"); row.className="semester-row";
  row.innerHTML=`<input placeholder="Semester"><input class="sgpa" type="number" min="0" max="10" step="0.01" placeholder="SGPA"><input class="sem-credit" type="number" min="0" step="0.5" placeholder="Credit"><button class="remove" type="button">×</button>`;
  row.querySelector(".remove").onclick=()=>{row.remove();updateSemCounts()};
  document.getElementById("semesters").appendChild(row);updateSemCounts();
}
function updateSemCounts(){document.getElementById("semesterCount").textContent=document.querySelectorAll("#semesters .semester-row").length}
document.querySelectorAll(".tab").forEach(tab=>tab.onclick=()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));tab.classList.add("active");
  document.getElementById("sgpa").classList.toggle("hidden",tab.dataset.tab!=="sgpa");
  document.getElementById("cgpa").classList.toggle("hidden",tab.dataset.tab!=="cgpa");
});
document.getElementById("addSubject").onclick=addSubject;
document.getElementById("addSemester").onclick=addSemester;
document.getElementById("calculateSGPA").onclick=()=>{
  let total=0,credits=0;
  document.querySelectorAll("#subjects .row").forEach(r=>{
    const c=parseFloat(r.querySelector(".credit")?.value),g=r.querySelector(".grade")?.value;
    if(Number.isFinite(c)&&c>0&&grades[g]!==null&&grades[g]!==undefined){total+=c*grades[g];credits+=c}
  });
  const box=document.getElementById("sgpaResult");box.classList.remove("hidden");
  box.textContent=credits?`SGPA: ${(total/credits).toFixed(2)}`:"Please enter valid credits and grades.";
};
document.getElementById("calculateCGPA").onclick=()=>{
  let total=0,credits=0;
  document.querySelectorAll(".semester-row").forEach(r=>{
    const s=parseFloat(r.querySelector(".sgpa").value),c=parseFloat(r.querySelector(".sem-credit").value);
    if(Number.isFinite(s)&&Number.isFinite(c)&&c>0){total+=s*c;credits+=c}
  });
  const box=document.getElementById("cgpaResult");box.classList.remove("hidden");
  box.textContent=credits?`CGPA: ${(total/credits).toFixed(2)}`:"Please enter valid SGPA and credits.";
};
document.getElementById("printResult").onclick=()=>window.print();
for(let i=0;i<6;i++)addSubject();
for(let i=0;i<2;i++)addSemester();