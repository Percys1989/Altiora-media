document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("contactModal");
  const fab = document.getElementById("fabContact");
  const closeBtn = document.getElementById("modalClose");
  const form = document.getElementById("contactForm");
  const response = document.getElementById("formResponse");
  const submitBtn = form ? form.querySelector(".form-submit") : null;

  if (!overlay || !fab) return;

  // ---- Abrir modal ----
  function openModal() {
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    // Focus en el primer campo
    setTimeout(() => {
      const first = form.querySelector("input, select, textarea");
      if (first) first.focus();
    }, 350);
  }

  // ---- Cerrar modal ----
  function closeModal() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  fab.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  // Abrir modal desde cualquier enlace con clase .open-modal o #navCTA
  document.querySelectorAll(".open-modal, #navCTA").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Cerrar al hacer clic fuera del modal
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // Cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open"))
      closeModal();
  });

  // ---- Envío del formulario ----
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Resetear respuesta anterior
    response.className = "form-response";
    response.textContent = "";

    // Deshabilitar botón mientras procesa
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Sending...
    `;

    // Agregar CSS de spin si no existe
    if (!document.getElementById("spinStyle")) {
      const style = document.createElement("style");
      style.id = "spinStyle";
      style.textContent =
        ".spin { animation: spinAnim 0.8s linear infinite; } @keyframes spinAnim { to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }

    try {
      const formData = new FormData(form);
      const res = await fetch("mailer.php", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        response.classList.add("success");
        response.textContent = data.message;
        form.reset();
        // Cerrar modal tras 3 segundos
        setTimeout(closeModal, 3000);
      } else {
        response.classList.add("error");
        response.textContent = data.message;
      }
    } catch (err) {
      response.classList.add("error");
      response.textContent = "Connection error. Please try again.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i data-lucide="send"></i> Send Message`;
      if (window.lucide) lucide.createIcons();
    }
  });
});
