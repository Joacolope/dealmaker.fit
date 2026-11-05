// Base de datos propia del roadmap: cada registro es un JSON privado en Vercel Blob (store dealmaker-leads)
// roadmap/AAAA-MM-DD/<fecha ISO>-<id>.json · Variable de entorno: BLOB_READ_WRITE_TOKEN (la conecta Vercel)
const crypto = require('crypto');
const { put } = require('@vercel/blob');

// Nunca frena al formulario: si Blob tarda más de 4 s, se sigue sin guardar y queda en el log
async function guardarRegistro(registro) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { ok: false, motivo: 'falta BLOB_READ_WRITE_TOKEN' };
  const fecha = registro.fecha || new Date().toISOString();
  const ruta = 'roadmap/' + fecha.slice(0, 10) + '/' + fecha.replace(/[:.]/g, '-') + '-' + crypto.randomBytes(4).toString('hex') + '.json';
  try {
    await put(ruta, JSON.stringify(registro), {
      access: 'private', contentType: 'application/json', addRandomSuffix: false, abortSignal: AbortSignal.timeout(4000),
    });
    return { ok: true };
  } catch (e) {
    console.error('recurso: no se guardó el registro', e.message, registro.email);
    return { ok: false, motivo: e.message };
  }
}

module.exports = { guardarRegistro };
