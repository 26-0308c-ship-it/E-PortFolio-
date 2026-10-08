const STORE="ic3Portfolio";
function data(){return JSON.parse(localStorage.getItem(STORE));}
function save(d){localStorage.setItem(STORE,JSON.stringify(d));}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function imgPlaceholder(){return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e9e7ff"/></svg>`);}
function readFile(file){return new Promise((resolve,reject)=>{if(!file){resolve("");return}if(!file.type.startsWith("image/")){reject(new Error("Please select an image file."));return}if(file.size>1.5*1024*1024){reject(new Error("Please use images smaller than 1.5 MB."));return}const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});}
function readFiles(files){return Promise.all([...files].map(readFile));}

function showPanel(name){
 document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active-panel"));
 document.getElementById("panel-"+name).classList.add("active-panel");
 document.querySelectorAll(".side-link").forEach(x=>x.classList.toggle("active",x.dataset.panel===name));
 const labels={dashboard:"Dashboard",profile:"Get to Know Me",activities:"Activities",fivecs:"5C's",achievements:"Achievements"};
 document.getElementById("panelTitle").textContent=labels[name]||name;
 if(name==="dashboard")updateStats(); if(name==="activities")renderActivityAdmin(); if(name==="fivecs")renderFiveCAdmin(); if(name==="achievements")renderAchievementAdmin();
}
function updateStats(){const d=data();document.getElementById("statActivities").textContent=d.activities.length;document.getElementById("statAchievements").textContent=d.achievements.length;}
function loadProfile(){
 const p=data().profile; document.getElementById("pName").value=p.name||"";document.getElementById("pCourse").value=p.course||"";document.getElementById("pIntro").value=p.intro||"";document.getElementById("pInterests").value=p.interests||"";document.getElementById("pGoals").value=p.goals||"";document.getElementById("pQuote").value=p.quote||"";
 const preview=document.getElementById("pPreview");preview.src=p.image||"";preview.style.display=p.image?"block":"none";
}
function renderActivityAdmin(){
 const list=document.getElementById("activityAdminList");list.innerHTML="";const d=data();
 if(!d.activities.length){list.innerHTML='<div class="admin-card">No activities yet.</div>';return}
 d.activities.forEach(a=>list.insertAdjacentHTML("beforeend",`<div class="admin-item"><img src="${(a.images&&a.images[0])||imgPlaceholder()}" alt=""><div class="item-main"><h4>${esc(a.title)}</h4><small>${esc(a.date||"")} • ${esc(a.category||"Activity")}</small></div><div class="admin-actions"><button class="small-btn" onclick="editActivity('${a.id}')">Edit</button><button class="small-btn delete" onclick="deleteActivity('${a.id}')">Delete</button></div></div>`));
}
function resetActivity(){document.getElementById("activityForm").reset();document.getElementById("aId").value="";document.getElementById("activitySave").textContent="Add Activity";document.getElementById("aImagePreview").innerHTML="";}
function editActivity(id){
 const a=data().activities.find(x=>x.id===id);if(!a)return;showPanel("activities");
 document.getElementById("aId").value=a.id;document.getElementById("aTitle").value=a.title;document.getElementById("aDate").value=a.date;document.getElementById("aCategory").value=a.category||"";document.getElementById("aDescription").value=a.description||"";document.getElementById("aReflection").value=a.reflection||"";document.getElementById("activitySave").textContent="Update Activity";
 document.getElementById("aImagePreview").innerHTML=(a.images||[]).map(x=>`<img src="${x}" alt="">`).join("");
 window.currentActivityImages=a.images||[];
}
async function deleteActivity(id){if(!confirm("Delete this activity? This cannot be undone."))return;let d=data();d.activities=d.activities.filter(x=>x.id!==id);save(d);renderActivityAdmin();updateStats();}
async function saveActivity(e){
 e.preventDefault();try{
  let d=data(),id=document.getElementById("aId").value||"act_"+Date.now(),existing=d.activities.find(x=>x.id===id);
  const files=document.getElementById("aImages").files;let imgs=files.length?await readFiles(files):(existing?.images||window.currentActivityImages||[]);
  const item={id,title:document.getElementById("aTitle").value.trim(),date:document.getElementById("aDate").value,category:document.getElementById("aCategory").value.trim(),description:document.getElementById("aDescription").value.trim(),reflection:document.getElementById("aReflection").value.trim(),images:imgs};
  if(existing)d.activities=d.activities.map(x=>x.id===id?item:x);else d.activities.unshift(item);save(d);alert("Activity saved successfully.");resetActivity();renderActivityAdmin();updateStats();
 }catch(err){alert(err.message)}
}

function renderFiveCAdmin(){
 const d=data(),box=document.getElementById("fiveCAdminList");box.innerHTML="";
 Object.entries(d.fiveCs).forEach(([key,c])=>box.insertAdjacentHTML("beforeend",`<details class="fivec-admin" open><summary>${c.icon||"⭐"} ${esc(c.title)}</summary><form class="admin-card fivec-form" data-key="${key}"><label>Title<input name="title" value="${esc(c.title)}"></label><label>Description<textarea name="description" rows="4">${esc(c.description)}</textarea></label><label>Reflection<textarea name="reflection" rows="4">${esc(c.reflection)}</textarea></label><label>Images<input name="images" type="file" accept="image/*" multiple></label><div class="image-preview-grid">${(c.images||[]).map(x=>`<img src="${x}" alt="">`).join("")}</div><div class="form-actions"><button class="btn primary" type="submit">Save ${esc(c.title)}</button></div></form></details>`));
 box.querySelectorAll(".fivec-form").forEach(form=>form.addEventListener("submit",async e=>{e.preventDefault();try{let d=data(),key=form.dataset.key,c=d.fiveCs[key],files=form.querySelector('input[name="images"]').files;let imgs=files.length?await readFiles(files):c.images||[];c.title=form.title.value.trim();c.description=form.description.value.trim();c.reflection=form.reflection.value.trim();c.images=imgs;save(d);alert("5C section saved.");renderFiveCAdmin();}catch(err){alert(err.message)}}));
}

function renderAchievementAdmin(){
 const list=document.getElementById("achievementAdminList");list.innerHTML="";const d=data();
 if(!d.achievements.length){list.innerHTML='<div class="admin-card">No achievements yet.</div>';return}
 d.achievements.forEach(a=>list.insertAdjacentHTML("beforeend",`<div class="admin-item"><img src="${a.image||imgPlaceholder()}" alt=""><div class="item-main"><h4>${esc(a.title)}</h4><small>${esc(a.date||"")} • ${esc(a.organization||"")}</small></div><div class="admin-actions"><button class="small-btn" onclick="editAchievement('${a.id}')">Edit</button><button class="small-btn delete" onclick="deleteAchievement('${a.id}')">Delete</button></div></div>`));
}
function resetAchievement(){document.getElementById("achievementForm").reset();document.getElementById("achId").value="";document.getElementById("achievementSave").textContent="Add Achievement";document.getElementById("achPreview").style.display="none";}
function editAchievement(id){const a=data().achievements.find(x=>x.id===id);if(!a)return;showPanel("achievements");document.getElementById("achId").value=a.id;document.getElementById("achTitle").value=a.title;document.getElementById("achDate").value=a.date;document.getElementById("achOrg").value=a.organization||"";document.getElementById("achDescription").value=a.description||"";document.getElementById("achievementSave").textContent="Update Achievement";const p=document.getElementById("achPreview");p.src=a.image||"";p.style.display=a.image?"block":"none";window.currentAchievementImage=a.image||"";}
async function deleteAchievement(id){if(!confirm("Delete this achievement? This cannot be undone."))return;let d=data();d.achievements=d.achievements.filter(x=>x.id!==id);save(d);renderAchievementAdmin();updateStats();}
async function saveAchievement(e){e.preventDefault();try{let d=data(),id=document.getElementById("achId").value||"ach_"+Date.now(),existing=d.achievements.find(x=>x.id===id),file=document.getElementById("achImage").files[0],image=file?await readFile(file):(existing?.image||window.currentAchievementImage||"");let item={id,title:document.getElementById("achTitle").value.trim(),date:document.getElementById("achDate").value.trim(),organization:document.getElementById("achOrg").value.trim(),description:document.getElementById("achDescription").value.trim(),image};if(existing)d.achievements=d.achievements.map(x=>x.id===id?item:x);else d.achievements.unshift(item);save(d);alert("Achievement saved successfully.");resetAchievement();renderAchievementAdmin();updateStats();}catch(err){alert(err.message)}}

document.addEventListener("DOMContentLoaded",()=>{
 if(!localStorage.getItem(STORE)){
  // Initialize by using the same demo data shape as the public page.
  localStorage.setItem(STORE,JSON.stringify({profile:{name:"James De Guzman",course:"ASAT 2 • Student",intro:"I am a student who is continuously learning, improving my skills, and gaining experiences through academic activities and teamwork.",interests:"Technology, school activities, teamwork, learning new skills",goals:"To continue improving academically, develop useful skills, and become a responsible professional.",quote:"Small progress is still progress.",image:""},activities:[],fiveCs:{character:{title:"Character",icon:"🧭",description:"My values, attitude, responsibility, and personal growth.",reflection:"I continue to grow through every experience.",images:[]},competence:{title:"Competence",icon:"🎓",description:"My skills, knowledge, and abilities.",reflection:"Every lesson helps me improve.",images:[]},commitment:{title:"Commitment to Achieve",icon:"🎯",description:"My goals, effort, and determination.",reflection:"Consistent effort helps me reach my goals.",images:[]},collaboration:{title:"Collaboration",icon:"🤝",description:"My teamwork and communication experiences.",reflection:"Working together helps create better results.",images:[]},creativity:{title:"Creativity",icon:"💡",description:"My ideas and problem-solving skills.",reflection:"Creativity helps me see different solutions.",images:[]}},achievements:[]}));
 }
 const logged=sessionStorage.getItem("ic3AdminLogged")==="true";
 document.getElementById("loginScreen").classList.toggle("hidden",logged);document.getElementById("adminApp").classList.toggle("hidden",!logged);
 if(logged){loadProfile();updateStats();}
 document.getElementById("loginForm").addEventListener("submit",e=>{e.preventDefault();/* DEMO ONLY: client-side authentication is not secure. */if(document.getElementById("username").value==="admin"&&document.getElementById("password").value==="admin123"){sessionStorage.setItem("ic3AdminLogged","true");location.reload()}else document.getElementById("loginError").textContent="Incorrect username or password.";});
 document.querySelectorAll(".side-link[data-panel]").forEach(b=>b.onclick=()=>showPanel(b.dataset.panel));
 document.getElementById("logoutBtn").onclick=()=>{sessionStorage.removeItem("ic3AdminLogged");location.reload()};
 document.getElementById("sidebarToggle").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
 document.getElementById("profileForm").addEventListener("submit",async e=>{e.preventDefault();let d=data(),file=document.getElementById("pImage").files[0];try{if(file)d.profile.image=await readFile(file);d.profile.name=document.getElementById("pName").value.trim();d.profile.course=document.getElementById("pCourse").value.trim();d.profile.intro=document.getElementById("pIntro").value.trim();d.profile.interests=document.getElementById("pInterests").value.trim();d.profile.goals=document.getElementById("pGoals").value.trim();d.profile.quote=document.getElementById("pQuote").value.trim();save(d);alert("Profile saved successfully.");loadProfile();}catch(err){alert(err.message)}});
 document.getElementById("pImage").onchange=async e=>{try{let x=await readFile(e.target.files[0]);let p=document.getElementById("pPreview");p.src=x;p.style.display="block"}catch(err){alert(err.message)}};
 document.getElementById("activityForm").addEventListener("submit",saveActivity);document.getElementById("activityCancel").onclick=resetActivity;
 document.getElementById("achievementForm").addEventListener("submit",saveAchievement);document.getElementById("achievementCancel").onclick=resetAchievement;
 document.getElementById("achImage").onchange=async e=>{try{let x=await readFile(e.target.files[0]);let p=document.getElementById("achPreview");p.src=x;p.style.display="block"}catch(err){alert(err.message)}};
 document.getElementById("aImages").onchange=async e=>{try{document.getElementById("aImagePreview").innerHTML=(await readFiles(e.target.files)).map(x=>`<img src="${x}" alt="">`).join("")}catch(err){alert(err.message)}};
 const theme=document.getElementById("adminTheme");if(localStorage.getItem("ic3Theme")==="dark"){document.body.classList.add("dark");theme.textContent="☀️"}theme.onclick=()=>{document.body.classList.toggle("dark");let dark=document.body.classList.contains("dark");localStorage.setItem("ic3Theme",dark?"dark":"light");theme.textContent=dark?"☀️":"🌙"};
});
