"use strict";

/* =========================
   CONFIGURACIÓN EMAILJS
========================== */

const EMAILJS_PUBLIC_KEY = "Wqdt_1DgoeOwM_XH4";
const EMAILJS_SERVICE_ID = "service_8y4ss2b";
const EMAILJS_TEMPLATE_ID = "template_vf1uo67";

// Inicializar EmailJS cuando el SDK esté disponible.
if (window.emailjs) {
  window.emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });
}


/* =========================
   DATA LAYER
========================== */

window.dataLayer = window.dataLayer || [];

const pushEvent = (event, params = {}) => {
  window.dataLayer.push({
    event,
    ...params
  });
};


/* =========================
   MENÚ RESPONSIVE
========================== */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");

const closeMenu = () => {
  if (!nav || !menuToggle) return;

  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  menuToggle.textContent = "☰";
};

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );

    menuToggle.textContent = isOpen ? "×" : "☰";

    pushEvent("menu_toggle", {
      menu_state: isOpen ? "open" : "closed"
    });
  });

  document.querySelectorAll(".nav-link-track").forEach(link => {
    link.addEventListener("click", () => {
      closeMenu();

      pushEvent("nav_click", {
        link_text: link.textContent.trim(),
        link_target: link.getAttribute("href")
      });
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  document.addEventListener("click", event => {
    if (
      nav.classList.contains("open") &&
      !nav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });
}


/* =========================
   CTA Y SEGUIMIENTO
========================== */

document.querySelectorAll(".cta-track").forEach(button => {
  button.addEventListener("click", () => {
    pushEvent("cta_click", {
      cta_name: button.dataset.cta || "cta",
      cta_text: button.textContent.trim(),
      cta_target: button.getAttribute("href") || ""
    });
  });
});


/* =========================
   DETALLES DE COHETES
========================== */

document.querySelectorAll(".details-btn").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".rocket-card");
    const details = card?.querySelector(".rocket-details");

    if (!card || !details) return;

    const isOpen = button.getAttribute("aria-pressed") !== "true";

    const rocketName =
      card.querySelector("h3")?.textContent.trim() || "cohete";

    button.setAttribute("aria-pressed", String(isOpen));
    card.classList.toggle("selected", isOpen);
    details.hidden = !isOpen;

    button.textContent = isOpen
      ? "OCULTAR DETALLES −"
      : "VER DETALLES +";

    pushEvent("rocket_details_click", {
      rocket_name: rocketName,
      action: isOpen ? "open" : "close"
    });
  });
});


/* =========================
   PREGUNTAS FRECUENTES
========================== */

const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach(button => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item?.querySelector(".faq-answer");

    if (!answer) return;

    const isOpen = button.getAttribute("aria-expanded") === "true";

    faqButtons.forEach(otherButton => {
      if (otherButton === button) return;

      otherButton.setAttribute("aria-expanded", "false");

      const otherAnswer = otherButton
        .closest(".faq-item")
        ?.querySelector(".faq-answer");

      if (otherAnswer) otherAnswer.hidden = true;

      const otherIcon = otherButton.querySelector("span");
      if (otherIcon) otherIcon.textContent = "+";
    });

    button.setAttribute("aria-expanded", String(!isOpen));
    answer.hidden = isOpen;

    const icon = button.querySelector("span");
    if (icon) icon.textContent = isOpen ? "+" : "−";

    pushEvent("faq_open", {
      question: button.textContent.trim(),
      action: isOpen ? "close" : "open"
    });
  });
});


/* =========================
   FORMULARIO EMAILJS
========================== */

const registrationSection = document.getElementById("registro");
const subscriptionForm = document.getElementById("subscriptionForm");
const subscriptionEmail = document.getElementById("subscriptionEmail");
const subscriptionSubmit = document.getElementById("subscriptionSubmit");
const subscriptionMessage = document.getElementById("subscriptionMessage");
const subscriptionSuccess = document.getElementById("subscriptionSuccess");
const subscriptionAgain = document.getElementById("subscriptionAgain");

let subscriptionStarted = false;

if (subscriptionForm) {
  if (subscriptionAgain) {
    subscriptionAgain.addEventListener("click", () => {
      subscriptionForm.classList.remove("is-complete");
      subscriptionSuccess.hidden = true;
      subscriptionMessage.textContent = "";
      subscriptionEmail.focus();
    });
  }

  subscriptionForm.addEventListener("focusin", event => {
    if (
      !subscriptionStarted &&
      event.target === subscriptionEmail
    ) {
      subscriptionStarted = true;

      pushEvent("emailjs_form_start", {
        form_id: "spaxe_subscription"
      });
    }
  });

  subscriptionForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (!subscriptionForm.reportValidity()) return;

    if (!window.emailjs) {
      subscriptionMessage.textContent =
        "No se pudo cargar el servicio de correo. Recarga la página e inténtalo nuevamente.";
      subscriptionMessage.className = "subscription-message error";
      return;
    }

    if (EMAILJS_PUBLIC_KEY === "TU_PUBLIC_KEY") {
      subscriptionMessage.textContent =
        "Falta configurar la Public Key de EmailJS en script.js.";
      subscriptionMessage.className = "subscription-message error";
      return;
    }

    subscriptionSubmit.disabled = true;
    subscriptionSubmit.textContent = "ENVIANDO...";
    subscriptionMessage.textContent = "";
    subscriptionMessage.className = "subscription-message";

    try {
      // Inicializar aquí también garantiza que el SDK defer ya esté disponible.
      window.emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
      });

      await window.emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        subscriptionForm
      );

      subscriptionMessage.textContent = "";
      subscriptionMessage.className = "subscription-message";
      subscriptionForm.classList.add("is-complete");
      if (subscriptionSuccess) {
        subscriptionSuccess.hidden = false;
        subscriptionSuccess.classList.remove("success-replay");
        void subscriptionSuccess.offsetWidth;
        subscriptionSuccess.classList.add("success-replay");
      }
      launchSuccessConfetti();

      pushEvent("emailjs_form_submit", {
        form_id: "spaxe_subscription",
        form_status: "success"
      });

      subscriptionForm.reset();
      subscriptionStarted = false;

    } catch (error) {
      console.error("Error al enviar el formulario EmailJS:", error);

      subscriptionMessage.textContent =
        "No fue posible completar la suscripción. Verifica tu conexión e inténtalo de nuevo.";
      subscriptionMessage.className = "subscription-message error";

      pushEvent("emailjs_form_submit", {
        form_id: "spaxe_subscription",
        form_status: "error"
      });

    } finally {
      subscriptionSubmit.disabled = false;
      subscriptionSubmit.textContent = "SUSCRIBIRME A SPAXE →";
    }
  });
}


/* =========================
   EXPERIENCIA DE ENTRADA SPAXE
========================== */

const motionEnabled = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (motionEnabled && !sessionStorage.getItem("spaxeIntroSeen")) {
  const intro = document.createElement("div");
  intro.className = "space-intro";
  intro.setAttribute("aria-label", "Bienvenido a SPAXE");
  intro.innerHTML = `
    <div class="intro-stars" aria-hidden="true"></div>
    <div class="intro-content">
      <span class="intro-orbit"><i></i><b>✦</b></span>
      <span class="intro-overline">PREPARANDO SISTEMAS</span>
      <strong class="intro-logo">SPA<span>XE</span></strong>
      <span class="intro-caption">TU UNIVERSO ESTÁ A PUNTO DE EXPANDIRSE</span>
      <div class="intro-progress"><i></i></div>
    </div>`;
  document.body.appendChild(intro);
  document.body.classList.add("intro-active");
  sessionStorage.setItem("spaxeIntroSeen", "1");
  window.setTimeout(() => {
    intro.classList.add("intro-finished");
    document.body.classList.remove("intro-active");
    window.setTimeout(() => intro.remove(), 900);
  }, 1900);
}

/* Pequeña celebración visual después de una suscripción confirmada */
function launchSuccessConfetti() {
  if (!motionEnabled || !subscriptionSuccess) return;
  const colors = ["#2784F5", "#fd7600", "#ffffff", "#78b7ff"];
  for (let i = 0; i < 24; i++) {
    const particle = document.createElement("span");
    particle.className = "success-particle";
    particle.style.setProperty("--particle-angle", `${(360 / 24) * i}deg`);
    particle.style.setProperty("--particle-distance", `${55 + Math.random() * 95}px`);
    particle.style.setProperty("--particle-color", colors[i % colors.length]);
    subscriptionSuccess.appendChild(particle);
    window.setTimeout(() => particle.remove(), 1100);
  }
}

/* Parallax sutil en los elementos decorativos del hero */
if (motionEnabled && window.matchMedia("(pointer: fine)").matches) {
  const hero = document.querySelector(".hero");
  const planets = document.querySelectorAll(".hero .planet");
  hero?.addEventListener("pointermove", event => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    planets.forEach((planet, index) => {
      const depth = (index + 1) * 10;
      planet.style.setProperty("--parallax-x", `${x * depth}px`);
      planet.style.setProperty("--parallax-y", `${y * depth}px`);
    });
  });
  hero?.addEventListener("pointerleave", () => {
    planets.forEach(planet => {
      planet.style.setProperty("--parallax-x", "0px");
      planet.style.setProperty("--parallax-y", "0px");
    });
  });
}


/* =========================
   ANIMACIONES REVEAL
========================== */

const revealElements = document.querySelectorAll(".reveal");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach(element => {
    element.classList.add("show");
  });
} else {
  document.documentElement.classList.add("js-enabled");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px 50px 0px"
    }
  );

  revealElements.forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${(index % 4) * 95}ms`);
    revealObserver.observe(element);
  });
}


/* =========================
   VISTA DE REGISTRO
========================== */

let registrationViewTracked = false;

if (registrationSection && "IntersectionObserver" in window) {
  const registroObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || registrationViewTracked) return;

        registrationViewTracked = true;

        pushEvent("registration_section_view", {
          section: "registro"
        });

        registroObserver.disconnect();
      });
    },
    { threshold: 0.25 }
  );

  registroObserver.observe(registrationSection);
}


/* =========================
   AÑO AUTOMÁTICO
========================== */

const footerYear = document.querySelector("footer .footer-grid > span");

if (footerYear) {
  footerYear.textContent = `SPAXE · ${new Date().getFullYear()}`;
}
