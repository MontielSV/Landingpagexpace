
"use strict";

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

    // Cerrar las demás preguntas
    faqButtons.forEach(otherButton => {
      if (otherButton === button) return;

      otherButton.setAttribute("aria-expanded", "false");

      const otherAnswer = otherButton
        .closest(".faq-item")
        ?.querySelector(".faq-answer");

      if (otherAnswer) {
        otherAnswer.hidden = true;
      }

      const otherIcon = otherButton.querySelector("span");

      if (otherIcon) {
        otherIcon.textContent = "+";
      }
    });

    // Cambiar estado de la pregunta seleccionada
    button.setAttribute("aria-expanded", String(!isOpen));
    answer.hidden = isOpen;

    const icon = button.querySelector("span");

    if (icon) {
      icon.textContent = isOpen ? "+" : "−";
    }

    pushEvent("faq_open", {
      question: button.textContent.trim(),
      action: isOpen ? "close" : "open"
    });
  });
});


/* =========================
   HUBSPOT
========================== */

const hubspotSection = document.getElementById("registro");

let hubspotStarted = false;
let hubspotSubmitted = false;

const HUBSPOT_FORM_ID = "889ebe02-3396-450a-ab3d-69142b2e5820";

hubspotSection?.addEventListener("focusin", event => {
  const target = event.target;

  if (
    !hubspotStarted &&
    target.matches("input, select, textarea")
  ) {
    hubspotStarted = true;

    pushEvent("hubspot_form_start", {
      form_id: HUBSPOT_FORM_ID
    });
  }
});

document.addEventListener("submit", event => {
  const form = event.target;

  if (
    !(form instanceof HTMLFormElement) ||
    !hubspotSection?.contains(form) ||
    hubspotSubmitted
  ) {
    return;
  }

  hubspotSubmitted = true;

  pushEvent("hubspot_form_submit", {
    form_id: HUBSPOT_FORM_ID
  });
});


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
   VISTA DEL REGISTRO
========================== */

let feedbackShown = false;

if (
  hubspotSection &&
  "IntersectionObserver" in window
) {

  const registroObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {

        if (!entry.isIntersecting || feedbackShown) return;

        feedbackShown = true;

        pushEvent("registration_section_view", {
          section: "registro"
        });

        registroObserver.disconnect();
      });
    },
    {
      threshold: 0.25
    }
  );

  registroObserver.observe(hubspotSection);

}


/* =========================
   AÑO AUTOMÁTICO
========================== */

const footerYear = document.querySelector("footer .footer-grid > span");

if (footerYear) {
  footerYear.textContent = `SPAXE · ${new Date().getFullYear()}`;
}
