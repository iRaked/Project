async function detectarPais() {
  try {
    const res = await fetch('https://ip-api.com/json');
    const data = await res.json();
    return data.countryCode?.toLowerCase() || 'xx';
  } catch (error) {
    console.warn('Error al detectar país:', error);
    return 'xx';
  }
}

function banderaExistente(codigo) {
  const ruta = `assets/flags/${codigo}.png`;
  return fetch(ruta)
    .then(res => res.ok ? ruta : 'assets/flags/xx.png')
    .catch(() => 'assets/flags/xx.png');
}

async function obtenerVisitas() {
  try {
    const res = await fetch('/api/obtener-visitas'); // Asegúrate que esta ruta existe y responde con { total: N }
    const data = await res.json();
    return data.total || 0;
  } catch (error) {
    console.warn('Error al obtener visitas:', error);
    return 0;
  }
}

async function renderContador() {
  const codigo = await detectarPais();
  const bandera = await banderaExistente(codigo);
  const visitas = await obtenerVisitas();

  document.getElementById('bandera').src = bandera;
  document.getElementById('bandera').className = bandera.includes('xx') ? 'bandera fallback' : 'bandera';
  document.getElementById('codigo').textContent = `Código detectado: ${codigo}`;
  document.querySelector('.visitas').textContent = `${visitas} visitas`;
}

// Ejecutar al cargar
renderContador();
