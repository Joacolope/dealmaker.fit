// Subdominio plan.dealmakerconsulting.com -> sirve la carpeta /plan
// (las reglas de vercel.json no alcanzan: un archivo existente, como index.html, gana sobre un rewrite)
export const config = {
  matcher: '/((?!assets/).*)',
};

export default function middleware(request) {
  const url = new URL(request.url);
  if (!url.hostname.startsWith('plan.')) return;
  if (url.pathname === '/plan' || url.pathname.startsWith('/plan/')) return;

  const target = new URL(url.pathname === '/' ? '/plan' : '/plan' + url.pathname, url);
  target.search = url.search;
  // Equivale a rewrite() de @vercel/functions, sin agregar dependencias
  return new Response(null, { headers: { 'x-middleware-rewrite': target.toString() } });
}
