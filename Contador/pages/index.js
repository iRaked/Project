import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    (async () => {
      try {
        const geo = await fetch('https://ipapi.co/json/').then(res => res.json());
        const ip = geo.ip;
        const pais = geo.country_name;
        const bandera = geo.country_code;
        const fecha = new Date().toISOString();

        await fetch('/api/registrar-visita', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip, pais, bandera, fecha })
        });

        // 🎉 Confetti visual
        const confetti = document.createElement('div');
        confetti.innerText = '🎉 ¡Nueva visita desde ' + pais + '!';
        confetti.style.position = 'fixed';
        confetti.style.top = '20px';
        confetti.style.left = '50%';
        confetti.style.transform = 'translateX(-50%)';
        confetti.style.background = '#00AAFF';
        confetti.style.color = '#fff';
        confetti.style.padding = '10px 20px';
        confetti.style.borderRadius = '8px';
        confetti.style.boxShadow = '0 0 10px #00FFFF';
        confetti.style.zIndex = '9999';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
      } catch (err) {
        console.error('Error al registrar visita:', err);
      }
    })();
  }, []);

  return (
    <div className="contador-wrapper">
      <div className="contador-panel">
        <h3 className="contador-titulo">🌍 Visitas Globales</h3>
        <img src="" alt="Bandera" className="contador-img" />
      </div>
    </div>
  );
}