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

let subscriptionStarted = false;

if (subscriptionForm) {
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
      await window.emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        subscriptionForm
      );

      subscriptionMessage.textContent =
        "¡Suscripción realizada! Revisa tu correo, pronto recibirás noticias de SPAXE.";
      subscriptionMessage.className = "subscription-message success";

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

  revealElements.forEach(element => {
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
