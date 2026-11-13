// POST /api/recurso — registro del Roadmap DealMaker FIT (plan.dealmakerconsulting.com)
// Califica en el servidor; solo si califica manda el lead a GHL y, en paralelo, el Lead a Meta por CAPI desde acá.
// Todos los registros (califiquen o no) quedan en la base propia (Neon + respaldo en Vercel Blob, ver _leads.js).
// Variables de entorno: GHL_WEBHOOK_URL, META_CAPI_TOKEN, DATABASE_URL, BLOB_READ_WRITE_TOKEN, META_PIXEL_ID (opc.), META_TEST_EVENT_CODE (opc.)
const { enviarLead, idDeRespaldo } = require('./_meta-capi');
const { guardarRegistro } = require('./_leads');

const RECURSO = 'roadmap-dealmaker-fit';
const SITIO_PLAN = 'https://plan.dealmakerconsulting.com';

// Valores permitidos de cada pregunta: valor → texto de la opción, que va a GHL como <campo>_texto
const EJERCE = { si: 'Sí, ya tengo clientes', no: 'Todavía no' };
const PROFESION = {
  online: 'Coach Fitness / Entrenador online',
  nutricionista: 'Nutricionista',
  entrenador: 'Entrenador / Coach Presencial',
  otro: 'Otro',
  // Opciones anteriores: las acepta por si alguien tenía la página vieja abierta
  kinesiologo: 'Kinesiólogo/a',
  osteopata: 'Osteópata',
};
const FACTURACION = {
  'menos-1000': 'Menos de $1k',
  '1000-2000': 'Entre $1k y $2k',
  '2000-3000': 'Entre $2k y $3k',
  '3000-4000': 'Entre $3k y $4k',
  '4000-5000': 'Entre $4k y $5k',
  'mas-5000': 'Más de $5k',
  // Rangos anteriores: los acepta por si alguien tenía la página vieja abierta
  '1000-3000': 'Entre $1k y $3k',
  '3000-5000': 'Entre $3k y $5k',
};
// Principal desafío (paso 5). Se sigue llamando "bottleneck" en GHL y en la base.
const BOTTLENECK = {
  clientes: 'Necesito más clientes',
  contenido: 'No sé qué contenido subir para atraer clientes',
  convertir: 'Tengo seguidores, pero no se convierten en clientes',
  precios: 'Cobro poco por lo que hago',
  tiempo: 'No me da el tiempo, todo depende de mí',
  // Opciones anteriores: las acepta por si alguien tenía la página vieja abierta
  diferenciacion: 'Diferenciarme en mi mercado',
  leads: 'No tengo suficientes leads',
  calificados: 'Tengo leads pero no son calificados',
  conversion: 'Convertir mejor a los leads que ya genero',
  escalar: 'Escalar sin depender de mí',
};

// La etapa sale solo del rango de facturación
const ETAPA = {
  'menos-1000': 1, '1000-2000': 2, '2000-3000': 2, '3000-4000': 3, '4000-5000': 3, 'mas-5000': 4,
  '1000-3000': 2, '3000-5000': 3,
};
const SLUG = [null, 'tecnico', 'crecimiento', 'emprendedor', 'empresario'];
const NOMBRE = [null, 'Coach Técnico', 'Coach en Crecimiento', 'Coach Emprendedor', 'Coach Empresario'];

const texto = (v, max) => String(v == null ? '' : v).trim().slice(0, max || 200);
const permitido = (lista, v) => Object.prototype.hasOwnProperty.call(lista, v);

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
    // Cuello de botella: se guarda en GHL, no va a Meta
    bottleneck: texto(b.bottleneck, 20),
    utm_source: texto(b.utm_source), utm_medium: texto(b.utm_medium), utm_campaign: texto(b.utm_campaign),
    utm_content: texto(b.utm_content), utm_term: texto(b.utm_term), utm_id: texto(b.utm_id),
    fbclid: texto(b.fbclid, 300), pagina: texto(b.pagina, 500),
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !d.nombre || !d.telefono ||
      !permitido(EJERCE, d.ejerce) || !permitido(PROFESION, d.profesion) || !permitido(FACTURACION, d.facturacion) ||
      !permitido(BOTTLENECK, d.bottleneck) ||
      (d.instagram && !/^[a-z0-9._]{1,30}$/.test(d.instagram))) {
    return res.status(400).json({ ok: false, error: 'Datos incompletos o inválidos' });
  }

  // Califica el que factura $1k o más al mes, sea cual sea su profesión ("Otro" también, desde el 2026-11-11). El desafío no califica ni descalifica.
  // La etapa no cambia por un "no": sale solo de la facturación. Si no trabaja con clientes, no factura.
  if (d.ejerce === 'no') d.facturacion = 'menos-1000';
  d.ejerce_texto = EJERCE[d.ejerce];
  d.profesion_texto = PROFESION[d.profesion];
  d.facturacion_texto = FACTURACION[d.facturacion];
  d.bottleneck_texto = BOTTLENECK[d.bottleneck];
  const califica = d.facturacion !== 'menos-1000';
  const etapa = ETAPA[d.facturacion];
  const url = SITIO_PLAN + '/roadmap/' + SLUG[etapa] + '?c=' + d.facturacion;
  const prueba = email.endsWith('@resend.dev') || d.utm_source === 'prueba-tecnica';
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const fbp = texto(b.fbp, 200);
  const fbc = texto(b.fbc, 300) || (d.fbclid ? 'fb.1.' + Date.now() + '.' + d.fbclid : '');
  const extra = {
    recurso: RECURSO, califica, etapa, etapa_nombre: NOMBRE[etapa], roadmap_url: url,
    fbp, fbc, ip, user_agent: texto(req.headers['user-agent'], 400), event_id: idDeRespaldo(email, RECURSO),
    prueba, consentimiento: true, fecha: new Date().toISOString(),
  };

  // 1. GoHighLevel (Inbound Webhook): solo los que califican. El que no califica recibe su roadmap y no se guarda.
  // GHL guarda el contacto; el Lead a Meta ya no sale de su workflow, sale de acá (paso 2).
  const pedidoGHL = califica
    ? enviarGHL({ ...d, ...extra })
    : Promise.resolve({ ok: false, motivo: 'no se manda (no califica)' });

  // 2. Lead por CAPI: solo si califica, aunque GHL falle o tarde
  let pedidoCAPI = Promise.resolve('no corresponde (no califica)');
  if (califica) {
    const testEventCode = email.endsWith('@resend.dev') ? texto(b.test_event_code || process.env.META_TEST_EVENT_CODE, 40) : '';
    if (!prueba || testEventCode) {
      pedidoCAPI = enviarLead({
        email, nombre: d.nombre, telefono: d.telefono, pais: d.pais, recurso: RECURSO,
        fbp, fbc, fbclid: d.fbclid, pagina: d.pagina,
        ip, userAgent: req.headers['user-agent'],
        testEventCode,
        custom: { recurso: RECURSO, califica, etapa, ejerce: d.ejerce, profesion: d.profesion, facturacion: d.facturacion },
      }).then(r => {
        if (!r.ok) console.error('recurso: Meta no recibió el Lead', r.motivo, email);
        return r.ok ? (r.prueba ? 'prueba' : true) : r.motivo;
      });
    } else {
      pedidoCAPI = Promise.resolve('no se manda (prueba sin test_event_code)');
    }
  }
  const [ghl, capi] = await Promise.all([pedidoGHL, pedidoCAPI]);
  if (califica && !ghl.ok) console.error('recurso: GHL no recibió el lead', ghl.motivo, email);

  // 3. Base propia: se guarda todo, con lo que respondieron GHL y Meta
  const base = await guardarRegistro({ ...d, ...extra, envio: { ghl: ghl.ok || ghl.motivo, capi } });

  return res.status(200).json({
    ok: true, califica, etapa, url,
    guardado: { ghl: ghl.ok || ghl.motivo, base: base.ok || base.motivo, respaldo: base.respaldo, mail: 'no se manda', capi, califica, etapa },
  });
};

// GHL a veces tarda: cada intento tiene su tope (5 s y 3 s) para que el lead nunca se quede esperando.
// Si GHL no responde, igual se le contesta al formulario y el calificado sigue a WhatsApp.
async function enviarGHL(datos) {
  const destino = process.env.GHL_WEBHOOK_URL;
  if (!destino) return { ok: false, motivo: 'falta GHL_WEBHOOK_URL' };
  const TOPES = [5000, 3000];
  let motivo = 'sin respuesta';
  for (let intento = 0; intento < TOPES.length; intento++) {
    const control = new AbortController();
    const timer = setTimeout(() => control.abort(), TOPES[intento]);
    const inicio = Date.now();
    try {
      const r = await fetch(destino, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
        signal: control.signal,
      });
      console.log('recurso: GHL respondió', r.status, 'en', Date.now() - inicio, 'ms');
      if (r.ok) return { ok: true };
      motivo = 'HTTP ' + r.status;
    } catch (e) {
      motivo = e.name === 'AbortError' ? 'GHL tardó más de ' + TOPES[intento] / 1000 + ' s' : e.message;
      console.error('recurso: GHL intento', intento + 1, motivo);
    } finally {
      clearTimeout(timer);
    }
  }
  return { ok: false, motivo };
}
