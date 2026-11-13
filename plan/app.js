// Formulario del Roadmap DealMaker FIT: 5 pasos, valida solo el formato y la calificación la decide el servidor.
// Orden (como ivansanchezcoach.com): arranca con un toque, sin escribir nada. ¿A qué te dedicás? → ¿ya trabaja con clientes?
// → facturación (se saltea si no trabaja) → principal desafío → nombre, email, WhatsApp e Instagram. "Recibir mi roadmap" envía todo.
// Nada personal viaja en la URL: nombre, Instagram y profesión van por sessionStorage.
(function () {
  var form = document.getElementById('lm-form');
  if (!form) return;
  var pasos = form.querySelectorAll('.paso');
  var respuestas = {};
  var actual = 1;
  var ULTIMO = 5;
  var barra = form.querySelector('.progreso .barra');
  var atras = form.querySelector('.progreso .atras');

  function ir(n) {
    actual = n;
    pasos.forEach(function (p) { p.hidden = p.getAttribute('data-paso') !== String(n); });
    form.style.setProperty('--avance', n / ULTIMO);
    barra.setAttribute('aria-valuenow', n);
    atras.hidden = n === 1;
    // Si el teclado del celular dejó el formulario arriba de la pantalla, se vuelve a mostrar desde el principio
    if (form.getBoundingClientRect().top < 0) form.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  var NOMBRE_PROFESION = { entrenador: 'entrenador', nutricionista: 'nutricionista', online: 'entrenador online' };
  var preguntaEjerce = document.getElementById('pregunta-ejerce');

  // Siguiente paso según lo respondido: si todavía no trabaja con clientes, no factura y se saltea la facturación
  function siguiente(n) {
    if (n === 1) {
      var p = NOMBRE_PROFESION[respuestas.profesion];
      preguntaEjerce.textContent = p ? '¿Ya trabajás como ' + p + ' con clientes?' : '¿Ya trabajás en tu profesión con clientes?';
    }
    if (n === 2 && respuestas.ejerce === 'no') { respuestas.facturacion = 'menos-1000'; return 4; }
    if (n === 2) delete respuestas.facturacion;
    return n + 1;
  }
  function anterior(n) { return n === 4 && respuestas.ejerce === 'no' ? 2 : n - 1; }

  // Opciones: al tocar una, pasa al siguiente paso con 160 ms de demora
  form.querySelectorAll('.paso[data-campo]').forEach(function (paso) {
    var n = +paso.getAttribute('data-paso');
    paso.querySelectorAll('.opcion').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.disabled) return;
        paso.querySelectorAll('.opcion').forEach(function (x) { x.classList.remove('elegida'); });
        b.classList.add('elegida');
        respuestas[paso.getAttribute('data-campo')] = b.getAttribute('data-valor');
        setTimeout(function () { ir(siguiente(n)); }, 160);
      });
    });
  });
  atras.addEventListener('click', function () { if (actual > 1) ir(anterior(actual)); });

  // País obligatorio: se completa solo con la cookie del país de la IP o la zona horaria; si no se detecta, lo elige la persona
  var ZONAS = {
    'America/Argentina': 'AR', 'America/Buenos_Aires': 'AR', 'America/Montevideo': 'UY', 'America/Santiago': 'CL',
    'America/Asuncion': 'PY', 'America/La_Paz': 'BO', 'America/Lima': 'PE', 'America/Bogota': 'CO', 'America/Guayaquil': 'EC',
    'America/Caracas': 'VE', 'America/Mexico_City': 'MX', 'America/Monterrey': 'MX', 'America/Cancun': 'MX', 'America/Tijuana': 'MX',
    'America/Costa_Rica': 'CR', 'America/Panama': 'PA', 'America/Guatemala': 'GT', 'America/El_Salvador': 'SV',
    'America/Tegucigalpa': 'HN', 'America/Managua': 'NI', 'America/Santo_Domingo': 'DO', 'America/Puerto_Rico': 'PR',
    'Europe/Madrid': 'ES', 'America/Sao_Paulo': 'BR', 'America/New_York': 'US', 'America/Chicago': 'US',
    'America/Denver': 'US', 'America/Los_Angeles': 'US'
  };
  var zona = '';
  try { zona = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  var cookie = function (k) { var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + k + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : ''; };
  var pais = cookie('pais_ip') || ZONAS[zona] || ZONAS[zona.split('/').slice(0, 2).join('/')] || '';
  var select = form.elements.prefijo;
  for (var i = 0; pais && i < select.options.length; i++) {
    if (select.options[i].value.indexOf(pais + '|') === 0) { select.selectedIndex = i; break; }
  }

  // Error: mensaje debajo de los campos y el campo en rojo (con foco) hasta que se corrija
  function mostrarError(paso, t, campo) {
    var e = paso.querySelector('.error'); e.textContent = t; e.hidden = false;
    if (campo) { campo.classList.add('invalido'); campo.focus(); }
  }
  form.querySelectorAll('.campo input, .campo select').forEach(function (c) {
    c.addEventListener(c.tagName === 'SELECT' ? 'change' : 'input', function () { c.classList.remove('invalido'); });
  });

  // Último paso: Enter o "Recibir mi roadmap" valida el contacto y envía todo
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (actual !== ULTIMO) return;
    var paso = form.querySelector('.paso[data-paso="' + actual + '"]');
    var f = form.elements;
    paso.querySelector('.error').hidden = true;
    var nombre = f.nombre.value.trim();
    var email = f.email.value.trim().toLowerCase();
    // Instagram: acepta @usuario, el link completo o el usuario pelado
    var ig = f.instagram.value.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/[/?#].*$/, '').replace(/^@/, '').toLowerCase();
    var digitos = f.whatsapp.value.replace(/\D/g, '');
    var pre = select.value.split('|');

    if (!nombre) return mostrarError(paso, 'Escribí tu nombre.', f.nombre);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return mostrarError(paso, 'Revisá tu email.', f.email);
    if (!select.value) return mostrarError(paso, 'Elegí tu país.', select);
    if (digitos.length < 8) return mostrarError(paso, 'Revisá tu número de WhatsApp.', f.whatsapp);
    if (!/^[A-Za-z0-9._]{1,30}$/.test(ig)) return mostrarError(paso, 'Escribí tu usuario de Instagram, por ejemplo @ramiro.previley.', f.instagram);

    if (document.activeElement) document.activeElement.blur();
    enviar(paso, { nombre: nombre, email: email, ig: ig, telefono: pre[1] + ' ' + digitos, pais: pre[0], codigo_pais: pre[1] });
  });

  // Envío: el botón del último paso muestra "Un segundo…" mientras tanto
  function enviar(paso, datos) {
    if (!respuestas.profesion || !respuestas.ejerce || !respuestas.facturacion) return ir(1);
    if (!respuestas.bottleneck) return ir(4);
    var boton = paso.querySelector('.boton');
    var controles = paso.querySelectorAll('button, input, select');
    var texto = boton.textContent;
    controles.forEach(function (x) { x.disabled = true; });
    boton.textContent = 'Un segundo…';

    var q = new URLSearchParams(location.search);
    var cuerpo = {
      nombre: datos.nombre, email: datos.email, instagram: datos.ig,
      telefono: datos.telefono, pais: datos.pais, codigo_pais: datos.codigo_pais, zona_horaria: zona,
      ejerce: respuestas.ejerce, profesion: respuestas.profesion, facturacion: respuestas.facturacion,
      bottleneck: respuestas.bottleneck,
      utm_source: q.get('utm_source') || '', utm_medium: q.get('utm_medium') || '',
      utm_campaign: q.get('utm_campaign') || '', utm_content: q.get('utm_content') || '',
      utm_term: q.get('utm_term') || '', utm_id: q.get('utm_id') || '',
      fbclid: q.get('fbclid') || '', fbp: cookie('_fbp'), fbc: cookie('_fbc'),
      pagina: location.href, website: form.elements.website.value,
      test_event_code: q.get('test_event_code') || ''
    };

    // Si falla una vez (red, servidor lento), se reintenta solo a los 1,5 s antes de avisar
    var pedir = function () {
      return fetch('/api/recurso', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    };
    pedir()
      .catch(function () { return new Promise(function (ok) { setTimeout(ok, 1500); }).then(pedir); })
      .then(function (j) {
        var c = encodeURIComponent(respuestas.facturacion);
        // No califica (otra profesión, no trabaja con clientes o menos de $1k): va directo a su roadmap.
        // Solo el que califica pasa a WhatsApp. La etapa (qué documento recibe) sale siempre de la facturación.
        if (!j.califica) {
          location.href = '/confirmacion-1?e=' + (j.etapa || 1) + '&c=' + c;
          return;
        }
        try {
          sessionStorage.setItem('lm', JSON.stringify({ n: datos.nombre.split(/\s+/)[0], ig: datos.ig, pr: respuestas.profesion, cb: respuestas.bottleneck }));
        } catch (err) {}
        // b = opción del principal desafío (no es un dato personal)
        location.href = '/confirmacion-2?e=' + j.etapa + '&c=' + c + '&v=' + encodeURIComponent(respuestas.profesion) + '&b=' + encodeURIComponent(respuestas.bottleneck);
      })
      .catch(function () {
        controles.forEach(function (x) { x.disabled = false; });
        boton.textContent = texto;
        mostrarError(paso, 'No se pudo enviar. Probá de nuevo.');
      });
  }
})();
