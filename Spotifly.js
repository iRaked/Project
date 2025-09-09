document.addEventListener("DOMContentLoaded", () => {
  const scrollAmount = 18 * 16 + 16; // 18rem en px + 1rem gap ≈ 304px
  const searchInput = document.getElementById("searchInput");
  const searchIcon = document.querySelector(".search-icon");

  function initSection(sectionElement) {
    const cards = sectionElement.querySelectorAll(".card");
    const tracks = Array.from(cards).map(card => card.querySelector(".audio-track"));
    const container = sectionElement.querySelector(".cards");
    const btnPrev = sectionElement.querySelector(".nav-prev");
    const btnNext = sectionElement.querySelector(".nav-next");

    let currentIndex = -1;
    let currentOffset = 0;

    // 🔊 Reproducir un track específico
    function playTrack(index) {
      if (currentIndex !== -1) {
        tracks[currentIndex].pause();
        tracks[currentIndex].currentTime = 0;
        cards[currentIndex].classList.remove("active");
        togglePlayIcon(cards[currentIndex], true);
      }

      currentIndex = index;
      const track = tracks[currentIndex];
      track.play();
      cards[currentIndex].classList.add("active");
      togglePlayIcon(cards[currentIndex], false);

      track.onended = () => {
        togglePlayIcon(cards[currentIndex], true);
        cards[currentIndex].classList.remove("active");
        const nextIndex = currentIndex + 1;
        if (nextIndex < tracks.length) {
          playTrack(nextIndex);
        } else {
          currentIndex = -1;
        }
      };
    }

    // 🎭 Alternar ícono Play/Pause
    function togglePlayIcon(card, toPlay) {
      const icon = card.querySelector(".btn-play i");
      icon.classList.remove("fa-play", "fa-pause");
      icon.classList.add(toPlay ? "fa-play" : "fa-pause");
    }

    // 🖱️ Evento para cada botón de play
    cards.forEach((card, index) => {
      const btn = card.querySelector(".btn-play");
      btn.addEventListener("click", () => {
        const track = tracks[index];
        if (!track.paused) {
          track.pause();
          togglePlayIcon(card, true);
          card.classList.remove("active");
          currentIndex = -1;
        } else {
          playTrack(index);
        }
      });
    });

    // 🎯 Desplazamiento con validación visual
    function updateCarousel(direction) {
      const nextOffset = direction === "next"
        ? currentOffset + scrollAmount
        : currentOffset - scrollAmount;

      const containerRect = container.parentElement.getBoundingClientRect();
      const cardsRect = container.getBoundingClientRect();
      const reachedEnd = cardsRect.right <= containerRect.right;
      const reachedStart = currentOffset <= 0;

      if ((direction === "next" && reachedEnd) || (direction === "prev" && reachedStart)) {
        return;
      }

      currentOffset = nextOffset;
      container.style.transform = `translateX(-${currentOffset}px)`;

      setTimeout(() => {
        const updatedRect = container.getBoundingClientRect();
        btnPrev.disabled = currentOffset <= 0;
        btnNext.disabled = updatedRect.right <= containerRect.right;
      }, 300);
    }

    // 🧭 Eventos de navegación
    if (btnNext && btnPrev) {
      btnNext.addEventListener("click", () => updateCarousel("next"));
      btnPrev.addEventListener("click", () => updateCarousel("prev"));
    }

    // 🔍 Ritual de búsqueda por sección
    function performSearch() {
      const query = searchInput?.value.toLowerCase().trim();
      cards.forEach(card => {
        const title = card.querySelector("h2")?.textContent.toLowerCase() || "";
        const description = card.querySelector("p")?.textContent.toLowerCase() || "";
        const match = query === "" || title.includes(query) || description.includes(query);
        card.classList.toggle("hidden", !match);
      });
    }

    // 🧩 Guardar la función para invocarla desde fuera
    sectionElement.__searchFn = performSearch;
  }

  // 🧩 Inicializar al menos 10 secciones
  for (let i = 1; i <= 10; i++) {
    const section = document.querySelector(`.section-${i}`);
    if (section) initSection(section);
  }

  // 🔁 Activar búsqueda global que invoca cada sección
  function triggerSearchInAllSections() {
    for (let i = 1; i <= 10; i++) {
      const section = document.querySelector(`.section-${i}`);
      if (section && typeof section.__searchFn === "function") {
        section.__searchFn();
      }
    }
  }

  if (searchInput && searchIcon) {
    searchInput.addEventListener("input", triggerSearchInAllSections);
    searchIcon.addEventListener("click", triggerSearchInAllSections);
  }
});