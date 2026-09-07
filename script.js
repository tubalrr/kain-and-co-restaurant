const toggle=document.getElementById("menuToggle"),nav=document.getElementById("navMenu"),header=document.getElementById("header");
toggle.addEventListener("click",()=>{nav.classList.toggle("active");toggle.querySelector("i").className=nav.classList.contains("active")?"fa-solid fa-xmark":"fa-solid fa-bars"});
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("active");toggle.querySelector("i").className="fa-solid fa-bars"}));
window.addEventListener("scroll",()=>header.classList.toggle("scrolled",window.scrollY>40));
const filters=document.querySelectorAll(".filter"),cards=document.querySelectorAll(".card");
filters.forEach(b=>b.addEventListener("click",()=>{filters.forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.filter;cards.forEach(c=>c.style.display=(f==="all"||c.classList.contains(f))?"block":"none")}));
const date=document.getElementById("date");date.min=new Date().toISOString().split("T")[0];
const form=document.getElementById("reservationForm"),toast=document.getElementById("toast");
form.addEventListener("submit",e=>{e.preventDefault();const name=document.getElementById("name").value;toast.textContent=`Thank you, ${name}! Your reservation request has been received.`;toast.classList.add("show");form.reset();setTimeout(()=>toast.classList.remove("show"),5000)});
