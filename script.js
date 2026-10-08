/* =========================
   DATA LAYER
========================== */

const dataLayer = window.dataLayer = window.dataLayer || [];


const pushEvent = (event, params = {}) => {

  dataLayer.push({
    event,
    ...params
  });

};



/* =========================
   MENÚ
========================== */

const menuToggle =
  document.getElementById("menuToggle");

const nav =
  document.getElementById("mainNav");


if (menuToggle && nav) {

  menuToggle.addEventListener("click", () => {

    const isOpen =
      nav.classList.toggle("open");


    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );


    menuToggle.setAttribute(
      "aria-label",
      isOpen
        ? "Cerrar menú"
        : "Abrir menú"
    );


    menuToggle.textContent =
      isOpen
        ? "×"
        : "☰";


    pushEvent(
      "menu_toggle",
      {
        menu_state:
          isOpen
            ? "open"
            : "closed"
      }
    );

  });

}



/* =========================
   CERRAR MENÚ
========================== */

const closeMenu = () => {

  if (!nav || !menuToggle) {
    return;
  }


  nav.classList.remove("open");


  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );


  menuToggle.setAttribute(
    "aria-label",
    "Abrir menú"
  );


  menuToggle.textContent = "☰";

};



document
  .querySelectorAll("nav a")
  .forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        closeMenu();


        pushEvent(
          "nav_click",
          {
            link_text:
              link.textContent.trim(),

            link_target:
              link.getAttribute("href")
          }
        );

      }
    );

  });



document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      nav?.classList.contains("open")
    ) {

      closeMenu();

      menuToggle?.focus();

    }

  }
);



/* =========================
   CTA
========================== */

document
  .querySelectorAll(".cta-track")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        pushEvent(
          "cta_click",
          {

            cta_name:
              button.dataset.cta ||
              "cta",

            cta_text:
              button.textContent.trim(),

            cta_target:
              button.getAttribute("href") ||
              ""

          }
        );

      }
    );

  });



/* =========================
   DETALLES DE COHETES
========================== */

document
  .querySelectorAll(".details-btn")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const card =
          button.closest(".rocket-card");


        const details =
          card?.querySelector(
            ".rocket-details"
          );


        const rocketName =
          card
            ?.querySelector("h3")
            ?.textContent
            .trim() ||
          "cohete";


        const isSelected =
          button.getAttribute(
            "aria-pressed"
          ) !== "true";


        button.setAttribute(
          "aria-pressed",
          String(isSelected)
        );


        card?.classList.toggle(
          "selected",
          isSelected
        );


        if (details) {

          details.hidden =
            !isSelected;

        }


        button.textContent =
          isSelected
            ? "OCULTAR DETALLES −"
            : "VER DETALLES +";


        pushEvent(
          "rocket_details_click",
          {

            rocket_name:
              rocketName,

            action:
              isSelected
                ? "open"
                : "close"

          }
        );

      }
    );

  });



/* =========================
   FAQ
========================== */

document
  .querySelectorAll(".faq-question")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const item =
          button.closest(".faq-item");


        const answer =
          item?.querySelector(
            ".faq-answer"
          );


        const isOpen =
          button.getAttribute(
            "aria-expanded"
          ) === "true";


        const question =
          button
            .childNodes[0]
            ?.textContent
            ?.trim() ||
          "FAQ";



        document
          .querySelectorAll(
            ".faq-question"
          )
          .forEach((otherButton) => {

            if (
              otherButton !== button
            ) {

              otherButton.setAttribute(
                "aria-expanded",
                "false"
              );


              const otherAnswer =
                otherButton
                  .closest(".faq-item")
                  ?.querySelector(
                    ".faq-answer"
                  );


              if (otherAnswer) {
                otherAnswer.hidden =
                  true;
              }


              const otherIcon =
                otherButton
                  .querySelector("span");


              if (otherIcon) {
                otherIcon.textContent =
                  "+";
              }

            }

          });



        button.setAttribute(
          "aria-expanded",
          String(!isOpen)
        );


        if (answer) {
          answer.hidden =
            isOpen;
        }


        const icon =
          button.querySelector("span");


        if (icon) {

          icon.textContent =
            isOpen
              ? "+"
              : "−";

        }



        pushEvent(
          "faq_open",
          {

            question,

            action:
              isOpen
                ? "close"
                : "open"

          }
        );

      }
    );

  });



/* =========================
   HUBSPOT
========================== */

let hubspotStarted = false;


const hubspotSection =
  document.getElementById(
    "registro"
  );



hubspotSection?.addEventListener(
  "focusin",
  (event) => {

    if (hubspotStarted) {
      return;
    }


    const target =
      event.target;


    if (
      target.matches(
        "input, select, textarea"
      )
    ) {

      hubspotStarted = true;


      pushEvent(
        "hubspot_form_start",
        {

          form_id:
            "889ebe02-3396-450a-ab3d-69142b2e5820"

        }
      );

    }

  }
);



document.addEventListener(
  "submit",
  (event) => {

    const form =
      event.target;


    if (
      !(form instanceof HTMLFormElement)
    ) {
      return;
    }


    if (
      !hubspotSection?.contains(form)
    ) {
      return;
    }


    pushEvent(
      "hubspot_form_submit",
      {

        form_id:
          "889ebe02-3396-450a-ab3d-69142b2e5820"

      }
    );

  }
);



/* =========================
   ANIMACIONES
========================== */

const observer =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "show"
            );


            observer.unobserve(
              entry.target
            );

          }

        }
      );

    },
    {
      threshold:0.12
    }
  );



document
  .querySelectorAll(".reveal")
  .forEach((element) => {

    observer.observe(element);

  });



/* =========================
   VISTA DEL FORMULARIO
========================== */

let feedbackShown = false;


const registroObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (
            entry.isIntersecting &&
            !feedbackShown
          ) {

            feedbackShown = true;


            pushEvent(
              "registration_section_view",
              {
                section:"registro"
              }
            );

          }

        }
      );

    },
    {
      threshold:0.35
    }
  );



if (hubspotSection) {

  registroObserver.observe(
    hubspotSection
  );

}