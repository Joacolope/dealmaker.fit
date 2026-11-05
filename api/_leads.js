// Base de datos propia del roadmap: cada registro va a Supabase (tabla roadmap_registros, ver docs/supabase-roadmap.sql)
// y, como respaldo, un JSON privado en Vercel Blob (store dealmaker-leads).
// Variables de entorno: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BLOB_READ_WRITE_TOKEN (la conecta Vercel)
const crypto = require('crypto');
const { put } = require('@vercel/blob');

// Columnas de la tabla; todo el registro también queda entero en "datos"
const COLUMNAS = ['fecha', 'califica', 'etapa', 'etapa_nombre', 'nombre', 'email', 'telefono', 'instagram', 'pais', 'codigo_pais',
  'zona_horaria', 'ejerce', 'profesion', 'facturacion', 'bottleneck', 'ejerce_texto', 'profesion_texto', 'facturacion_texto',
  'bottleneck_texto', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'fbc', 'fbp',
  'ip', 'user_agent', 'event_id', 'pagina', 'roadmap_url', 'prueba'];

// Nunca frena al formulario: cada destino tiene 4 s de tope; si falla, queda en el log
async function guardarRegistro(registro) {
  const [supabase, blob] = await Promise.all([guardarSupabase(registro), guardarBlob(registro)]);
  if (!supabase.ok) console.error('recurso: Supabase no guardó el registro', supabase.motivo, registro.email);
  if (!blob.ok) console.error('recurso: Blob no guardó el registro', blob.motivo, registro.email);
  return { ok: supabase.ok, motivo: supabase.motivo, respaldo: blob.ok || blob.motivo };
}

async function guardarSupabase(registro) {
  const url = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !clave) return { ok: false, motivo: 'falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY' };
  const fila = { datos: registro, envio_ghl: String(registro.envio.ghl), envio_capi: String(registro.envio.capi) };
  for (const c of COLUMNAS) if (registro[c] !== undefined && registro[c] !== '') fila[c] = registro[c];
  const headers = { apikey: clave, 'Content-Type': 'application/json', Prefer: 'return=minimal' };
  // Las claves viejas (JWT) también van en Authorization; las nuevas (sb_secret_) solo en apikey
  if (clave.startsWith('eyJ')) headers.Authorization = 'Bearer ' + clave;
  try {
    const r = await fetch(url.replace(/\/$/, '') + '/rest/v1/roadmap_registros', {
      method: 'POST', headers, body: JSON.stringify(fila), signal: AbortSignal.timeout(4000),
    });
    return r.ok ? { ok: true } : { ok: false, motivo: 'HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200) };
  } catch (e) {
    return { ok: false, motivo: e.message };
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
