// Roadmap DealMaker FIT: arma el documento de una etapa (la de hoy + la que sigue) en hojas de 560×792.
// El contenido vive en etapas.js; acá solo se dibuja. Nunca tocar el HTML para cambiar texto.
(function () {
  var ETAPAS = window.ETAPAS, RANGO = window.RANGO;
  var n = parseInt(document.body.getAttribute('data-etapa'), 10) || 1;
  var hoy = ETAPAS[n - 1], sigue = ETAPAS[n] || null;
  var c = new URLSearchParams(location.search).get('c');
  var pie = 'Roadmap · Etapa 0' + hoy.n + ' · ' + hoy.nombre;
  var LOGO = '/logo.svg';

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (x) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x]; }); };

  // ===== Bloques =====
  function bloque(b) {
    if (b.p != null) return '<p class="bloque">' + esc(b.p) + '</p>';
    if (b.lista) return '<ul class="lista">' + b.lista.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (b.lineas) return '<div class="lineas">' + b.lineas.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>';
    if (b.grande) return '<p class="grande"><span>' + esc(b.grande) + '</span></p>';
    if (b.cita) return '<p class="cita">' + esc(b.cita) + '</p>';
    if (b.cadena) return '<div class="cadena">' + b.cadena.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('<i aria-hidden="true">→</i>') + '</div>';
    if (b.preguntas) return '<ol class="preguntas">' + b.preguntas.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>';
    if (b.sub) return '<h3 class="sub">' + esc(b.sub) + '</h3>';
    if (b.sub2) return '<h4 class="sub2">' + esc(b.sub2) + '</h4>';
    if (b.dimensiones) return '<div class="dimensiones">' + b.dimensiones.map(function (d, i) {
      return '<div><b>' + (i + 1) + '. ' + esc(d[0]) + '</b><span>' + esc(d[1]) + '</span></div>'; }).join('') + '</div>';
    return '';
  }
  var bloques = function (arr) { return (arr || []).map(bloque); };
  var titulo = function (t, kicker) { return '<header class="titulo">' + (kicker ? '<p class="kicker">' + esc(kicker) + '</p>' : '') + '<h2><span>' + esc(t) + '</span></h2></header>'; };

  // ===== Secciones del documento =====
  // Cada sección: { id, indice, sub (entrada secundaria del índice), mini (rótulo de la hoja), clase, unica (no pagina), html | partes[] }
  var S = [];

  var rangoHoy = c && RANGO[c] ? 'Hoy facturás ' + RANGO[c] + ' por mes.' : hoy.rango;
  S.push({ id: 'portada', indice: 'Portada', mini: window.RECURSO_NOMBRE, clase: 'hoja--portada', unica: true, html:
    '<img class="portada-logo" src="' + LOGO + '" alt="">' +
    '<p class="kicker">' + esc(window.RECURSO_NOMBRE) + '</p>' +
    '<p class="portada-num">0' + hoy.n + '</p>' +
    '<p class="portada-etiqueta">Etapa · tu punto de partida</p>' +
    '<h1 class="degrade">' + esc(hoy.nombre) + '</h1>' +
    '<p class="portada-rango">' + esc(rangoHoy) + '</p>' +
    '<p class="portada-corto">' + esc(hoy.corto) + '</p>' +
    '<p class="portada-en">' + (sigue
      ? 'En este documento: qué trabajar en ' + esc(hoy.nombre) + ' para pasarla, y cómo se ve ' + esc(sigue.nombre) + ', la etapa que sigue.'
      : 'En este documento: cómo sostener la última etapa y por qué llegar no es el final.') + '</p>' });

  S.push({ id: 'donde', indice: 'Dónde estás', mini: 'Dónde estás', partes: [titulo('Dónde estás', 'Las 4 etapas'),
    '<div class="mapa">' + ETAPAS.map(function (e) {
      var estado = e.n === hoy.n ? 'Estás acá' : (sigue && e.n === sigue.n ? 'La que sigue' : '');
      return '<div class="mapa-fila' + (estado ? ' activa' : '') + (e.n === hoy.n ? ' hoy' : '') + '"><span class="mapa-n">0' + e.n + '</span><div><b>' + esc(e.nombre) +
        '</b><small>' + esc(e.rango) + '</small><span>' + esc(e.corto) + '</span></div>' + (estado ? '<em>' + estado + '</em>' : '') + '</div>';
    }).join('') + '</div>',
    '<p class="bloque nota">' + (sigue ? 'Este documento desarrolla esas dos etapas: la tuya y la que sigue.' : 'Este documento desarrolla tu etapa, la última.') + ' Cada etapa tiene su propio documento.</p>',
    '<h3 class="sub">Una aclaración importante</h3>'].concat(bloques(window.ACLARACION)) });

  S.push({ id: 'actual', indice: 'Tu etapa actual', mini: 'Tu etapa actual', partes: [titulo('Tu etapa actual', 'Etapa 0' + hoy.n),
    '<div class="tarjeta"><p class="tarjeta-nombre">' + esc(hoy.nombre) + '</p><p class="tarjeta-rango">' + esc(hoy.rango) + '</p>' +
    '<dl><dt>Cómo se ve</dt><dd>' + esc(hoy.corto) + '</dd><dt>Problema</dt><dd>' + esc(cap(hoy.resumen.problema)) + '.</dd>' +
    '<dt>Prioridad</dt><dd>' + esc(cap(hoy.resumen.prioridad)) + '.</dd><dt>Trampa</dt><dd>' + esc(cap(hoy.resumen.trampa)) + '.</dd>' +
    '<dt>Para pasar a la siguiente</dt><dd>' + esc(cap(hoy.resumen.objetivo)) + '.</dd></dl></div>'] });

  agregarEtapa(hoy, 'hoy');
  if (sigue) agregarEtapa(sigue, 'sigue');

  S.push({ id: 'resumen', indice: 'Resumen', mini: 'Resumen', partes: [titulo('No necesitás hacer todo al mismo tiempo', 'Resumen'),
    '<p class="bloque">Necesitás solucionar el problema correspondiente a tu etapa.</p>',
    '<div class="principio"><span>' + esc(hoy.principio[0]) + '</span><b>' + esc(hoy.principio[1]) + '</b></div>',
    '<div class="transicion"><span>' + esc(hoy.transicion.de) + '</span><i>→</i><span class="acento">' + esc(hoy.transicion.a) + '</span><p>' + esc(hoy.transicion.p) + '</p></div>',
    sigue ? '<p class="bloque">Y cuando llegues a ' + esc(sigue.nombre) + ': ' + esc(sigue.principio[1].toLowerCase()) + '</p>' : '<p class="bloque">Es la última etapa: lo que sigue es sostenerla y que el negocio crezca sin multiplicar el caos.</p>',
    '<h3 class="sub">Por qué muchos profesionales se estancan</h3>',
    '<p class="bloque">Porque intentan saltarse etapas. Quieren:</p>',
    '<div class="lineas">' + window.ESTANCAN.lineas.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>',
    '<p class="grande"><span>' + esc(window.ESTANCAN.frase) + '</span></p>'] });

  if (sigue) {
    var D = window.DESTINO;
    S.push({ id: 'destino', indice: 'El destino', mini: 'El destino', clase: 'hoja--oscura', unica: true, html:
      '<p class="kicker">El destino</p><h2 class="degrade">' + esc(D.titulo) + '</h2><p class="oscura-p">' + esc(D.p) + '</p>' +
      '<div class="pildoras">' + D.pildoras.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' +
      '<div class="lineas lineas--claro">' + D.sin.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' });
  } else {
    var V = window.VEHICULO;
    S.push({ id: 'dealmaker', indice: 'DealMaker FIT', mini: 'DealMaker FIT', clase: 'hoja--oscura', unica: true, html:
      '<p class="kicker">DealMaker FIT</p><h2 class="degrade">El vehículo para pasar de profesional a dueño de negocio</h2>' +
      '<p class="oscura-p">' + esc(V.p) + '</p><div class="pildoras">' + V.pildoras.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' +
      '<p class="kicker kicker--sep">La promesa</p><p class="oscura-promesa">' + esc(V.promesa) + '</p>' });
  }

  var C = window.CIERRE;
  S.push({ id: 'cierre', indice: 'Siguiente paso', mini: 'Siguiente paso', clase: 'hoja--cierre', unica: true, html:
    '<img class="cierre-logo" src="' + LOGO + '" alt="DealMaker">' +
    '<h2>' + esc(C.titulo) + '</h2><p class="bloque">' + esc(C.p) + '</p>' +
    '<div class="lineas">' + C.lineas.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' +
    '<p class="bloque">Ese es el trabajo dentro de DealMaker FIT.</p>' +
    '<div class="cierre-pasos">' + C.pasos.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' +
    '<p class="cierre-senal">Tocá el botón de abajo y agendá tu sesión</p><span class="flecha" aria-hidden="true">↓</span>' +
    '<a class="boton" href="' + esc(window.AGENDA) + '">Agendar mi sesión →</a><p class="cierre-remate">Es un clic. Sin vueltas.</p>' });

  function agregarEtapa(e, cual) {
    var pref = cual === 'hoy' ? 'Tu etapa' : 'La que sigue';
    var kicker = cual === 'hoy' ? 'Tu etapa · ' + e.rango : 'La que sigue · cuando llegás a ' + e.rango.replace(' / mes', '');
    S.push({ id: cual + '-portada', indice: pref + ': ' + e.nombre, mini: pref, clase: 'hoja--oscura', unica: true, html:
      '<p class="kicker">' + esc(kicker) + '</p><p class="portada-num portada-num--chico">Etapa 0' + e.n + '</p>' +
      '<h2 class="degrade">' + esc(e.nombre) + '</h2><p class="oscura-cita">' + esc(e.cita) + '</p>' +
      '<p class="oscura-lbl">' + (cual === 'hoy' ? 'Qué tenés que trabajar' : 'En esa etapa se trabaja sobre') + '</p>' +
      '<ol class="oscura-lista">' + e.partes.map(function (p) { return '<li>' + esc(p.titulo) + '</li>'; }).join('') + '</ol>' });
    var mini = pref + ' · ' + e.nombre;
    S.push({ id: cual + '-como', indice: 'Cómo se ve', sub: true, mini: mini, partes: [titulo('Cómo se ve', 'Etapa 0' + e.n)].concat(bloques(e.comoSeVe)) });
    S.push({ id: cual + '-problema', indice: 'Su problema principal', sub: true, mini: mini, partes: [titulo('Su problema principal', 'Etapa 0' + e.n)]
      .concat(bloques(e.problema)).concat(['<div class="foco"><small>Su prioridad</small><b>' + esc(e.prioridad) + '</b></div>']).concat(bloques(e.prioridadBloques)) });
    e.partes.forEach(function (p, i) {
      S.push({ id: cual + '-p' + i, indice: (i + 1) + '. ' + p.titulo, sub: true, mini: mini, partes: [titulo(p.titulo, 'Qué trabajar · 0' + (i + 1))].concat(bloques(p.bloques)) });
    });
    (e.extra || []).forEach(function (x, i) {
      S.push({ id: cual + '-x' + i, indice: x.titulo, sub: true, mini: mini, partes: [titulo(x.titulo, 'Etapa 0' + e.n)].concat(bloques(x.bloques)) });
    });
    S.push({ id: cual + '-trampa', indice: 'La trampa', sub: true, mini: mini, partes: [titulo(e.trampas.length > 1 ? 'Las trampas de esta etapa' : 'La trampa de esta etapa', 'Etapa 0' + e.n)]
      .concat(e.trampas.map(function (t) {
        return '<div class="bloque--trampa"><small>Trampa</small><b>' + esc(t.titulo) + '</b>' + bloques(t.bloques).join('') +
          (t.frase ? '<p class="trampa-frase">' + esc(t.frase) + '</p>' : '') + '</div>';
      })) });
    S.push({ id: cual + '-senal', indice: 'Señal de avance', sub: true, mini: mini, partes: [titulo('Señal de avance', 'Etapa 0' + e.n),
      '<div class="bloque--senal">' + bloques(e.senal).join('') + '</div>']
      .concat(e.siguiente.length ? ['<h3 class="sub">Para pasar a la siguiente etapa</h3>'].concat(bloques(e.siguiente)) : []) });
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ===== Paginación =====
  var visor = document.querySelector('.visor');
  var indice = document.querySelector('.indice');

  function hoja(sec, cont) {
    var h = document.createElement('section');
    h.className = 'hoja' + (sec.clase ? ' ' + sec.clase : '');
    h.setAttribute('data-sec', sec.id);
    h.innerHTML = '<div class="hoja-cab"><img src="' + LOGO + '" alt=""><span>' + esc(sec.mini) + (cont ? ' · continúa' : '') + '</span></div>' +
      '<div class="cuerpo"></div><div class="hoja-pie"><span>' + esc(pie) + '</span><span class="pag"></span></div>';
    visor.appendChild(h);
    return h.querySelector('.cuerpo');
  }
  var desborda = function (el) { return el.scrollHeight > el.clientHeight + 1; };

  function paginar() {
    visor.innerHTML = '';
    S.forEach(function (sec) {
      if (sec.unica) { hoja(sec).innerHTML = sec.html; return; }
      var cuerpo = hoja(sec), vacio = true;
      sec.partes.forEach(function (html) {
        var t = document.createElement('template');
        t.innerHTML = html;
        var el = t.content.firstElementChild;
        cuerpo.appendChild(el);
        if (desborda(cuerpo) && !vacio) {
          cuerpo.removeChild(el);
          cuerpo = hoja(sec, true);
          cuerpo.appendChild(el);
        }
        vacio = false;
      });
    });
    var hojas = visor.querySelectorAll('.hoja');
    hojas.forEach(function (h, i) { h.querySelector('.pag').textContent = dos(i + 1) + ' / ' + dos(hojas.length); });
    armarIndice();
    escalar();
    contador();
    // ?solo=<sección>: muestra solo la primera hoja de esa sección a tamaño real (para la imagen de vista previa)
    var solo = new URLSearchParams(location.search).get('solo');
    if (solo) {
      document.body.classList.add('solo');
      hojas.forEach(function (h) { h.hidden = true; });
      var h = visor.querySelector('[data-sec="' + solo + '"]');
      if (h) h.hidden = false;
    }
  }
  var dos = function (x) { return (x < 10 ? '0' : '') + x; };

  // ===== Índice (desktop) =====
  var observador;
  function armarIndice() {
    indice.innerHTML = '<p class="indice-titulo">' + esc(pie) + '</p>' + S.map(function (s) {
      return '<a href="#' + s.id + '" data-ir="' + s.id + '"' + (s.sub ? ' class="i-sub"' : '') + '>' + esc(s.indice) + '</a>';
    }).join('');
    indice.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        var h = visor.querySelector('[data-sec="' + a.getAttribute('data-ir') + '"]');
        if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
      });
    });
    if (observador) observador.disconnect();
    if (!('IntersectionObserver' in window)) return;
    observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.getAttribute('data-sec');
        indice.querySelectorAll('a').forEach(function (a) { a.classList.toggle('activa', a.getAttribute('data-ir') === id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    visor.querySelectorAll('.hoja').forEach(function (h) { observador.observe(h); });
  }

  // ===== Escala: la hoja entera entra en pantalla =====
  function escalar() {
    var movil = window.innerWidth < 900;
    var z = movil ? Math.min((window.innerWidth - 24) / 560, (window.innerHeight - 70) / 792)
                  : Math.min(1.35, (document.querySelector('.doc').clientWidth - 320) / 560);
    document.documentElement.style.setProperty('--z', Math.max(0.3, z).toFixed(3));
  }

  // ===== Contador del carrusel (celular) =====
  var cont = document.querySelector('.contador-n');
  var pista = document.querySelector('.contador-pista');
  function contador() {
    if (!cont) return;
    var hojas = visor.querySelectorAll('.hoja');
    var i = Math.round(visor.scrollLeft / (visor.scrollWidth / hojas.length));
    cont.textContent = (Math.min(hojas.length, i + 1)) + ' / ' + hojas.length;
    if (pista) pista.hidden = i > 0;
  }
  visor.addEventListener('scroll', contador, { passive: true });
  window.addEventListener('resize', function () { escalar(); contador(); });

  paginar();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(paginar);
})();
