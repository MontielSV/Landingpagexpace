const menuToggle=document.getElementById("menuToggle");
const nav=document.getElementById("mainNav");

menuToggle.addEventListener("click",()=>{
  const isOpen=nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",String(isOpen));
  menuToggle.setAttribute("aria-label",isOpen?"Cerrar menú":"Abrir menú");
  menuToggle.textContent=isOpen?"×":"☰";
});

const closeMenu=()=>{
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded","false");
  menuToggle.setAttribute("aria-label","Abrir menú");
  menuToggle.textContent="☰";
};

document.querySelectorAll("nav a").forEach(a=>{
  a.addEventListener("click",closeMenu);
});

document.addEventListener("keydown",event=>{
  if(event.key==="Escape"&&nav.classList.contains("open")){
    closeMenu();
    menuToggle.focus();
  }
});

document.querySelectorAll(".details-btn").forEach(button=>{
  button.addEventListener("click",()=>{
    const card=button.closest(".rocket-card");
    const isSelected=button.getAttribute("aria-pressed")!=="true";
    button.setAttribute("aria-pressed",String(isSelected));
    card.classList.toggle("selected",isSelected);
    button.textContent=isSelected?"MISIÓN SELECCIONADA":"VER DETALLES +";
  });
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});

document.querySelectorAll(".value-card,.rocket-card,.mockup,.brand-principles article").forEach(el=>{
  el.classList.add("reveal");
  observer.observe(el);
});
