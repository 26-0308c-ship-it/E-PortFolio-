const DEFAULT_DATA = {
 profile:{
  name:"James De Guzman", course:"ASAT 2 • Student",
  intro:"I am a student who is continuously learning, improving my skills, and gaining experiences through academic activities and teamwork. This e-portfolio shows my journey, growth, and achievements.",
  interests:"Technology, school activities, teamwork, learning new skills",
  goals:"To continue improving academically, develop useful skills, and become a responsible and capable professional.",
  quote:"Small progress is still progress.",
  image:""
 },
 activities:[
  {id:"act1",title:"ASAT Week Team Activity",date:"2026-09-20",category:"Teamwork",description:"An activity where I worked with classmates and contributed to a team goal during ASAT Week.",reflection:"This experience taught me that communication, cooperation, and responsibility are important when working with others.",images:[]},
  {id:"act2",title:"Academic Presentation",date:"2026-09-15",category:"Academic",description:"A class presentation where I prepared information, organized ideas, and presented them to my classmates.",reflection:"I learned to prepare better, speak clearly, and become more confident when sharing ideas.",images:[]}
 ],
 fiveCs:{
  character:{title:"Character",icon:"🧭",description:"I value respect, responsibility, honesty, and a positive attitude. I try to learn from my mistakes and become better through every experience.",reflection:"My character continues to grow through the way I treat other people and handle responsibilities.",images:[]},
  competence:{title:"Competence",icon:"🎓",description:"I continue developing my academic knowledge, technical skills, communication skills, and ability to solve problems.",reflection:"Every activity and lesson gives me an opportunity to improve what I know and what I can do.",images:[]},
  commitment:{title:"Commitment to Achieve",icon:"🎯",description:"I stay committed to my goals by putting effort into my schoolwork, practicing my skills, and continuing even when tasks become difficult.",reflection:"I believe consistent effort and patience help turn goals into achievements.",images:[]},
  collaboration:{title:"Collaboration",icon:"🤝",description:"I enjoy working with classmates and teammates because different ideas can help a group create better results.",reflection:"Good collaboration requires listening, communication, respect, and doing my part.",images:[]},
  creativity:{title:"Creativity",icon:"💡",description:"I use creativity when developing ideas, making presentations, solving problems, and finding better ways to complete tasks.",reflection:"Creativity helps me look at challenges from different perspectives.",images:[]}
 },
 achievements:[
  {id:"ach1",title:"1st Sem Dean's Lister",date:"2026",organization:"Academic Recognition",description:"Recognized for academic performance during the first semester.",image:""},
  {id:"ach2",title:"ASAT Week MLBB Champion",date:"2026",organization:"ASAT Week",description:"A team achievement earned through teamwork, communication, and dedication.",image:""}
 ]
};

function getData(){
 let saved=localStorage.getItem("ic3Portfolio");
 if(!saved){ localStorage.setItem("ic3Portfolio",JSON.stringify(DEFAULT_DATA)); return structuredClone(DEFAULT_DATA); }
 try{return JSON.parse(saved)}catch(e){localStorage.setItem("ic3Portfolio",JSON.stringify(DEFAULT_DATA));return structuredClone(DEFAULT_DATA)}
}
function saveData(data){localStorage.setItem("ic3Portfolio",JSON.stringify(data));}
function escapeHTML(str=""){return String(str).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function placeholder(title="IC3"){return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#e9e7ff"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="42" fill="#6d5dfc">${title}</text></svg>`);}
function formatDate(d){if(!d)return "";let x=new Date(d+"T00:00:00");return isNaN(x) ? d : x.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});}

function render(){
 const d=getData(), p=d.profile;
 document.getElementById("profileName").textContent=p.name;
 document.getElementById("profileCourse").textContent=p.course;
 document.getElementById("profileIntro").textContent=p.intro;
 document.getElementById("profileInterests").textContent=p.interests;
 document.getElementById("profileGoals").textContent=p.goals;
 document.getElementById("profileQuote").textContent=p.quote ? `"${p.quote}"` : "";
 const img=document.getElementById("profileImage"); img.src=p.image||placeholder("Profile"); 
 const initials=p.name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();
 document.getElementById("heroAvatar").textContent=initials||"IC3";

 const ag=document.getElementById("activitiesGrid"); ag.innerHTML="";
 document.getElementById("activitiesEmpty").classList.toggle("hidden",!d.activities.length);
 d.activities.forEach(a=>{
  const image=(a.images&&a.images[0])||placeholder("Activity");
  ag.insertAdjacentHTML("beforeend",`<article class="card activity-card"><img class="card-image" src="${image}" alt="${escapeHTML(a.title)}"><div class="card-body"><span class="tag">${escapeHTML(a.category||"Activity")}</span><div class="date">${formatDate(a.date)}</div><h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.description)}</p><button class="text-btn" onclick="openDetails('activity','${a.id}')">View Details →</button></div></article>`);
 });
 const cg=document.getElementById("fiveCsGrid"); cg.innerHTML="";
 Object.values(d.fiveCs).forEach(c=>{
  const img=c.images&&c.images[0]?`<img src="${c.images[0]}" alt="${escapeHTML(c.title)}">`:"";
  cg.insertAdjacentHTML("beforeend",`<article class="fivec-card"><div class="fivec-icon">${c.icon||"⭐"}</div><h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.description)}</p>${img}</article>`);
 });
 const ach=document.getElementById("achievementsGrid"); ach.innerHTML="";
 document.getElementById("achievementsEmpty").classList.toggle("hidden",!d.achievements.length);
 d.achievements.forEach(a=>{
  ach.insertAdjacentHTML("beforeend",`<article class="card achievement-card">${a.image?`<img class="card-image" src="${a.image}" alt="${escapeHTML(a.title)}">`:`<div class="card-image"></div>`}<div class="card-body"><span class="tag">🏆 Recognition</span><div class="date">${escapeHTML(a.date)}${a.organization?" • "+escapeHTML(a.organization):""}</div><h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.description)}</p><button class="text-btn" onclick="openDetails('achievement','${a.id}')">View Details →</button></div></article>`);
 });
}
function openDetails(type,id){
 const d=getData(); let item=type==="activity"?d.activities.find(x=>x.id===id):d.achievements.find(x=>x.id===id); if(!item)return;
 let html=`<span class="eyebrow">${type==="activity"?(item.category||"ACTIVITY"):"ACHIEVEMENT"}</span><h2>${escapeHTML(item.title)}</h2><p class="date">${formatDate(item.date)||escapeHTML(item.date||"")}</p>`;
 if(item.organization)html+=`<p><b>Organization:</b> ${escapeHTML(item.organization)}</p>`;
 if(item.description)html+=`<p>${escapeHTML(item.description)}</p>`;
 if(item.reflection)html+=`<h3>Reflection</h3><p>${escapeHTML(item.reflection)}</p>`;
 (item.images||[]).forEach(im=>html+=`<img src="${im}" alt="">`);
 if(item.image)html+=`<img src="${item.image}" alt="${escapeHTML(item.title)}">`;
 document.getElementById("modalContent").innerHTML=html;
 document.getElementById("modal").classList.add("open");
}
document.addEventListener("DOMContentLoaded",()=>{
 render(); document.getElementById("year").textContent=new Date().getFullYear();
 const toggle=document.getElementById("themeToggle");
 if(localStorage.getItem("ic3Theme")==="dark"){document.body.classList.add("dark");toggle.textContent="☀️";}
 toggle.onclick=()=>{document.body.classList.toggle("dark");let dark=document.body.classList.contains("dark");localStorage.setItem("ic3Theme",dark?"dark":"light");toggle.textContent=dark?"☀️":"🌙";};
 document.getElementById("menuToggle").onclick=()=>document.getElementById("navLinks").classList.toggle("open");
 document.querySelectorAll(".nav-links a").forEach(a=>a.onclick=()=>document.getElementById("navLinks").classList.remove("open"));
 document.getElementById("modalClose").onclick=()=>document.getElementById("modal").classList.remove("open");
 document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")e.currentTarget.classList.remove("open")};
});
