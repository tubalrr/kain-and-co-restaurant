const reservations=[
{name:"Maria Santos",phone:"0917 123 4567",date:"Sept 10, 2026",time:"7:00 PM",guests:"4 People",request:"Window seat",status:"pending"},
{name:"Juan Dela Cruz",phone:"0918 987 6543",date:"Sept 11, 2026",time:"6:30 PM",guests:"2 People",request:"Birthday dinner",status:"confirmed"},
{name:"Anna Reyes",phone:"0916 456 7890",date:"Sept 12, 2026",time:"12:00 PM",guests:"6 People",request:"Family lunch",status:"pending"},
{name:"Mark Lopez",phone:"0917 555 2222",date:"Sept 13, 2026",time:"8:00 PM",guests:"3 People",request:"",status:"confirmed"},
{name:"Carlo Garcia",phone:"0919 111 3344",date:"Sept 14, 2026",time:"5:30 PM",guests:"2 People",request:"Quiet table",status:"cancelled"}
];
let menu=[
{name:"Chicken Adobo",category:"Filipino",price:220,description:"Classic Filipino chicken adobo",icon:"🍗"},
{name:"Beef Kare-Kare",category:"Filipino",price:320,description:"Rich peanut sauce with tender beef",icon:"🥘"},
{name:"Sinigang na Baboy",category:"Filipino",price:280,description:"Traditional sour pork soup",icon:"🍲"},
{name:"Truffle Pasta",category:"International",price:350,description:"Creamy pasta with truffle flavor",icon:"🍝"},
{name:"Classic Burger",category:"International",price:290,description:"Juicy beef burger and fries",icon:"🍔"}
];
const $=s=>document.querySelector(s);
$("#loginForm").addEventListener("submit",e=>{e.preventDefault();$("#loginView").classList.add("hidden");$("#dashboardView").classList.remove("hidden");renderAll()});
$("#logoutBtn").onclick=()=>{if(confirm("Logout from demo?")){location.reload()}};
function renderAll(){renderReservations();renderMenu()}
function renderReservations(){
 const tb=$("#reservationTable");tb.innerHTML="";
 reservations.forEach((r,i)=>{tb.innerHTML+=`<tr><td><strong>${r.name}</strong></td><td>${r.phone}</td><td>${r.date}</td><td>${r.time}</td><td>${r.guests}</td><td>${r.request||"—"}</td><td><span class="status ${r.status}">${r.status}</span></td><td><button class="action-btn confirm" onclick="setStatus(${i},'confirmed')">Confirm</button><button class="action-btn cancel" onclick="setStatus(${i},'cancelled')">Cancel</button></td></tr>`});
 const recent=$("#recentReservations");recent.innerHTML="";
 reservations.slice(0,4).forEach(r=>recent.innerHTML+=`<div class="recent"><div><strong>${r.name}</strong><br><small>${r.date} • ${r.time} • ${r.guests}</small></div><span class="status ${r.status}">${r.status}</span></div>`);
 $("#totalReservations").textContent=24+Math.max(0,reservations.length-5);$("#pendingReservations").textContent=reservations.filter(x=>x.status==="pending").length;$("#totalMenu").textContent=menu.length;
}
window.setStatus=(i,s)=>{reservations[i].status=s;renderReservations()};
function renderMenu(){const list=$("#menuList");list.innerHTML="";menu.forEach((m,i)=>list.innerHTML+=`<div class="menu-row"><div class="food-icon">${m.icon}</div><div class="grow"><strong>${m.name}</strong><small>${m.category} • ${m.description}</small></div><div class="price">₱${m.price}</div><button class="edit" onclick="editMenu(${i})">✏️</button><button class="delete" onclick="deleteMenu(${i})">🗑️</button></div>`)}
window.editMenu=i=>{const m=menu[i];editing=i;$("#modalTitle").textContent="Edit Menu Item";$("#menuName").value=m.name;$("#menuCategory").value=m.category;$("#menuPrice").value=m.price;$("#menuDescription").value=m.description;$("#menuModal").classList.remove("hidden")};
window.deleteMenu=i=>{if(confirm("Delete "+menu[i].name+"?")){menu.splice(i,1);renderMenu();$("#totalMenu").textContent=menu.length}};
let editing=null;$("#addMenuBtn").onclick=()=>{editing=null;$("#modalTitle").textContent="Add Menu Item";$("#menuForm").reset();$("#menuModal").classList.remove("hidden")};$("#closeModal").onclick=()=>$("#menuModal").classList.add("hidden");
$("#menuForm").addEventListener("submit",e=>{e.preventDefault();const x={name:$("#menuName").value,category:$("#menuCategory").value,price:$("#menuPrice").value,description:$("#menuDescription").value,icon:"🍽️"};if(editing!==null)menu[editing]={...menu[editing],...x};else menu.push(x);$("#menuModal").classList.add("hidden");renderMenu();$("#totalMenu").textContent=menu.length});
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>openTab(b.dataset.tab));document.querySelectorAll(".link-tab").forEach(b=>b.onclick=()=>openTab(b.dataset.go));
function openTab(id){document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.tab===id));document.querySelectorAll(".panel").forEach(x=>x.classList.toggle("active",x.id===id));$("#pageTitle").textContent=id==="overview"?"Dashboard Overview":id==="reservations"?"Reservations":"Menu Manager"}
