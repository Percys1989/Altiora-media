document.addEventListener("DOMContentLoaded", () => {
  /* ---- Menú responsive ---- */
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("is-open");
      toggle.setAttribute(
        "aria-expanded",
        navLinks.classList.contains("is-open"),
      );
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () =>
        navLinks.classList.remove("is-open"),
      );
    });
  }

  /* ---- Marcar enlace activo ---- */
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar__links a").forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle(
      "active",
      href === currentPage || (currentPage === "" && href === "index.html"),
    );
  });

  /* ---- Scroll reveal ---- */
  const style = document.createElement("style");
  style.textContent =
    ".is-visible { opacity: 1 !important; transform: translateY(0) !important; }";
  document.head.appendChild(style);

  const revealEls = document.querySelectorAll(
    ".focus-card, .service-card, .partnership-item, .approach-item, .team-card",
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    revealEls.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(22px)";
      el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
});
