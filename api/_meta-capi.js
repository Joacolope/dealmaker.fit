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
  if (d.nombre) user.fn = [sha256(d.nombre.split(/\s+/)[0])];
  if (d.telefono) user.ph = [sha256(d.telefono.replace(/\D/g, ''))];
  if (d.pais) user.country = [sha256(d.pais)];

  const cuerpo = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: idDeRespaldo(d.email, d.recurso),
      action_source: 'website',
      event_source_url: d.pagina || undefined,
      user_data: user,
      custom_data: d.custom || {},
    }],
  };
  if (d.testEventCode) cuerpo.test_event_code = d.testEventCode;

  try {
    const r = await fetch('https://graph.facebook.com/v21.0/' + pixel + '/events?access_token=' + encodeURIComponent(token), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, motivo: (j.error && j.error.message) || 'HTTP ' + r.status };
    return { ok: true, recibidos: j.events_received, prueba: !!d.testEventCode };
  } catch (e) {
    return { ok: false, motivo: e.message };
  }
}

module.exports = { enviarLead, idDeRespaldo };
