// Crea (o deja como está) la tabla roadmap_registros en Neon, con docs/neon-roadmap.sql
// Uso: node herramientas/crear-tabla.js   (lee DATABASE_URL del entorno o de .env.local)
const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const raiz = path.join(__dirname, '..');
let url = process.env.DATABASE_URL;
if (!url && fs.existsSync(path.join(raiz, '.env.local'))) {
  const m = fs.readFileSync(path.join(raiz, '.env.local'), 'utf8').match(/^DATABASE_URL="?([^"\r\n]+)"?/m);
  if (m) url = m[1];
}
if (!url) { console.error('Falta DATABASE_URL'); process.exit(1); }

const sql = neon(url);
const sentencias = fs.readFileSync(path.join(raiz, 'docs/neon-roadmap.sql'), 'utf8')
  .replace(/--.*$/gm, '').split(';').map(s => s.trim()).filter(Boolean);

(async () => {
  for (const s of sentencias) await sql.query(s);
  const columnas = await sql.query("select count(*)::int as n from information_schema.columns where table_name = 'roadmap_registros'");
  console.log('Tabla roadmap_registros lista con', columnas[0].n, 'columnas');
})().catch(e => { console.error(e.message); process.exit(1); });
