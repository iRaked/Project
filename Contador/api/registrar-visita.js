import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://TU_PROYECTO.supabase.co',       // Reemplaza con tu URL
  'TU_SERVICE_ROLE_KEY'                    // Usa la clave secreta (no la pública)
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { ip, pais, bandera, fecha } = req.body;

  // Verificar si ya existe la IP
  const { data: existente } = await supabase
    .from('visitas_globales')
    .select('ip')
    .eq('ip', ip)
    .single();

  if (existente) return res.status(200).json({ mensaje: 'IP ya registrada' });

  const { error } = await supabase
    .from('visitas_globales')
    .insert([{ ip, pais, bandera, fecha }]);

  if (error) return res.status(500).json({ error });

  res.status(200).json({ mensaje: 'Visita registrada con éxito' });
}