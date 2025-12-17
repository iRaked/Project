//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ B1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 Renderizado directo desde JSON en contenedores específicos

let isModalActive = false;
let isWrappedActive = false;

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
    initPlaybackPerContainer("cards-section-1");
    initPlaybackPerContainer("cards-section-2");
    initPlaybackPerContainer("cards-section-3");
    initPlaybackPerContainer("cards-section-4");
    initPlaybackPerContainer("cards-section-5");
    initPlaybackPerContainer("cards-section-6");
    initPlaybackPerContainer("cards-section-7");
    initPlaybackPerContainer("cards-section-8");
    initPlaybackPerContainer("cards-section-9");
    initPlaybackPerContainer("cards-section-10");

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

    // Usamos data-id único basado en la sección y el índice
    card.innerHTML = `
      <div class="cover"><img src="${track.caratula}" alt="Cover" /></div>
      <div class="info">
        <h2>${track.artista}</h2>
        <p>${track.nombre}</p>
        <button class="btn-play" 
                data-src="${track.enlace}" 
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

function initModalPlayer(contenedorId, playlistData) {
  const container = document.getElementById(contenedorId);
  if (!container || !Array.isArray(playlistData)) return;

  const modal = document.getElementById("modal-player");
  const modalAudio = document.getElementById("modal-audio");
  const modalCover = document.getElementById("modal-cover");
  const modalArtist = document.getElementById("modal-artist");
  const modalTitle = document.getElementById("modal-title");
  const closeBtn = document.querySelector(".close-modal");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const modalQueue = document.getElementById("modal-queue");

  const volumeControl = document.getElementById("volume-control");
  const speedControl = document.getElementById("speed-control");
  const loopToggle = document.getElementById("loop-toggle");
  const muteToggle = document.getElementById("mute-toggle");

  const toggleBtn = document.getElementById("btn-toggle");
  const progressBar = document.getElementById("progress-bar");
  const progressContainer = document.querySelector(".progress-container");

  let currentIndex = -1;
  const localPlaylist = [...playlistData]; // 🧩 Aislamiento por sección

  function showModal(track) {
    // La variable 'isModalActive' ahora se usa sin 'let' ya que es global
    isModalActive = true; 

    modalCover.src = track.caratula;
    modalArtist.textContent = track.artista;
    modalTitle.textContent = track.nombre;

    modalAudio.pause();
    modalAudio.removeAttribute("src");
    modalAudio.src = track.enlace;
    modalAudio.load();

    modal.classList.remove("hidden");

    modalCover.classList.add("animate");
    setTimeout(() => modalCover.classList.remove("animate"), 400);

    modalAudio.oncanplay = () => {
      modalAudio.play().catch(err => {
        console.warn("⚠️ Error al reproducir:", err.name);
      });
      const icon = toggleBtn?.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
      }
    };
  }

  function playTrack(index) {
  if (index < 0 || index >= localPlaylist.length) return;

  currentIndex = index;
  showModal(localPlaylist[index]);

  if (btnNext) {
  btnNext.onclick = () => {
    if (currentIndex < localPlaylist.length - 1) {
      playTrack(currentIndex + 1);
    }
  };
}

if (btnPrev) {
  btnPrev.onclick = () => {
    if (currentIndex > 0) {
      playTrack(currentIndex - 1);
    }
  };
}



//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ B8 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔁 Reproducción continua contextual
  modalAudio.onended = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < localPlaylist.length) {
      playTrack(nextIndex);
    } else {
      currentIndex = -1;
      const icon = toggleBtn?.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
      }
      if (progressBar) progressBar.style.width = "0%";
    }
  };
}

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      // 'isModalActive' ya es global
      isModalActive = false; 
      closeBtn.click();
    }
  });

  document.addEventListener("keydown", (e) => {
    // 🛑 PREVENCIÓN DE COLISIÓN (Wrapped): Si Wrapped está activo, NO cierres el Modal Player.
    // 'isWrappedActive' ya es global y accesible
    if (isWrappedActive) return; 
   

    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      // 'isModalActive' ya es global
      isModalActive = false; 
      closeBtn.click();
    }
  });

  closeBtn.addEventListener("click", () => {
    // 'isModalActive' ya es global
    isModalActive = false; 
    modal.classList.add("hidden");
    modalAudio.pause();
    modalAudio.removeAttribute("src");
    currentIndex = -1;
    const icon = toggleBtn?.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }
    if (progressBar) progressBar.style.width = "0%";
  });

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
      loopToggle.textContent = `Loop: ${modalAudio.loop ? "On" : "Off"}`;
    });
  }

  if (muteToggle) {
    muteToggle.addEventListener("click", () => {
      modalAudio.muted = !modalAudio.muted;
      muteToggle.textContent = modalAudio.muted ? "Unmute" : "Mute";
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const icon = toggleBtn.querySelector("i");
      if (!icon) return;

      if (modalAudio.paused) {
        modalAudio.play().catch(err => {
          console.warn("⚠️ Error al reproducir:", err.name);
        });
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
      } else {
        modalAudio.pause();
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
      }
    });
  }

  modalAudio.addEventListener("timeupdate", () => {
    if (modalAudio.duration && progressBar) {
      const percent = (modalAudio.currentTime / modalAudio.duration) * 100;
      progressBar.style.width = `${percent}%`;
    }
  });

  if (progressContainer && progressBar) {
    progressContainer.addEventListener("click", (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = clickX / rect.width;
      modalAudio.currentTime = percent * modalAudio.duration;
      progressBar.style.width = `${percent * 100}%`;
    });
  }

  container.querySelectorAll(".card").forEach((card, index) => {
    const btn = card.querySelector(".btn-play");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const globalPlayer = document.getElementById("global-player");
      if (globalPlayer && !globalPlayer.paused) globalPlayer.pause();

      playTrack(index);

      if (modalQueue) {
        modalQueue.innerHTML = "";
        localPlaylist.forEach((track, i) => {
          const li = document.createElement("li");
          li.textContent = `${track.artista} – ${track.nombre}`;
          li.addEventListener("click", () => playTrack(i));
          modalQueue.appendChild(li);
        });
      }
    });
  });
}
