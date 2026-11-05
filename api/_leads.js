// Base de datos propia del roadmap: cada registro va a Neon (tabla roadmap_registros, ver docs/neon-roadmap.sql)
// y, como respaldo, un JSON privado en Vercel Blob (store dealmaker-leads).
// Variables de entorno: DATABASE_URL y BLOB_READ_WRITE_TOKEN (las conecta Vercel)
const crypto = require('crypto');
const { neon } = require('@neondatabase/serverless');
const { put } = require('@vercel/blob');

// Columnas de la tabla; todo el registro también queda entero en "datos"
const COLUMNAS = ['fecha', 'califica', 'etapa', 'etapa_nombre', 'nombre', 'email', 'telefono', 'instagram', 'pais', 'codigo_pais',
  'zona_horaria', 'ejerce', 'profesion', 'facturacion', 'bottleneck', 'ejerce_texto', 'profesion_texto', 'facturacion_texto',
  'bottleneck_texto', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'fbc', 'fbp',
  'ip', 'user_agent', 'event_id', 'pagina', 'roadmap_url', 'prueba'];

// Nunca frena al formulario: cada destino tiene 4 s de tope; si falla, queda en el log
async function guardarRegistro(registro) {
  const [base, blob] = await Promise.all([guardarNeon(registro), guardarBlob(registro)]);
  if (!base.ok) console.error('recurso: Neon no guardó el registro', base.motivo, registro.email);
  if (!blob.ok) console.error('recurso: Blob no guardó el registro', blob.motivo, registro.email);
  return { ok: base.ok, motivo: base.motivo, respaldo: blob.ok || blob.motivo };
}

async function guardarNeon(registro) {
  if (!process.env.DATABASE_URL) return { ok: false, motivo: 'falta DATABASE_URL' };
  const columnas = COLUMNAS.filter(c => registro[c] !== undefined && registro[c] !== '');
  const valores = columnas.map(c => registro[c]);
  columnas.push('envio_ghl', 'envio_capi', 'datos');
  valores.push(String(registro.envio.ghl), String(registro.envio.capi), JSON.stringify(registro));
  const texto = 'insert into roadmap_registros (' + columnas.join(', ') + ') values (' + valores.map((_, k) => '$' + (k + 1)).join(', ') + ')';
  let timer;
  try {
    await Promise.race([
      neon(process.env.DATABASE_URL).query(texto, valores),
      new Promise((_, no) => { timer = setTimeout(() => no(new Error('Neon tardó más de 4 s')), 4000); }),
    ]);
    return { ok: true };
  } catch (e) {
    return { ok: false, motivo: e.message };
  } finally {
    clearTimeout(timer);
  }
}

async function guardarBlob(registro) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { ok: false, motivo: 'falta BLOB_READ_WRITE_TOKEN' };
  const fecha = registro.fecha || new Date().toISOString();
  const ruta = 'roadmap/' + fecha.slice(0, 10) + '/' + fecha.replace(/[:.]/g, '-') + '-' + crypto.randomBytes(4).toString('hex') + '.json';
  try {
    await put(ruta, JSON.stringify(registro), {
      access: 'private', contentType: 'application/json', addRandomSuffix: false, abortSignal: AbortSignal.timeout(4000),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, motivo: e.message };
  }
}

module.exports = { guardarRegistro };
