import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const toggle=document.getElementById("menuToggle"),nav=document.getElementById("navMenu"),header=document.getElementById("header");
toggle.addEventListener("click",()=>{nav.classList.toggle("active");toggle.querySelector("i").className=nav.classList.contains("active")?"fa-solid fa-xmark":"fa-solid fa-bars"});
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("active");toggle.querySelector("i").className="fa-solid fa-bars"}));
window.addEventListener("scroll",()=>header.classList.toggle("scrolled",window.scrollY>40));
const date=document.getElementById("date"); date.min=new Date().toISOString().split("T")[0];
const toast=document.getElementById("toast"); const showToast=m=>{toast.textContent=m;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),4500)};

async function loadMenu(){
 const grid=document.getElementById("menuGrid");
 try{
   const snap=await getDocs(query(collection(db,"menuItems"),orderBy("createdAt","desc")));
   grid.innerHTML="";
   if(snap.empty){grid.innerHTML='<p class="loading">No menu items yet. Add items in Admin Dashboard.</p>';return}
   snap.forEach(d=>{const x=d.data(); const card=document.createElement("article");card.className=`card ${x.category||""}`;
     card.innerHTML=`<img src="${x.image}" alt="${x.name}"><div><h3>${x.name}<span>₱${Number(x.price).toLocaleString()}</span></h3><p>${x.description}</p></div>`;grid.appendChild(card);});
 }catch(e){grid.innerHTML='<p class="loading">Please complete Firebase setup first.</p>';}
}
loadMenu();
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.filter;document.querySelectorAll(".card").forEach(c=>c.style.display=(f==="all"||c.classList.contains(f))?"block":"none")}));
document.getElementById("reservationForm").addEventListener("submit",async e=>{
 e.preventDefault(); const btn=e.target.querySelector("button");btn.disabled=true;btn.textContent="Sending...";
 const data={name:document.getElementById("name").value.trim(),phone:document.getElementById("phone").value.trim(),date:date.value,time:document.getElementById("time").value,guests:document.getElementById("guests").value,message:document.getElementById("message").value.trim(),status:"pending",createdAt:serverTimestamp()};
 try{await addDoc(collection(db,"reservations"),data);e.target.reset();showToast("Reservation sent successfully!");}
 catch(err){showToast("Unable to send reservation. Please check Firebase setup.");}
 finally{btn.disabled=false;btn.textContent="Reserve Table";}
});
