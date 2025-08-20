import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const { count, error } = await supabase
      .from('visitas_globales')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('🔴 Error al contar visitas:', error);
      return res.status(500).json({ error: 'No se pudo obtener el total' });
    }

    res.status(200).json({ total: count });
  } catch (err) {
    console.error('🔴 Error general en el contador:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
