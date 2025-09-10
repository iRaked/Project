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
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
  const track = tracks[index];

  btn.addEventListener("click", async () => {
    // Validar que el track esté listo para reproducirse
    if (track.readyState < 2) return;

    // Si ya está reproduciendo, pausamos
    if (!track.paused && !track.ended) {
      track.pause();
      togglePlayIcon(card, true);
      card.classList.remove("active");
      currentIndex = -1;
    } else {
      try {
        playTrack(index);
      } catch (err) {
        console.warn("Error al intentar reproducir el audio:", err);
      }
    }
  });
});
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 🎯 Desplazamiento con validación visual
function updateCarousel(direction) {
  const containerWidth = container.parentElement.offsetWidth;
  const totalWidth = container.scrollWidth;
  const cardWidth = Math.floor((18 * 16 + 16) * 0.6); // ≈ 182px
const maxOffset = totalWidth - containerWidth + cardWidth;

  const nextOffset = direction === "next"
    ? Math.min(currentOffset + scrollAmount, maxOffset)
    : Math.max(currentOffset - scrollAmount, 0);

  currentOffset = nextOffset;
  container.style.transform = `translateX(-${currentOffset}px)`;

  // 🧭 Validar límites visuales
  btnPrev.disabled = currentOffset <= 0;
  btnNext.disabled = currentOffset >= maxOffset - 1; // ← margen de tolerancia
}

// 🧭 Eventos de navegación
if (btnNext && btnPrev) {
  btnNext.addEventListener("click", () => updateCarousel("next"));
  btnPrev.addEventListener("click", () => updateCarousel("prev"));
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 3 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 4 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎧 Reproductor global
const globalPlayer = document.getElementById("global-player");

// 🧩 Renderizar sección desde JSON
async function renderSection1() {
  const container = document.getElementById("cards-section-1");
  const btnPrev = document.querySelector(".section-1 .nav-prev");
  const btnNext = document.querySelector(".section-1 .nav-next");
  const scrollAmount = 304; // 18rem + 1rem gap
  let currentOffset = 0;

  try {
    const response = await fetch("data/section-1.json");
    const tracks = await response.json();

    tracks.forEach((track, index) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div class="cover"><img src="${track.caratula}" alt="Cover" /></div>
        <div class="info">
          <h2>${track.artista}</h2>
          <p>${track.nombre}</p>
          <button class="btn-play" data-src="${track.enlace}">
            <i class="fa-solid fa-play"></i>
          </button>
        </div>
      `;

      // 🎵 Evento de reproducción
      const btn = card.querySelector(".btn-play");
      btn.addEventListener("click", async () => {
        const src = btn.dataset.src;

        if (globalPlayer.src !== src) {
          globalPlayer.src = src;
        }

        try {
          await globalPlayer.play();
          togglePlayIcon(btn, false);
          highlightCard(card);
        } catch (err) {
          console.warn("Error al reproducir:", err);
        }
      });

      container.appendChild(card);
    });

    // 🎯 Navegación horizontal
    btnNext.addEventListener("click", () => {
      const maxOffset = container.scrollWidth - container.parentElement.offsetWidth;
      currentOffset = Math.min(currentOffset + scrollAmount, maxOffset);
      container.style.transform = `translateX(-${currentOffset}px)`;
    });

    btnPrev.addEventListener("click", () => {
      currentOffset = Math.max(currentOffset - scrollAmount, 0);
      container.style.transform = `translateX(-${currentOffset}px)`;
    });

  } catch (error) {
    console.error("Error al cargar sección 1:", error);
  }
}

// 🎭 Alternar ícono Play/Pause
function togglePlayIcon(button, toPlay) {
  const icon = button.querySelector("i");
  icon.classList.remove("fa-play", "fa-pause");
  icon.classList.add(toPlay ? "fa-play" : "fa-pause");
}

// ✨ Resaltar tarjeta activa
function highlightCard(activeCard) {
  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("active");
    togglePlayIcon(card.querySelector(".btn-play"), true);
  });
  activeCard.classList.add("active");
}
