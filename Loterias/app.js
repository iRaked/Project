window.addEventListener('DOMContentLoaded', () => {
  // 🖼️ Modal de imagen ampliada
  const modal = document.getElementById("modal-imagen");
  const imagenAmpliada = document.getElementById("imagen-ampliada");
  const cerrar = document.querySelector(".cerrar-modal");

  cerrar.addEventListener("click", () => modal.style.display = "none");

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("mostrar");
      modal.style.display = "none";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && getComputedStyle(modal).display !== "none") {
      modal.classList.remove("mostrar");
      modal.style.display = "none";
    }
  });

  // 🖼️ Activar modal al hacer clic en cualquier imagen
  const imagenes = document.querySelectorAll('.pelicula img');
  imagenes.forEach(img => {
    img.addEventListener("click", () => {
      imagenAmpliada.src = img.src;
      modal.classList.add("mostrar");
      modal.style.display = "flex";
    });
  });

  // 🎞️ Carruseles múltiples
  document.querySelectorAll('.catalogo--peliculas').forEach(seccion => {
    const contenedor = seccion.querySelector('.contenedor-principal');
    const izquierda = contenedor.querySelector('.flecha-izquierda');
    const derecha = contenedor.querySelector('.flecha-derecha');
    const carousel = contenedor.querySelector('.carousel');

    let posicion = 0;
    const itemWidth = carousel.querySelector('.pelicula').offsetWidth + 10;
    const visibleItems = Math.floor(carousel.parentElement.offsetWidth / itemWidth);
    const totalItems = carousel.children.length;
    const maxPosicion = Math.max(0, totalItems - visibleItems);

    const actualizarTransform = () => {
      carousel.style.transform = `translateX(-${posicion * itemWidth}px)`;
    };

    izquierda.addEventListener('click', () => {
      if (posicion > 0) {
        posicion--;
        actualizarTransform();
      }
    });

    derecha.addEventListener('click', () => {
      if (posicion < maxPosicion) {
        posicion++;
        actualizarTransform();
      }
    });

    // 🐞 Debug opcional por sección
    console.log(`Sección: ${seccion.classList[1]}`);
    console.log({ posicion, itemWidth, visibleItems, totalItems, maxPosicion });
  });
    // MODAL BOTON INFO
const botonInfo = document.querySelector('.imagotipo--info p:nth-child(2)');
const modalInfo = document.getElementById('modal-info');
const cerrarInfo = document.querySelector('.cerrar-info');

botonInfo.addEventListener('click', () => {
  modalInfo.style.display = 'flex';
});

cerrarInfo.addEventListener('click', () => {
  modalInfo.style.display = 'none';
});

modalInfo.addEventListener('click', (e) => {
  if (e.target === modalInfo) {
    modalInfo.style.display = 'none';
  }
});
});