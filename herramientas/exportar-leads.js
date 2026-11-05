// Exporta a CSV los registros del roadmap guardados en la base propia (Vercel Blob, store dealmaker-leads)
// Uso:  BLOB_READ_WRITE_TOKEN=... node herramientas/exportar-leads.js leads.csv [--calificados] [--con-pruebas]
// El token sale de: npx vercel env pull --environment production <archivo>
// Por defecto deja afuera las pruebas (prueba = true).
const fs = require('fs');
const { list, get } = require('@vercel/blob');

const COLUMNAS = ['fecha', 'califica', 'etapa', 'etapa_nombre', 'nombre', 'email', 'telefono', 'instagram', 'pais',
  'profesion_texto', 'ejerce_texto', 'facturacion_texto', 'bottleneck_texto',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id',
  'fbclid', 'fbc', 'fbp', 'ip', 'user_agent', 'event_id', 'pagina', 'envio_ghl', 'envio_capi', 'prueba'];

const celda = v => {
  const t = v == null ? '' : String(v);
  return /[",\n\r]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
};

async function main() {
  const args = process.argv.slice(2);
  const archivo = args.find(a => !a.startsWith('--'));
  if (!archivo) return console.error('Uso: node herramientas/exportar-leads.js leads.csv [--calificados] [--con-pruebas]');

  const registros = [];
  let cursor;
  do {
    const pagina = await list({ prefix: 'roadmap/', cursor, limit: 1000 });
    for (const b of pagina.blobs) {
      const r = await get(b.pathname, { access: 'private', useCache: false });
      if (r && r.statusCode === 200) registros.push(JSON.parse(await new Response(r.stream).text()));
    }
    cursor = pagina.hasMore ? pagina.cursor : undefined;
  } while (cursor);

  const filas = registros
    .filter(r => args.includes('--con-pruebas') || !r.prueba)
    .filter(r => !args.includes('--calificados') || r.califica)
    .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))
    .map(r => ({ ...r, envio_ghl: r.envio && r.envio.ghl, envio_capi: r.envio && r.envio.capi }));

  fs.writeFileSync(archivo, '﻿' + [COLUMNAS.join(','), ...filas.map(r => COLUMNAS.map(c => celda(r[c])).join(','))].join('\r\n'));
  console.log('Registros:', filas.length, 'de', registros.length, '→', archivo);
}

main();
