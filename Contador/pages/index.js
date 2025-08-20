import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Home() {
  const [visitas, setVisitas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const mostrarVisitas = async () => {
      const { data, error } = await supabase
        .from('visitas_globales')
        .select('ip, pais, fecha')
        .order('fecha', { ascending: false });

      if (error) {
        console.error('🔴 Error al obtener visitas:', error);
        setError('No se pudieron cargar las visitas');
        return;
      }

      setVisitas(data ?? []);
    };

    mostrarVisitas();
  }, []);

  return (
    <div className="contador-wrapper">
      <div className="contador-panel">
        <h3 className="contador-titulo">🌍 Visitas Globales</h3>

        {error && (
          <p className="contador-error">⚠️ {error}</p>
        )}

        {!error && visitas.length === 0 && (
          <p className="contador-vacio">No hay visitas registradas aún.</p>
        )}

        {visitas.slice(0, 5).map(({ ip, pais, fecha }, index) => (
          <div key={index} className="visita-item">
            🌐 <strong>{pais?.toUpperCase() || 'XX'}</strong> ({ip}) —{' '}
            {fecha
              ? new Date(fecha).toLocaleString('es-MX', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })
              : 'Fecha desconocida'}
          </div>
        ))}
      </div>
    </div>
  );
}
