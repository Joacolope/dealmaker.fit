// Subdominio plan.dealmakerconsulting.com -> sirve la carpeta /plan
// (los rewrites de vercel.json no pisan archivos que existen, como index.html; por eso se rutea acá)
const HOST_PLAN = 'plan.dealmakerconsulting.com';
const DOMINIO = 'dealmakerconsulting.com';

export const config = {
  matcher: ['/((?!api/|assets/|_vercel).*)'],
};

export default function middleware(request) {
  const url = new URL(request.url);
  const host = url.hostname;
  const cookies = request.headers.get('cookie') || '';

  // Dominio principal: todo /plan va al subdominio (una sola dirección, nada indexado dos veces)
  if (host === DOMINIO || host === 'www.' + DOMINIO) {
    if (url.pathname === '/plan' || url.pathname.startsWith('/plan/')) {
      const rest = url.pathname.replace(/^\/plan/, '') || '/';
      return Response.redirect('https://' + HOST_PLAN + rest + url.search, 308);
    }
    return;
  }

  // Vista previa de Vercel: /?plan=1 activa el modo subdominio en ese navegador, /?plan=0 lo apaga
  let esPlan = host === HOST_PLAN;
  if (!esPlan && host.endsWith('.vercel.app')) {
    if (url.searchParams.get('plan') === '1') esPlan = true;
    else if (url.searchParams.get('plan') === '0') return salirDePreview(url);
    else esPlan = /(?:^|;\s*)plan_preview=1/.test(cookies);
  }
  if (!esPlan) return;

  const target = new URL('/plan' + (url.pathname === '/' ? '' : url.pathname), url);
  target.search = url.search;

  const headers = new Headers({ 'x-middleware-rewrite': target.toString() });
  // Se indexa lo que vende: la landing, robots.txt y sitemap.xml. El resto, noindex.
  if (!['/', '/robots.txt', '/sitemap.xml'].includes(url.pathname)) {
    headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  // País de la IP para preseleccionar el prefijo de WhatsApp en el formulario
  const pais = request.headers.get('x-vercel-ip-country');
  if (pais && !/(?:^|;\s*)pais_ip=/.test(cookies)) {
    headers.append('Set-Cookie', 'pais_ip=' + pais + '; Path=/; Max-Age=2592000; SameSite=Lax; Secure');
  }
  if (host !== HOST_PLAN && url.searchParams.get('plan') === '1') {
    headers.append('Set-Cookie', 'plan_preview=1; Path=/; SameSite=Lax; Secure');
  }
  return new Response(null, { headers });
}

function salirDePreview(url) {
  return new Response(null, {
    status: 302,
    headers: { Location: url.pathname, 'Set-Cookie': 'plan_preview=; Path=/; Max-Age=0' },
  });
}
