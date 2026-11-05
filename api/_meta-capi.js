// Meta Conversions API: evento Lead desde el servidor (nunca desde el navegador)
// Variables de entorno: META_CAPI_TOKEN (obligatoria), META_PIXEL_ID (opcional), META_TEST_EVENT_CODE (opcional)
const crypto = require('crypto');

const PIXEL_POR_DEFECTO = '1034841362227406';

function sha256(valor) {
  return crypto.createHash('sha256').update(String(valor).trim().toLowerCase()).digest('hex');
}

// Mismo email + mismo recurso = mismo eventId: Meta descarta el duplicado
function idDeRespaldo(email, recurso) {
  return sha256(recurso + ':' + email).slice(0, 40);
}

async function enviarLead(d) {
  const token = process.env.META_CAPI_TOKEN;
  const pixel = process.env.META_PIXEL_ID || PIXEL_POR_DEFECTO;
  if (!token) return { ok: false, motivo: 'falta META_CAPI_TOKEN' };

  const user = {
    em: [sha256(d.email)],
    external_id: [sha256(d.email)],
    client_ip_address: d.ip || undefined,
    client_user_agent: d.userAgent || undefined,
    fbp: d.fbp || undefined,
    fbc: d.fbc || (d.fbclid ? 'fb.1.' + Date.now() + '.' + d.fbclid : undefined),
  };
  if (d.nombre) {
    const partes = d.nombre.trim().split(/\s+/);
    user.fn = [sha256(partes[0])];
    if (partes.length > 1) user.ln = [sha256(partes[partes.length - 1])];
  }
  if (d.telefono) user.ph = telefonos(d.telefono).map(sha256);
  if (d.pais) user.country = [sha256(d.pais)];

  const cuerpo = {
    data: [{
      event_name: 'Lead',
      event_time: d.eventTime || Math.floor(Date.now() / 1000),
      event_id: idDeRespaldo(d.email, d.recurso),
      action_source: 'website',
      event_source_url: d.pagina || undefined,
      user_data: user,
      custom_data: d.custom || {},
    }],
  };
  if (d.testEventCode) cuerpo.test_event_code = d.testEventCode;

  // Dos intentos (6 s y 4 s): se reintenta si Meta no responde o da error de su lado (5xx o 429).
  // Un error de datos (4xx) no se reintenta. Si igual falla, el reintento diario (api/reintentar-meta.js) lo vuelve a mandar.
  const TOPES = [6000, 4000];
  let motivo = 'sin respuesta';
  for (let intento = 0; intento < TOPES.length; intento++) {
    try {
      const r = await fetch('https://graph.facebook.com/v24.0/' + pixel + '/events?access_token=' + encodeURIComponent(token), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo),
        signal: AbortSignal.timeout(TOPES[intento]),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) return { ok: true, recibidos: j.events_received, prueba: !!d.testEventCode };
      motivo = (j.error && j.error.message) || 'HTTP ' + r.status;
      if (r.status < 500 && r.status !== 429) break;
    } catch (e) {
      motivo = e.name === 'TimeoutError' ? 'Meta tardó más de ' + TOPES[intento] / 1000 + ' s' : e.message;
    }
    console.error('meta-capi: intento', intento + 1, motivo);
  }
  return { ok: false, motivo };
}

// Teléfono en formato internacional sin "+". Argentina: va con y sin el 9 de celular, así Meta lo encuentra como lo tenga.
function telefonos(t) {
  let d = String(t).replace(/\D/g, '');
  if (!d.startsWith('54')) return [d];
  d = d.slice(2);
  if (d.startsWith('54') && d.length > 11) d = d.slice(2);   // cargó el código de país dos veces
  d = d.replace(/^9/, '').replace(/^0/, '');
  return ['54' + d, '549' + d];
}

module.exports = { enviarLead, idDeRespaldo };
