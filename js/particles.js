/* ==========================================================================
   ALTIORA MEDIA — particles.js
   Partículas flotantes con conexiones — Canvas puro, sin librerías
   ========================================================================== */

(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // ---- Colores de la marca ----
  const COLOR_PARTICLE = "74, 222, 128"; // --color-accent (#4ade80)
  const COLOR_LINE = "47, 107, 79"; // --color-primary (#2f6b4f)
  const MAX_DISTANCE = 140; // distancia máxima para trazar línea
  const PARTICLE_COUNT = 65;

  let particles = [];
  let animId;
  let W, H;

  // ---- Redimensionar canvas al tamaño del hero ----
  function resize() {
    const hero = canvas.parentElement;
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  // ---- Crear una partícula ----
  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  // ---- Loop de animación ----
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Mover partículas
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Rebotar en los bordes
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Dibujar punto
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR_PARTICLE}, ${p.alpha})`;
      ctx.fill();
    });

    // Dibujar líneas entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DISTANCE) {
          const opacity = (1 - dist / MAX_DISTANCE) * 0.35;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${COLOR_LINE}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  // ---- Parar animación si el hero sale del viewport (rendimiento) ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        draw();
      } else {
        cancelAnimationFrame(animId);
      }
    });
  });
  observer.observe(canvas.parentElement);

  // ---- Redimensionar en resize ----
  window.addEventListener("resize", () => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });

  // ---- Respeta prefers-reduced-motion ----
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReduced.matches) return;

  init();
  draw();
})();
