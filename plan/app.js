// Formulario del Roadmap DealMaker FIT: 5 pasos, valida solo el formato y la calificación la decide el servidor.
// Orden: profesión → ¿ya trabaja con clientes? → facturación (se saltea si no trabaja) → cuándo quiere empezar → datos.
// Nada personal viaja en la URL: nombre, Instagram y profesión van por sessionStorage.
(function () {
  var form = document.getElementById('lm-form');
  if (!form) return;
  var pasos = form.querySelectorAll('.paso');
  var respuestas = {};
  var error = form.querySelector('.error');
  var boton = form.querySelector('button[type="submit"]');

  function ir(n) {
    pasos.forEach(function (p) { p.hidden = p.getAttribute('data-paso') !== String(n); });
  }

  var NOMBRE_PROFESION = { entrenador: 'coach fitness', nutricionista: 'nutricionista', kinesiologo: 'kinesiólogo/a', osteopata: 'osteópata' };
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
        paso.querySelectorAll('.opcion').forEach(function (x) { x.classList.remove('elegida'); });
        b.classList.add('elegida');
        respuestas[paso.getAttribute('data-campo')] = b.getAttribute('data-valor');
        setTimeout(function () { ir(siguiente(n)); }, 160);
      });
    });
  });
  form.querySelectorAll('.volver').forEach(function (b) {
    b.addEventListener('click', function () { ir(anterior(+b.closest('.paso').getAttribute('data-paso'))); });
  });

  // Prefijo: cookie del país de la IP, si no la zona horaria, si no Argentina
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
  var pais = cookie('pais_ip') || ZONAS[zona] || ZONAS[zona.split('/').slice(0, 2).join('/')] || 'AR';
  var select = form.elements.prefijo;
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value.indexOf(pais + '|') === 0) { select.selectedIndex = i; break; }
  }

  function mostrarError(t) { error.textContent = t; error.hidden = false; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    error.hidden = true;
    var f = form.elements;
    var nombre = f.nombre.value.trim();
    var email = f.email.value.trim().toLowerCase();
    // Instagram: acepta @usuario, el link completo o el usuario pelado
    var ig = f.instagram.value.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/[/?#].*$/, '').replace(/^@/, '').toLowerCase();
    var digitos = f.whatsapp.value.replace(/\D/g, '');
    var pre = select.value.split('|');

    if (!nombre) return mostrarError('Escribí tu nombre.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return mostrarError('Revisá tu email.');
    if (!/^[A-Za-z0-9._]{1,30}$/.test(ig)) return mostrarError('Revisá tu usuario de Instagram.');
    if (digitos.length < 6) return mostrarError('Revisá tu número de WhatsApp.');
    if (!respuestas.profesion || !respuestas.ejerce || !respuestas.facturacion || !respuestas.momento) return ir(1);

    var q = new URLSearchParams(location.search);
    var cuerpo = {
      nombre: nombre, email: email, instagram: ig,
      telefono: pre[1] + ' ' + digitos, pais: pre[0], codigo_pais: pre[1], zona_horaria: zona,
      ejerce: respuestas.ejerce, profesion: respuestas.profesion, facturacion: respuestas.facturacion, momento: respuestas.momento,
      utm_source: q.get('utm_source') || '', utm_medium: q.get('utm_medium') || '',
      utm_campaign: q.get('utm_campaign') || '', utm_content: q.get('utm_content') || '',
      fbclid: q.get('fbclid') || '', fbp: cookie('_fbp'), fbc: cookie('_fbc'),
      pagina: location.href, website: f.website.value,
      test_event_code: q.get('test_event_code') || ''
    };

    boton.disabled = true;
    boton.textContent = 'Un segundo…';
    fetch('/api/recurso', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) {
        var c = encodeURIComponent(respuestas.facturacion);
        // Cualquier respuesta negativa (otra profesión, no trabaja con clientes, menos de $1k o solo está mirando) = no califica: va directo a su roadmap.
        // Solo el que califica pasa a WhatsApp. La etapa (qué documento recibe) sale siempre de la facturación.
        if (!j.califica) {
          location.href = '/confirmacion-1?e=' + (j.etapa || 1) + '&c=' + c;
          return;
        }
        try {
          sessionStorage.setItem('lm', JSON.stringify({ n: nombre.split(/\s+/)[0], ig: ig, pr: respuestas.profesion }));
        } catch (err) {}
        location.href = '/confirmacion-2?e=' + j.etapa + '&c=' + c + '&v=' + encodeURIComponent(respuestas.profesion);
      })
      .catch(function () {
        boton.disabled = false;
        boton.textContent = 'Recibir mi roadmap →';
        mostrarError('No se pudo enviar. Probá de nuevo.');
      });
  });
})();
