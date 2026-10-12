"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const yearElement = document.getElementById("current-year");
  const enquiryForm = document.getElementById("enquiry-form");
  const formFeedback = document.getElementById("form-feedback");

  // Update the copyright year automatically.
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Mobile navigation.
  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mainNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      menuToggle.setAttribute(
        "aria-label",
        isExpanded ? "Open navigation" : "Close navigation"
      );

      mainNav.classList.toggle("is-open", !isExpanded);
      document.body.classList.toggle("menu-open", !isExpanded);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) {
        closeMenu();
      }
    });
  }

  // Highlight the navigation link for the visible section.
  const observedSections = Array.from(navLinks)
    .map((link) => {
      const target = document.querySelector(link.getAttribute("href"));

      return target ? { link, target } : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );

        if (!visibleEntries.length) return;

        const visibleSection = visibleEntries[0].target;

        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${visibleSection.id}`
          );
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.15, 0.3, 0.5]
      }
    );

    observedSections.forEach(({ target }) => {
      sectionObserver.observe(target);
    });
  }

  // Demonstration form: validates fields but does not send or store data.
  if (enquiryForm && formFeedback) {
    enquiryForm.addEventListener("input", (event) => {
      const field = event.target;

      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) {
        field.removeAttribute("aria-invalid");
        formFeedback.textContent = "";
      }
    });

    enquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();
      formFeedback.textContent = "";

      const requiredFields = enquiryForm.querySelectorAll(
        "input[required], textarea[required], select[required]"
      );

      let firstInvalidField = null;

      requiredFields.forEach((field) => {
        const isValid =
          field.value.trim() !== "" && field.checkValidity();

        if (!isValid) {
          field.setAttribute("aria-invalid", "true");

          if (!firstInvalidField) {
            firstInvalidField = field;
          }
        } else {
          field.removeAttribute("aria-invalid");
        }
      });

      if (firstInvalidField) {
        formFeedback.textContent =
          "Please complete the required fields with valid information.";

        firstInvalidField.focus();
        return;
      }

      formFeedback.textContent =
        "Your details are valid. This demo form is not connected to an email or submission service yet.";
    });
  }
});