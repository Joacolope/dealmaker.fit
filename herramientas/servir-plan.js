// Vista local del subdominio plan.dealmakerconsulting.com, igual que en producción:
// la carpeta /plan en la raíz, /assets desde la raíz del repo y URLs sin .html.
// Uso: node herramientas/servir-plan.js [puerto]   (por defecto 4191)
const http = require('http');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' };

http.createServer((req, res) => {
  const ruta = decodeURIComponent(req.url.split('?')[0]);
  const base = path.join(RAIZ, ruta.startsWith('/assets/') ? '' : 'plan', ruta);
  const archivo = [base, base + '.html', path.join(base, 'index.html')].find(a => a.startsWith(RAIZ) && fs.existsSync(a) && fs.statSync(a).isFile());
  if (!archivo) { res.writeHead(404); return res.end('No existe'); }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(archivo).pipe(res);
}).listen(+process.argv[2] || 4191, () => console.log('Plan en http://localhost:' + (+process.argv[2] || 4191)));
