// Reenvía a Meta (CAPI) el evento Lead de calificados que no llegaron, desde un CSV exportado de GHL.
// Uso:  META_CAPI_TOKEN=... node herramientas/reenviar-leads-meta.js leads.csv [--probar] [--test CODIGO]
//   --probar       muestra qué se mandaría, sin mandar nada
//   --test CODIGO  manda en modo prueba (cae en "Probar eventos" de Meta, no cuenta como conversión)
// Meta solo acepta eventos de sitio web de los últimos 7 días: los más viejos se saltean.
// El event_id es el mismo que usa /api/recurso, así Meta descarta el repetido si llegó en las últimas 48 h.
const fs = require('fs');
const { enviarLead } = require('../api/_meta-capi');

const RECURSO = 'roadmap-dealmaker-fit';
const SIETE_DIAS = 7 * 24 * 3600 * 1000;

// Columnas posibles en el export de GHL (en inglés o castellano, o los campos del webhook)
const COLUMNAS = {
  email: ['email', 'correo', 'correo electrónico'],
  telefono: ['phone', 'teléfono', 'telefono', 'whatsapp'],
  nombre: ['nombre', 'full name', 'name', 'first name', 'nombre completo'],
  apellido: ['last name', 'apellido'],
  pais: ['pais', 'país', 'country'],
  fecha: ['fecha', 'date created', 'created', 'fecha de creación', 'date added'],
  fbc: ['fbc'], fbp: ['fbp'], fbclid: ['fbclid'], ip: ['ip'], user_agent: ['user_agent', 'user agent'],
  pagina: ['pagina', 'página'], etapa: ['etapa'], profesion: ['profesion', 'profesión'], facturacion: ['facturacion', 'facturación'],
};

function leerCSV(texto) {
  const filas = [];
  let fila = [], campo = '', comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ',' || c === ';') { fila.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      fila.push(campo); campo = '';
      if (fila.some(x => x.trim())) filas.push(fila);
      fila = [];
    } else campo += c;
  }
  fila.push(campo);
  if (fila.some(x => x.trim())) filas.push(fila);
  return filas;
}

async function main() {
  const args = process.argv.slice(2);
  const archivo = args.find(a => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--test');
  const probar = args.includes('--probar');
  const testEventCode = args.includes('--test') ? args[args.indexOf('--test') + 1] : '';
  if (!archivo) return console.error('Falta el CSV. Uso: node herramientas/reenviar-leads-meta.js leads.csv [--probar] [--test CODIGO]');

  const [cabecera, ...filas] = leerCSV(fs.readFileSync(archivo, 'utf8').replace(/^﻿/, ''));
  const encabezados = cabecera.map(h => h.trim().toLowerCase());
  const indice = {};
  for (const [clave, nombres] of Object.entries(COLUMNAS)) indice[clave] = encabezados.findIndex(h => nombres.includes(h));
  if (indice.email < 0) return console.error('El CSV no tiene columna de email. Columnas:', cabecera.join(' | '));

  let enviados = 0;
  for (const f of filas) {
    const v = clave => (indice[clave] >= 0 ? String(f[indice[clave]] || '').trim() : '');
    const email = v('email').toLowerCase();
    if (!email) continue;
    const fecha = v('fecha') ? new Date(v('fecha')) : new Date();
    if (isNaN(fecha) || Date.now() - fecha > SIETE_DIAS) { console.log('SALTEADO (más de 7 días o fecha ilegible):', email, v('fecha')); continue; }

    const lead = {
      email, recurso: RECURSO, testEventCode,
      nombre: [v('nombre'), v('apellido')].filter(Boolean).join(' '),
      telefono: v('telefono'), pais: v('pais').slice(0, 2).toUpperCase(),
      fbp: v('fbp'), fbc: v('fbc'), fbclid: v('fbclid'), ip: v('ip'), userAgent: v('user_agent'),
      pagina: v('pagina') || 'https://plan.dealmakerconsulting.com/',
      eventTime: Math.floor(fecha / 1000),
      custom: { recurso: RECURSO, califica: true, reenviado: true, etapa: v('etapa'), profesion: v('profesion'), facturacion: v('facturacion') },
    };
    if (probar) { console.log('SE MANDARÍA:', email, fecha.toISOString(), lead.fbc ? 'con fbc' : 'sin fbc'); continue; }
    const r = await enviarLead(lead);
    console.log(r.ok ? 'OK' : 'ERROR', email, r.ok ? '' : r.motivo);
    if (r.ok) enviados++;
  }
  if (!probar) console.log('Enviados:', enviados);
}

main();
