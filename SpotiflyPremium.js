//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ B1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 Renderizado directo desde JSON en contenedores específicos

let isModalActive = false;
let isWrappedActive = false;

// ✅ VARIABLES GLOBALES PARA EL MODAL (NUEVO)
let globalModalPlaylist = [];
let globalModalIndex = 0;

// ✅ FUNCIÓN GLOBAL playTrack() (NUEVO)
function playTrack(index) {
  globalModalIndex = index;
  const track = globalModalPlaylist[index];
  if (!track) return;

  const modal = document.getElementById("modal-player");
  const modalAudio = document.getElementById("modal-audio");
  const modalCover = document.getElementById("modal-cover");
  const modalArtist = document.getElementById("modal-artist");
  const modalTitle = document.getElementById("modal-title");

  const enlace = track.enlace || track.dropbox_url;

  modalCover.src = track.caratula;
  modalArtist.textContent = track.artista;
  modalTitle.textContent = track.nombre;

  modalAudio.pause();
  modalAudio.removeAttribute("src");
  modalAudio.src = enlace;
  modalAudio.load();

  modal.classList.remove("hidden");

  modalAudio.oncanplay = () => modalAudio.play();
}

document.addEventListener("DOMContentLoaded", async () => {
  const globalPlayer = document.getElementById("global-player");

  try {
    const response = await fetch("SpotiflyPremium.json");
    const data = await response.json();

    // 🔁 Renderizar cada sección directamente
    renderCards("hits", "cards-section-1", data);
    renderCards("regional_mexicano", "cards-section-2", data);
    renderCards("viva_latino", "cards-section-3", data);
    renderCards("rock_espanol", "cards-section-4", data);
    renderCards("mega_mix", "cards-section-5", data);
    renderCards("after_party", "cards-section-6", data);
    renderCards("pop_electronico", "cards-section-7", data);
    renderCards("baladas", "cards-section-8", data);
    renderCards("essentials", "cards-section-9", data);
    renderCards("eighties", "cards-section-10", data);

    // ✅ Activar reproducción continua por contenedor
    initModalPlayer();

    // ✅ Activar carrusel por contenedor
    initCarousel("cards-section-1");
    initCarousel("cards-section-2");
    initCarousel("cards-section-3");
    initCarousel("cards-section-4");
    initCarousel("cards-section-5");
    initCarousel("cards-section-6");
    initCarousel("cards-section-7");
    initCarousel("cards-section-8");
    initCarousel("cards-section-9");
    initCarousel("cards-section-10");
      
    initModalPlayer("cards-section-1", data.hits);
    initModalPlayer("cards-section-2", data.regional_mexicano);
    initModalPlayer("cards-section-3", data.viva_latino);
    initModalPlayer("cards-section-4", data.rock_espanol);
    initModalPlayer("cards-section-5", data.mega_mix);
    initModalPlayer("cards-section-6", data.after_party);
    initModalPlayer("cards-section-7", data.pop_electronico);
    initModalPlayer("cards-section-8", data.baladas);
    initModalPlayer("cards-section-9", data.essentials);
    initModalPlayer("cards-section-10", data.eighties);

  } catch (error) {
    console.error("Error al cargar el JSON:", error);
  }
});

// 🧱 Función para renderizar tarjetas en un contenedor específico
function renderCards(clave, contenedorId, data) {
  const container = document.getElementById(contenedorId);
  const tracks = data[clave];
  if (!container || !Array.isArray(tracks)) return;

  tracks.forEach((track, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const enlace = track.enlace || track.dropbox_url;

    card.innerHTML = `
      <div class="cover"><img src="${track.caratula}" alt="Cover" /></div>
      <div class="info">
        <h2>${track.artista}</h2>
        <p>${track.nombre}</p>
        <button class="btn-play" 
                data-src="${enlace}" 
                data-id="${clave}-${index}">
          <i class="fa-solid fa-play"></i>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⭐ LISTAS DESTACADAS (JSON independientes)
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const listasDestacadas = [
  { nombre: "Novedades",       archivo: "https://radio-tekileros.vercel.app/Actual.json" },
  { nombre: "Éxitos",       archivo: "https://radio-tekileros.vercel.app/Exitos.json" },
  { nombre: "Ruido de Lata",     archivo: "https://radio-tekileros.vercel.app/HardCore.json" },
  { nombre: "Baladas Rock", archivo: "https://radio-tekileros.vercel.app/BaladasRock.json" },
  { nombre: "Rumba Caliente",        archivo: "https://radio-tekileros.vercel.app/Rumba.json" },
  { nombre: "Bandida",      archivo: "https://radio-tekileros.vercel.app/Bandida.json" }
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cards-section-11");

  const covers = [
    "https://santi-graphics.vercel.app/assets/covers/Cover3.png",
    "https://santi-graphics.vercel.app/assets/covers/Cover1.png",
    "https://santi-graphics.vercel.app/assets/covers/Cover11.png",
    "https://santi-graphics.vercel.app/assets/covers/Cover8.png",
    "https://santi-graphics.vercel.app/assets/covers/Cover2.png",
    "https://santi-graphics.vercel.app/assets/covers/Cover4.png"
  ];

  listasDestacadas.forEach((lista, index) => {
    const card = document.createElement("div");
    card.classList.add("card", "destacada-card");
    card.dataset.json = lista.archivo;

    const cover = covers[index % covers.length];

    card.innerHTML = `
      <div class="cover">
        <img src="${cover}" alt="Cover" />
      </div>

      <div class="info">
        <h2>${lista.nombre}</h2>
        <p>Playlist destacada</p>

        <div class="destacada-actions">
          <button class="btn-open" data-json="${lista.archivo}">
            <i class="fa-solid fa-folder-open"></i>
          </button>

          <button class="btn-play btn-play-destacada"
                  data-json="${lista.archivo}">
            <i class="fa-solid fa-play"></i>
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
});


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎵 REPRODUCCIÓN / APERTURA EN LISTAS DESTACADAS (SOLO MODAL)
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.getElementById("cards-section-11").addEventListener("click", async (e) => {
  const playBtn = e.target.closest(".btn-play-destacada");
  const openBtn = e.target.closest(".btn-open");

  // 🗂 ABRIR PLAYLIST EN MODAL (SIN RENDER EN LA SECCIÓN)
  if (openBtn) {
    const archivo = openBtn.dataset.json;
    const response = await fetch(archivo);
    const json = await response.json();

    const clave = Object.keys(json)[0];
    const playlist = json[clave];

    // ✅ Limpia cualquier playlist anterior en el modal y carga esta
    globalModalPlaylist = [...playlist];

    // ✅ Asegúrate de que el modal esté inicializado para esta playlist
    initModalPlayer("cards-section-11", playlist);

    // No reproducimos automáticamente, solo dejamos la cola lista
    return;
  }

  // ▶️ REPRODUCIR PRIMER TRACK DIRECTAMENTE EN MODAL
  if (playBtn) {
    const archivo = playBtn.dataset.json;
    const response = await fetch(archivo);
    const json = await response.json();

    const clave = Object.keys(json)[0];
    const playlist = json[clave];

    // ✅ Siempre sobrescribe la playlist global del modal
    globalModalPlaylist = [...playlist];

    // ✅ Inicializa el modal para esta playlist (por si no estaba enlazado aún)
    initModalPlayer("cards-section-11", playlist);

    // ✅ Reproduce el primer track (solo en modal, sin tocar cards-section-11)
    playTrack(0);
  }
});


// COMPATIBLE CON DROPBOX
function renderCards(clave, contenedorId, data) {
  const container = document.getElementById(contenedorId);
  const tracks = data[clave];
  if (!container || !Array.isArray(tracks)) return;

  tracks.forEach((track, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const enlace = track.enlace || track.dropbox_url;

    card.innerHTML = `
      <div class="cover"><img src="${track.caratula}" alt="Cover" /></div>
      <div class="info">
        <h2>${track.artista}</h2>
        <p>${track.nombre}</p>
        <button class="btn-play" 
                data-src="${enlace}" 
                data-id="${clave}-${index}">
          <i class="fa-solid fa-play"></i>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ B2.1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔊 Reproducción continua con evento único y estado global + prevención de colisión

const playbackRegistry = {}; // 🧠 Estado por contenedor
let activeContainerId = null;

function initPlaybackPerContainer(contenedorId) {
  const globalPlayer = document.getElementById("global-player");
  const container = document.getElementById(contenedorId);
  const modal = document.getElementById("modal-player");
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

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      // 🚫 Si el modal está activo, no reproducir desde el carrusel
      if (modal && !modal.classList.contains("hidden")) return;

      const src = btn.dataset.src;
      const isSameTrack = globalPlayer.getAttribute("data-current-src") === src;
      const isPlaying = !globalPlayer.paused && !globalPlayer.ended;

      const state = playbackRegistry[contenedorId];
      activeContainerId = contenedorId;

      // 🛑 Pausar cualquier otro audio (incluido modal)
      const modalAudio = document.getElementById("modal-audio");
      if (modalAudio && !modalAudio.paused) modalAudio.pause();

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
  const modal = document.getElementById("modal-player");
  if (modal && !modal.classList.contains("hidden")) return; // 🛑 Si el modal está abierto, no continuar

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
function initExternalSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchIcon = document.querySelector(".search-icon");

  function buscarEnSpotify(query) {
    if (!query) return;
    const url = `https://open.spotify.com/search/${encodeURIComponent(query)}`;
    window.open(url, "_blank");
  }

  if (searchInput && searchIcon) {
    searchIcon.addEventListener("click", () => {
      const query = searchInput.value.trim();
      buscarEnSpotify(query);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        buscarEnSpotify(query);
      }
    });
  }
}
initExternalSearch();
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

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ B6 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎛️ Reproductor Modal Universal con navegación, cola, controles extendidos, progreso visual interactivo y control de colisión
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎧 MODAL PLAYER UNIVERSAL — VERSIÓN FINAL
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initModalPlayer() {
  const modal = document.getElementById("modal-player");
  const modalAudio = document.getElementById("modal-audio");
  const modalCover = document.getElementById("modal-cover");
  const modalArtist = document.getElementById("modal-artist");
  const modalTitle = document.getElementById("modal-title");

  const closeBtn = document.querySelector(".close-modal");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const toggleBtn = document.getElementById("btn-toggle");

  const modalQueue = document.getElementById("modal-queue");
  const progressBar = document.getElementById("progress-bar");
  const progressContainer = document.querySelector(".progress-container");

  const volumeControl = document.getElementById("volume-control");
  const speedControl = document.getElementById("speed-control");
  const loopToggle = document.getElementById("loop-toggle");
  const muteToggle = document.getElementById("mute-toggle");

  if (!modal || !modalAudio || !modalCover || !modalArtist || !modalTitle) return;

  let localPlaylist = [];
  let localIndex = -1;

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔁 Helpers internos
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  function loadTrack(index) {
    const track = localPlaylist[index];
    if (!track) return;

    localIndex = index;

    const enlace = track.enlace || track.dropbox_url;
    if (!enlace) return;

    modalCover.src = track.caratula || "";
    modalArtist.textContent = track.artista || "";
    modalTitle.textContent = track.nombre || "";

    modalAudio.pause();
    modalAudio.removeAttribute("src");
    modalAudio.src = enlace;
    modalAudio.load();
  }

  function playCurrent() {
    const globalPlayer = document.getElementById("global-player");
    if (globalPlayer && !globalPlayer.paused) globalPlayer.pause();

    modal.classList.remove("hidden");

    modalAudio.oncanplay = () => {
      modalAudio.play().catch(err => console.warn("Error al reproducir modal:", err));
      const icon = toggleBtn?.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
      }
    };
  }

  function buildQueue() {
    if (!modalQueue) return;
    modalQueue.innerHTML = "";

    localPlaylist.forEach((track, i) => {
      const li = document.createElement("li");
      li.textContent = `${track.artista || ""} – ${track.nombre || ""}`;
      li.addEventListener("click", () => {
        loadTrack(i);
        playCurrent();
      });
      modalQueue.appendChild(li);
    });
  }

  function resetModal() {
    modal.classList.add("hidden");
    modalAudio.pause();
    modalAudio.removeAttribute("src");
    localIndex = -1;
    if (progressBar) progressBar.style.width = "0%";
    const icon = toggleBtn?.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🖱️ Click global: secciones normales + Destacadas
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  document.addEventListener("click", (e) => {
    const playBtn = e.target.closest(".btn-play");
    if (!playBtn) return;

    const isDestacada = playBtn.classList.contains("btn-play-destacada");
    const card = playBtn.closest(".card");

    // 🟢 LISTAS DESTACADAS (usa JSON externo)
    if (isDestacada && playBtn.dataset.json) {
      const archivo = playBtn.dataset.json;

      fetch(archivo)
        .then(r => r.json())
        .then(json => {
          const clave = Object.keys(json)[0];
          const playlist = json[clave];
          if (!Array.isArray(playlist) || playlist.length === 0) return;

          localPlaylist = playlist.map(track => ({
            artista: track.artista,
            nombre: track.nombre,
            caratula: track.caratula,
            enlace: track.enlace || track.dropbox_url,
            dropbox_url: track.dropbox_url
          }));

          localIndex = 0;
          loadTrack(0);
          buildQueue();
          playCurrent();
        })
        .catch(err => console.error("Error cargando playlist destacada:", err));

      return;
    }

    // 🟢 SECCIONES NORMALES (1–10): usa cards del contenedor
    const container = card?.closest("[id^='cards-section']");
    if (!container) return;

    const cards = container.querySelectorAll(".card");

    localPlaylist = [...cards].map(c => {
      const b = c.querySelector(".btn-play");
      const img = c.querySelector("img");
      const h2 = c.querySelector("h2");
      const p = c.querySelector("p");

      return {
        artista: h2?.textContent || "",
        nombre: p?.textContent || "",
        caratula: img?.src || "",
        enlace: b?.dataset.src || ""
      };
    });

    localIndex = [...cards].indexOf(card);

    if (localIndex < 0) return;

    loadTrack(localIndex);
    buildQueue();
    playCurrent();
  });

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⏭️ / ⏮️ Navegación
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      const next = localIndex + 1;
      if (next < localPlaylist.length) {
        loadTrack(next);
        playCurrent();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      const prev = localIndex - 1;
      if (prev >= 0) {
        loadTrack(prev);
        playCurrent();
      }
    });
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⏯️ Play / Pause
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const icon = toggleBtn.querySelector("i");
      if (!icon) return;

      if (modalAudio.paused) {
        modalAudio.play().catch(err => console.warn("Error al reanudar modal:", err));
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
      } else {
        modalAudio.pause();
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
      }
    });
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ❌ Cerrar modal (botón)
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      resetModal();
    });
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⌨️ Cerrar modal con ESC
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  document.addEventListener("keydown", (e) => {
    if (typeof isWrappedActive !== "undefined" && isWrappedActive) return;
    if (e.key !== "Escape") return;
    if (modal.classList.contains("hidden")) return;
    resetModal();
  });

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔁 Reproducción continua
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  modalAudio.addEventListener("ended", () => {
    const next = localIndex + 1;
    if (next < localPlaylist.length) {
      loadTrack(next);
      playCurrent();
    } else {
      resetModal();
    }
  });

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎚️ Controles extra
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (volumeControl) {
    volumeControl.addEventListener("input", () => {
      modalAudio.volume = parseFloat(volumeControl.value);
    });
  }

  if (speedControl) {
    speedControl.addEventListener("change", () => {
      modalAudio.playbackRate = parseFloat(speedControl.value);
    });
  }

  if (loopToggle) {
    loopToggle.addEventListener("click", () => {
      modalAudio.loop = !modalAudio.loop;
      loopToggle.textContent = `Loop: ${modalAudio.loop ? "Loop: On" : "Loop: Off"}`;
    });
  }

  if (muteToggle) {
    muteToggle.addEventListener("click", () => {
      modalAudio.muted = !modalAudio.muted;
      muteToggle.textContent = modalAudio.muted ? "Unmute" : "Mute";
    });
  }

  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📈 Progreso
  //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  modalAudio.addEventListener("timeupdate", () => {
    if (modalAudio.duration && progressBar) {
      const percent = (modalAudio.currentTime / modalAudio.duration) * 100;
      progressBar.style.width = `${percent}%`;
    }
  });

  if (progressContainer) {
    progressContainer.addEventListener("click", (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      modalAudio.currentTime = percent * modalAudio.duration;
    });
  }
}
