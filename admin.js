import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { collection, getDocs, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const $=s=>document.querySelector(s); let editingId=null;
const loginView=$("#loginView"),dash=$("#dashboardView");
$("#loginForm").addEventListener("submit",async e=>{e.preventDefault();$("#loginError").textContent="";try{await signInWithEmailAndPassword(auth,$("#email").value,$("#password").value)}catch(err){$("#loginError").textContent=err.message}});
$("#logoutBtn").onclick=()=>signOut(auth);
onAuthStateChanged(auth,user=>{if(user){loginView.classList.add("hidden");dash.classList.remove("hidden");$("#adminEmail").textContent=user.email;loadAll()}else{dash.classList.add("hidden");loginView.classList.remove("hidden")}});

document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.tab).classList.add("active");$("#pageTitle").textContent=b.textContent.replace(/^\S+\s*/,"")});
async function loadAll(){await Promise.all([loadReservations(),loadMenu()])}
async function loadReservations(){
 try{const snap=await getDocs(query(collection(db,"reservations"),orderBy("createdAt","desc")));let total=0,pending=0;const tbody=$("#reservationTable");tbody.innerHTML="";const recent=$("#recentReservations");recent.innerHTML="";
 snap.forEach((d,i)=>{total++;const x=d.data();if(x.status==="pending")pending++;const tr=document.createElement("tr");tr.innerHTML=`<td>${x.name||""}</td><td>${x.phone||""}</td><td>${x.date||""}</td><td>${x.time||""}</td><td>${x.guests||""}</td><td>${x.message||""}</td><td><select class="status" data-id="${d.id}"><option ${x.status==="pending"?"selected":""}>pending</option><option ${x.status==="confirmed"?"selected":""}>confirmed</option><option ${x.status==="cancelled"?"selected":""}>cancelled</option></select></td><td><button class="danger" data-delete="${d.id}">Delete</button></td>`;tbody.appendChild(tr);
 if(i<5)recent.innerHTML+=`<div class="recent"><strong>${x.name}</strong> — ${x.date} ${x.time} (${x.guests})</div>`;});
 $("#totalReservations").textContent=total;$("#pendingReservations").textContent=pending;
 document.querySelectorAll(".status").forEach(s=>s.onchange=()=>updateDoc(doc(db,"reservations",s.dataset.id),{status:s.value}));
 document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=async()=>{if(confirm("Delete this reservation?")){await deleteDoc(doc(db,"reservations",b.dataset.delete));loadReservations()}});
 }catch(e){console.error(e);$("#recentReservations").textContent="Check Firebase setup and security rules."}
}
async function loadMenu(){
 try{const snap=await getDocs(query(collection(db,"menuItems"),orderBy("createdAt","desc")));$("#totalMenu").textContent=snap.size;const list=$("#adminMenuList");list.innerHTML="";
 snap.forEach(d=>{const x=d.data();const row=document.createElement("div");row.className="menu-row";row.innerHTML=`<img src="${x.image}" alt=""><div class="grow"><strong>${x.name}</strong><br><small>${x.category} • ₱${x.price}</small><br><small>${x.description}</small></div><button class="edit" data-edit="${d.id}">Edit</button><button class="danger" data-remove="${d.id}">Delete</button>`;list.appendChild(row)});
 document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=async()=>{if(confirm("Delete menu item?")){await deleteDoc(doc(db,"menuItems",b.dataset.remove));loadMenu()}});
 document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openEdit(b.dataset.edit));
 }catch(e){console.error(e)}
}
$("#addMenuBtn").onclick=()=>{editingId=null;$("#modalTitle").textContent="Add Menu Item";$("#menuForm").reset();$("#menuModal").classList.remove("hidden")};$("#closeModal").onclick=()=>$("#menuModal").classList.add("hidden");
async function openEdit(id){const snap=await getDocs(collection(db,"menuItems"));const d=[...snap.docs].find(x=>x.id===id);if(!d)return;const x=d.data();editingId=id;$("#modalTitle").textContent="Edit Menu Item";$("#menuName").value=x.name;$("#menuCategory").value=x.category;$("#menuPrice").value=x.price;$("#menuImage").value=x.image;$("#menuDescription").value=x.description;$("#menuModal").classList.remove("hidden")}
$("#menuForm").addEventListener("submit",async e=>{e.preventDefault();const data={name:$("#menuName").value.trim(),category:$("#menuCategory").value,price:Number($("#menuPrice").value),image:$("#menuImage").value.trim(),description:$("#menuDescription").value.trim()};if(editingId)await updateDoc(doc(db,"menuItems",editingId),data);else{data.createdAt=serverTimestamp();await addDoc(collection(db,"menuItems"),data)}$("#menuModal").classList.add("hidden");loadMenu()});