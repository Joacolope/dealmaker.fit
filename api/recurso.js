// POST /api/recurso — registro del Roadmap DealMaker FIT (plan.dealmakerconsulting.com)
// Califica en el servidor, manda el lead a GHL y dispara el Lead por CAPI (solo si califica).
// Variables de entorno: GHL_WEBHOOK_URL, META_CAPI_TOKEN, META_PIXEL_ID (opc.), META_TEST_EVENT_CODE (opc.)
const { enviarLead } = require('./_meta-capi');

const RECURSO = 'roadmap-dealmaker-fit';
const SITIO_PLAN = 'https://plan.dealmakerconsulting.com';

// Valores permitidos de cada pregunta
const EJERCE = ['si', 'no'];
const PROFESION = ['entrenador', 'nutricionista', 'kinesiologo', 'osteopata', 'otro'];
const FACTURACION = ['menos-1000', '1000-3000', '3000-5000', 'mas-5000'];

// La etapa sale solo del rango de facturación
const ETAPA = { 'menos-1000': 1, '1000-3000': 2, '3000-5000': 3, 'mas-5000': 4 };
const SLUG = [null, 'tecnico', 'crecimiento', 'emprendedor', 'empresario'];
const NOMBRE = [null, 'Profesional Técnico', 'Profesional en Crecimiento', 'Profesional Emprendedor', 'Profesional Empresario'];

const texto = (v, max) => String(v == null ? '' : v).trim().slice(0, max || 200);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Método no permitido' });
  }

  let b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }

  // Honeypot: si un bot llenó el campo oculto, se responde ok y no se hace nada
  if (b.website) return res.status(200).json({ ok: true });

  const email = texto(b.email, 160).toLowerCase();
  const d = {
    nombre: texto(b.nombre, 80),
    email,
    instagram: texto(b.instagram, 30).replace(/^@/, '').toLowerCase(),
    telefono: texto(b.telefono, 30),
    pais: texto(b.pais, 2).toUpperCase(),
    codigo_pais: texto(b.codigo_pais, 6),
    zona_horaria: texto(b.zona_horaria, 60),
    ejerce: texto(b.ejerce, 10),
    profesion: texto(b.profesion, 20),
    facturacion: texto(b.facturacion, 20),
    utm_source: texto(b.utm_source), utm_medium: texto(b.utm_medium), utm_campaign: texto(b.utm_campaign),
    utm_content: texto(b.utm_content), fbclid: texto(b.fbclid, 300), pagina: texto(b.pagina, 500),
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !d.nombre || !d.telefono ||
      !EJERCE.includes(d.ejerce) || !PROFESION.includes(d.profesion) || !FACTURACION.includes(d.facturacion) ||
      (d.instagram && !/^[a-z0-9._]{1,30}$/.test(d.instagram))) {
    return res.status(400).json({ ok: false, error: 'Datos incompletos o inválidos' });
  }

  // Un solo fallo descalifica. La etapa no cambia por un "no".
  const califica = d.ejerce === 'si' && d.profesion !== 'otro' && d.facturacion !== 'menos-1000';
  const etapa = ETAPA[d.facturacion];
  const url = SITIO_PLAN + '/roadmap/' + SLUG[etapa] + '?c=' + d.facturacion;
  const prueba = email.endsWith('@resend.dev') || d.utm_source === 'prueba-tecnica';

  // 1. GoHighLevel (Inbound Webhook): ahí queda guardado el lead
  const ghl = await enviarGHL({
    ...d, recurso: RECURSO, califica, etapa, etapa_nombre: NOMBRE[etapa], roadmap_url: url,
    prueba, consentimiento: true, fecha: new Date().toISOString(),
  });

  // 2. Lead por CAPI: solo si califica y el lead quedó guardado
  let capi = false;
  if (califica && ghl.ok) {
    const testEventCode = email.endsWith('@resend.dev') ? texto(b.test_event_code || process.env.META_TEST_EVENT_CODE, 40) : '';
    if (!prueba || testEventCode) {
      const r = await enviarLead({
        email, nombre: d.nombre, telefono: d.telefono, pais: d.pais, recurso: RECURSO,
        fbp: texto(b.fbp, 200), fbc: texto(b.fbc, 300), fbclid: d.fbclid, pagina: d.pagina,
        ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim(), userAgent: req.headers['user-agent'],
        testEventCode,
        custom: { recurso: RECURSO, califica, etapa, ejerce: d.ejerce, profesion: d.profesion, facturacion: d.facturacion },
      });
      capi = r.ok ? (r.prueba ? 'prueba' : true) : r.motivo;
    } else {
      capi = 'no se manda (prueba sin test_event_code)';
    }
  }
  if (!ghl.ok) console.error('recurso: GHL no recibió el lead', ghl.motivo, email);

  return res.status(200).json({
    ok: true, califica, etapa, url,
    guardado: { ghl: ghl.ok || ghl.motivo, mail: 'no se manda', capi: califica ? capi : 'no corresponde (no califica)', califica, etapa },
  });
};

async function enviarGHL(datos) {
  const destino = process.env.GHL_WEBHOOK_URL;
  if (!destino) return { ok: false, motivo: 'falta GHL_WEBHOOK_URL' };
  for (let intento = 1; intento <= 2; intento++) {
    try {
      const r = await fetch(destino, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      if (r.ok) return { ok: true };
      if (intento === 2) return { ok: false, motivo: 'HTTP ' + r.status };
    } catch (e) {
      if (intento === 2) return { ok: false, motivo: e.message };
    }
  }
  return { ok: false, motivo: 'sin respuesta' };
}
