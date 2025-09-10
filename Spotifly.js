//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ B1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 Renderizado directo desde JSON en contenedores específicos

document.addEventListener("DOMContentLoaded", async () => {
  const globalPlayer = document.getElementById("global-player");

  try {
    const response = await fetch("Spotifly.json");
    const data = await response.json();

    // 🔁 Renderizar cada sección directamente
    renderCards("hits", "cards-section-1", data);
    renderCards("regional_mexicano", "cards-section-2", data);
    renderCards("viva_latino", "cards-section-3", data);
    renderCards("rock_espanol", "cards-section-4", data);
    renderCards("mega_mix", "cards-section-5", data);
    renderCards("after_party", "cards-section-6", data);
    renderCards("pop_electronico", "cards-section-7", data);

    // ✅ Activar reproducción continua por contenedor
    initPlaybackPerContainer("cards-section-1");
    initPlaybackPerContainer("cards-section-2");
    initPlaybackPerContainer("cards-section-3");
    initPlaybackPerContainer("cards-section-4");
    initPlaybackPerContainer("cards-section-5");
    initPlaybackPerContainer("cards-section-6");
    initPlaybackPerContainer("cards-section-7");

    // ✅ Activar carrusel por contenedor
    initCarousel("cards-section-1");
    initCarousel("cards-section-2");
    initCarousel("cards-section-3");
    initCarousel("cards-section-4");
    initCarousel("cards-section-5");
    initCarousel("cards-section-6");
    initCarousel("cards-section-7");

  } catch (error) {
    console.error("Error al cargar el JSON:", error);
  }
});

// 🧱 Función para renderizar tarjetas en un contenedor específico
function renderCards(clave, contenedorId, data) {
  const container = document.getElementById(contenedorId);
  const tracks = data[clave];
  if (!container || !Array.isArray(tracks)) return;

  tracks.forEach((track) => {
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

    container.appendChild(card);
  });
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ B2.1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔊 Reproducción continua con evento único y estado global

const playbackRegistry = {}; // 🧠 Estado por contenedor
let activeContainerId = null;

function initPlaybackPerContainer(contenedorId) {
  const globalPlayer = document.getElementById("global-player");
  const container = document.getElementById(contenedorId);
  if (!globalPlayer || !container) return;

  const cards = container.querySelectorAll(".card");
  playbackRegistry[contenedorId] = {
    cards,
    currentIndex: -1,
    currentCard: null
  };

  cards.forEach((card, index) => {
    const btn = card.querySelector(".btn-play");
    if (!btn) return;

    btn.addEventListener("click", async () => {
      const src = btn.dataset.src;
      const isSameTrack = globalPlayer.getAttribute("data-current-src") === src;
      const isPlaying = !globalPlayer.paused && !globalPlayer.ended;

      const state = playbackRegistry[contenedorId];
      activeContainerId = contenedorId;

      if (isSameTrack && isPlaying) {
        globalPlayer.pause();
        togglePlayIcon(btn, true);
        card.classList.remove("active");
        state.currentIndex = -1;
        state.currentCard = null;
      } else {
        globalPlayer.pause();
        globalPlayer.removeAttribute("src");
        globalPlayer.setAttribute("src", src);
        globalPlayer.setAttribute("data-current-src", src);
        globalPlayer.load();

        state.currentIndex = index;
        state.currentCard = card;

        try {
          await globalPlayer.play();
          highlightCard(card);
          togglePlayIcon(btn, false);
        } catch (err) {
          console.warn("Error al reproducir:", err);
        }
      }
    });
  });
}

// 🔁 Evento único para reproducción continua
document.getElementById("global-player").addEventListener("ended", () => {
  const state = playbackRegistry[activeContainerId];
  if (!state || !state.currentCard) return;

  togglePlayIcon(state.currentCard.querySelector(".btn-play"), true);
  state.currentCard.classList.remove("active");

  const nextIndex = state.currentIndex + 1;
  const nextCard = state.cards[nextIndex];
  if (nextCard) {
    const nextBtn = nextCard.querySelector(".btn-play");
    nextBtn.click();
  } else {
    state.currentIndex = -1;
    state.currentCard = null;
    activeContainerId = null;
  }
});
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ B3 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🖱️ Carrusel horizontal por contenedor específico

function initCarousel(contenedorId) {
  const scrollAmount = 18 * 16 + 16; // 18rem + 1rem gap ≈ 304px
  const container = document.getElementById(contenedorId);
  if (!container) return;

  // 🔍 Buscar el contenedor padre con clase que empiece por "section-"
  const section = container.closest("[class^='section-']");
  if (!section) return;

  const btnPrev = section.querySelector(".nav-prev");
  const btnNext = section.querySelector(".nav-next");
  let currentOffset = 0;

  function updateCarousel(direction) {
    const containerWidth = container.parentElement.offsetWidth;
    const totalWidth = container.scrollWidth;
    const cardWidth = Math.floor(scrollAmount * 0.6); // ≈ 182px
    const maxOffset = totalWidth - containerWidth + cardWidth;

    const nextOffset = direction === "next"
      ? Math.min(currentOffset + scrollAmount, maxOffset)
      : Math.max(currentOffset - scrollAmount, 0);

    currentOffset = nextOffset;
    container.style.transform = `translateX(-${currentOffset}px)`;

    btnPrev.disabled = currentOffset <= 0;
    btnNext.disabled = currentOffset >= maxOffset - 1;
  }

  if (btnNext && btnPrev) {
    btnNext.addEventListener("click", () => updateCarousel("next"));
    btnPrev.addEventListener("click", () => updateCarousel("prev"));
  }
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ B4 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 Búsqueda modular por contenedor + activación global

function initSearch(contenedoresIds) {
  const searchInput = document.getElementById("searchInput");
  const searchIcon = document.querySelector(".search-icon");

  contenedoresIds.forEach((contenedorId) => {
    const container = document.getElementById(contenedorId);
    if (!container) return;

    const cards = container.querySelectorAll(".card");

    // 🧩 Guardar función de búsqueda en el contenedor
    container.__searchFn = () => {
      const query = searchInput?.value.toLowerCase().trim() || "";

      cards.forEach((card) => {
        const title = card.querySelector("h2")?.textContent.toLowerCase() || "";
        const description = card.querySelector("p")?.textContent.toLowerCase() || "";
        const match = query === "" || title.includes(query) || description.includes(query);
        card.classList.toggle("hidden", !match);
      });
    };
  });

  // 🔁 Activar búsqueda global que invoca cada contenedor
  function triggerSearchInAllContainers() {
    contenedoresIds.forEach((contenedorId) => {
      const container = document.getElementById(contenedorId);
      if (container && typeof container.__searchFn === "function") {
        container.__searchFn();
      }
    });
  }

  if (searchInput && searchIcon) {
    searchInput.addEventListener("input", triggerSearchInAllContainers);
    searchIcon.addEventListener("click", triggerSearchInAllContainers);
  }
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ B5 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎭 Funciones auxiliares para alternancia visual y estado activo

function togglePlayIcon(button, toPlay) {
  if (!button) return;
  const icon = button.querySelector("i");
  if (!icon) return;
  icon.classList.remove("fa-play", "fa-pause");
  icon.classList.add(toPlay ? "fa-play" : "fa-pause");
}

function highlightCard(activeCard) {
  if (!activeCard) return;
  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("active");
    const btn = card.querySelector(".btn-play");
    if (btn) togglePlayIcon(btn, true);
  });
  activeCard.classList.add("active");
}
