// Exporta a CSV los registros del roadmap guardados en la base propia (Neon, tabla roadmap_registros)
// Uso:  node herramientas/exportar-leads.js leads.csv [--calificados] [--con-pruebas]
// Lee DATABASE_URL del entorno o de .env.local (npx vercel env pull). Por defecto deja afuera las pruebas.
const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const COLUMNAS = ['id', 'creado', 'califica', 'etapa', 'etapa_nombre', 'nombre', 'email', 'telefono', 'instagram', 'pais',
  'profesion_texto', 'ejerce_texto', 'facturacion_texto', 'bottleneck_texto',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id',
  'fbclid', 'fbc', 'fbp', 'ip', 'user_agent', 'event_id', 'pagina', 'envio_ghl', 'envio_capi', 'prueba'];

const celda = v => {
  const t = v == null ? '' : v instanceof Date ? v.toISOString() : String(v);
  return /[",\n\r]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
};

async function main() {
  const args = process.argv.slice(2);
  const archivo = args.find(a => !a.startsWith('--'));
  if (!archivo) return console.error('Uso: node herramientas/exportar-leads.js leads.csv [--calificados] [--con-pruebas]');
  let url = process.env.DATABASE_URL;
  const env = path.join(__dirname, '..', '.env.local');
  if (!url && fs.existsSync(env)) url = (fs.readFileSync(env, 'utf8').match(/^DATABASE_URL="?([^"\r\n]+)"?/m) || [])[1];
  if (!url) return console.error('Falta DATABASE_URL');

  const condiciones = [];
  if (!args.includes('--con-pruebas')) condiciones.push('not prueba');
  if (args.includes('--calificados')) condiciones.push('califica');
  const filas = await neon(url).query('select ' + COLUMNAS.join(', ') + ' from roadmap_registros' +
    (condiciones.length ? ' where ' + condiciones.join(' and ') : '') + ' order by creado');

  fs.writeFileSync(archivo, '﻿' + [COLUMNAS.join(','), ...filas.map(r => COLUMNAS.map(c => celda(r[c])).join(','))].join('\r\n'));
  console.log('Registros:', filas.length, '→', archivo);
}

main().catch(e => { console.error(e.message); process.exit(1); });
