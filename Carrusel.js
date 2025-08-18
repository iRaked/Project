let radius = 240;
let autoRotate = true;
let rotateSpeed = -20; // VELOCIDAD DE GIRO
let tX = 0, tY = 10;
let desX = 0, desY = 0;

const ospin = document.getElementById("spin-container");
const aImg = ospin.getElementsByTagName("img");
const aEle = [...aImg];

function init(delayTime) {
  for (let i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }

  // ✅ Posicionar la primera imagen al frente
  tX = 0;
  applyTransform();
}

function applyTransform() {
  if (tY > 180) tY = 180;
  if (tY < 0) tY = 0;
  ospin.style.transform = `translate(-50%, -50%) rotateX(${-tY}deg) rotateY(${tX}deg)`;
}

function playSpin(yes) {
  ospin.style.animationPlayState = yes ? "running" : "paused";
}

// ✅ Rotación automática controlada por JS
if (autoRotate) {
  (function rotate() {
    tX += rotateSpeed / 100;
    applyTransform();
    requestAnimationFrame(rotate);
  })();
}

document.onpointerdown = function (e) {
  clearInterval(ospin.timer);
  e = e || window.event;
  let sX = e.clientX;
  let sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    let nX = e.clientX;
    let nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTransform();
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function () {
    ospin.timer = setInterval(() => {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTransform();
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(ospin.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function (e) {
  e = e || window.event;
  const d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};

// ✅ Inicialización con corrección de posición
setTimeout(() => init(), 100);

// ✅ Glow al clic
aEle.forEach(img => {
  img.addEventListener('click', () => {
    aEle.forEach(i => i.classList.remove('clicked'));
    img.classList.add('clicked');
  });
});
// Evitar Bloqueo AutoPlay
document.addEventListener('click', () => {
  const audio = new Audio('assets/song/Las%20cosas%20m%C3%A1s%20bonitas.mp3" type="audio/mpeg');
  audio.play();
}, { once: true });