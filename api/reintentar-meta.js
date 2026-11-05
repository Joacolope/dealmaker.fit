// GET /api/reintentar-meta — lo llama el cron de Vercel una vez por día (vercel.json)
// Vuelve a mandar a Meta el Lead de los calificados cuyo envío falló, mientras Meta lo acepte (7 días).
// Mismo event_id que el envío original: si en realidad había llegado, Meta descarta el repetido.
// Variables de entorno: CRON_SECRET, DATABASE_URL, META_CAPI_TOKEN
const { neon } = require('@neondatabase/serverless');
const { enviarLead } = require('./_meta-capi');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!process.env.CRON_SECRET || req.headers.authorization !== 'Bearer ' + process.env.CRON_SECRET) {
    return res.status(401).json({ ok: false });
  }
  if (!process.env.DATABASE_URL) return res.status(500).json({ ok: false, error: 'falta DATABASE_URL' });

  const sql = neon(process.env.DATABASE_URL);
  const pendientes = await sql.query(
    `select * from roadmap_registros
     where califica and not prueba and email is not null
       and envio_capi is distinct from 'true' and envio_capi not like 'true%' and envio_capi not like 'reenviado%'
       and coalesce(fecha, creado) > now() - interval '6 days 20 hours'
     order by id limit 200`);

  const resultado = [];
  for (const r of pendientes) {
    const fecha = new Date(r.fecha || r.creado);
    const envio = await enviarLead({
      email: r.email, nombre: r.nombre, telefono: r.telefono, pais: r.pais, recurso: r.datos && r.datos.recurso || 'roadmap-dealmaker-fit',
      fbp: r.fbp, fbc: r.fbc, fbclid: r.fbclid, pagina: r.pagina, ip: r.ip, userAgent: r.user_agent,
      eventTime: Math.floor(fecha / 1000),
      custom: { recurso: 'roadmap-dealmaker-fit', califica: true, etapa: r.etapa, ejerce: r.ejerce, profesion: r.profesion, facturacion: r.facturacion },
    });
    const estado = envio.ok ? 'true (reintento ' + new Date().toISOString().slice(0, 10) + ')' : r.envio_capi + ' · reintento falló: ' + envio.motivo;
    await sql.query('update roadmap_registros set envio_capi = $1 where id = $2', [estado.slice(0, 500), r.id]);
    if (!envio.ok) console.error('reintentar-meta: falló', r.id, envio.motivo);
    resultado.push({ id: r.id, ok: envio.ok });
  }
  console.log('reintentar-meta:', resultado.length, 'pendientes,', resultado.filter(x => x.ok).length, 'enviados');
  return res.status(200).json({ ok: true, pendientes: resultado.length, enviados: resultado.filter(x => x.ok).length });
};
