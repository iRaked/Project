async function detectarPais() {
  const res = await fetch('https://ip-api.com/json');
  const data = await res.json();
  return data.countryCode.toLowerCase(); // 'mx', 'us', etc.
}

function banderaExistente(codigo) {
  const ruta = `assets/flags/${codigo}.png`;
  return fetch(ruta).then(res => res.ok ? ruta : 'assets/flags/xx.png');
}

async function renderContador() {
  const codigo = await detectarPais();
  const bandera = await banderaExistente(codigo);

  document.getElementById('bandera').src = bandera;
  document.getElementById('bandera').className = bandera.includes('xx') ? 'bandera fallback' : 'bandera';
  document.getElementById('codigo').textContent = `Código detectado: ${codigo}`;
}