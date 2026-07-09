(function () {
  const preloader = document.getElementById("preloader");
  const mainWord = document.getElementById("preloaderMain");
  const subWord = document.getElementById("preloaderSub");

  if (!preloader || !mainWord || !subWord) return;

  const WORD_MAIN = "ALTIORA";
  const WORD_SUB = "MEDIA";

  // Tiempo base entre letras (ms)
  const DELAY_BETWEEN = 80;
  // Cuándo empieza cada palabra
  const START_MAIN = 100;
  const START_SUB = START_MAIN + WORD_MAIN.length * DELAY_BETWEEN + 200;
  // Cuándo desaparece el preloader tras mostrar todo
  const HIDE_AFTER = START_SUB + WORD_SUB.length * DELAY_BETWEEN + 900;

  function buildWord(container, word, startDelay) {
    word.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.classList.add("preloader__letter");
      span.textContent = char;
      span.style.animationDelay = `${startDelay + i * DELAY_BETWEEN}ms`;
      container.appendChild(span);
    });
  }

  buildWord(mainWord, WORD_MAIN, START_MAIN);
  buildWord(subWord, WORD_SUB, START_SUB);

  // Ocultar preloader y desbloquear scroll
  setTimeout(() => {
    preloader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
  }, HIDE_AFTER);
})();
