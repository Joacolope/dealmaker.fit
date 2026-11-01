// Formulario del Roadmap DealMaker FIT: 5 pasos, valida solo el formato y la calificación la decide el servidor.
// Orden: datos de contacto → profesión → ¿ya trabaja con clientes? → facturación (se saltea si no trabaja) → cuello de botella (4 opciones u "otro" escrito).
// Tocar una opción del paso 5 envía todo; con "otro" se envía con el botón. Nada personal viaja en la URL: nombre, Instagram y profesión van por sessionStorage.
(function () {
  var form = document.getElementById('lm-form');
  if (!form) return;
  var pasos = form.querySelectorAll('.paso');
  var respuestas = {};
  var datos = null;
  var actual = 1;
  var ULTIMO = 5;
  var pasoN = form.querySelector('.progreso .paso-n');

  function ir(n) {
    actual = n;
    pasos.forEach(function (p) { p.hidden = p.getAttribute('data-paso') !== String(n); });
    form.style.setProperty('--avance', n / ULTIMO);
    pasoN.textContent = 'Paso ' + n + ' de ' + ULTIMO;
    // Si el teclado del celular dejó el formulario arriba de la pantalla, se vuelve a mostrar desde el principio
    if (form.getBoundingClientRect().top < 0) form.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  var NOMBRE_PROFESION = { entrenador: 'coach fitness', nutricionista: 'nutricionista', kinesiologo: 'kinesiólogo/a', osteopata: 'osteópata' };
  var preguntaEjerce = document.getElementById('pregunta-ejerce');

  // Siguiente paso según lo respondido: si todavía no trabaja con clientes, no factura y se saltea la facturación
  function siguiente(n) {
    if (n === 2) {
      var p = NOMBRE_PROFESION[respuestas.profesion];
      preguntaEjerce.textContent = p ? '¿Ya trabajás como ' + p + ' con clientes?' : '¿Ya trabajás en tu profesión con clientes?';
    }
    if (n === 3 && respuestas.ejerce === 'no') { respuestas.facturacion = 'menos-1000'; return 5; }
    if (n === 3) delete respuestas.facturacion;
    return n + 1;
  }
  function anterior(n) { return n === 5 && respuestas.ejerce === 'no' ? 3 : n - 1; }

  // Opciones: al tocar una, pasa al siguiente paso con 160 ms de demora.
  // En el último paso una opción envía todo; "Otro" abre el campo para escribirlo y se envía con el botón.
  var otroTexto = form.querySelector('.otro-texto');
  form.querySelectorAll('.paso[data-campo]').forEach(function (paso) {
    var n = +paso.getAttribute('data-paso');
    paso.querySelectorAll('.opcion').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.disabled) return;
        paso.querySelectorAll('.opcion').forEach(function (x) { x.classList.remove('elegida'); });
        b.classList.add('elegida');
        var valor = b.getAttribute('data-valor');
        respuestas[paso.getAttribute('data-campo')] = valor;
        if (n !== ULTIMO) return setTimeout(function () { ir(siguiente(n)); }, 160);
        paso.querySelector('.error').hidden = true;
        form.elements.cuello.classList.remove('invalido');
        otroTexto.hidden = valor !== 'otro';
        if (valor === 'otro') return form.elements.cuello.focus();
        setTimeout(function () { enviar(paso, b); }, 160);
      });
    });
  });
  form.querySelectorAll('.volver').forEach(function (b) {
    b.addEventListener('click', function () { ir(anterior(+b.closest('.paso').getAttribute('data-paso'))); });
  });

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
  form.querySelectorAll('.campo input, .campo select, .campo textarea').forEach(function (c) {
    c.addEventListener(c.tagName === 'SELECT' ? 'change' : 'input', function () { c.classList.remove('invalido'); });
  });

  // Paso 1: datos de contacto. Enter o "Continuar" valida y pasa a las preguntas. Paso 5: "Recibir mi roadmap" envía
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (actual === ULTIMO) return enviar(form.querySelector('.paso[data-paso="' + ULTIMO + '"]'));  // solo con "otro" hay botón de enviar
    if (actual !== 1) return;
    var paso = form.querySelector('.paso[data-paso="1"]');
    paso.querySelector('.error').hidden = true;
    var f = form.elements;
    var nombre = f.nombre.value.trim();
    var email = f.email.value.trim().toLowerCase();
    // Instagram: acepta @usuario, el link completo o el usuario pelado
    var ig = f.instagram.value.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/[/?#].*$/, '').replace(/^@/, '').toLowerCase();
    var digitos = f.whatsapp.value.replace(/\D/g, '');
    var pre = select.value.split('|');

    if (!nombre) return mostrarError(paso, 'Escribí tu nombre.', f.nombre);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return mostrarError(paso, 'Revisá tu email.', f.email);
    if (!/^[A-Za-z0-9._]{1,30}$/.test(ig)) return mostrarError(paso, 'Escribí tu usuario de Instagram, por ejemplo @ramiro.previley.', f.instagram);
    if (!select.value) return mostrarError(paso, 'Elegí tu país.', select);
    if (digitos.length < 8) return mostrarError(paso, 'Revisá tu número de WhatsApp.', f.whatsapp);

    datos = { nombre: nombre, email: email, ig: ig, telefono: pre[1] + ' ' + digitos, pais: pre[0], codigo_pais: pre[1] };
    if (document.activeElement) document.activeElement.blur();
    ir(2);
  });

  // Paso 5: cuello de botella (una de las 4 opciones, u "otro" escrito con sus palabras); valida y manda todo.
  // "boton" es lo que muestra "Un segundo…": la opción tocada o, en "otro", el botón de enviar.
  function enviar(paso, boton) {
    if (!datos) return ir(1);
    if (!respuestas.profesion || !respuestas.ejerce || !respuestas.facturacion) return ir(2);
    if (!respuestas.bottleneck) return;
    var campo = form.elements.cuello;
    var cuello = respuestas.bottleneck === 'otro' ? campo.value.trim().replace(/\s+/g, ' ') : '';
    paso.querySelector('.error').hidden = true;
    if (respuestas.bottleneck === 'otro' && cuello.length < 10) return mostrarError(paso, 'Contanos un poco más sobre tu cuello de botella.', campo);
    boton = boton || paso.querySelector('button[type="submit"]');
    var controles = paso.querySelectorAll('button, textarea');
    var texto = boton.textContent;
    controles.forEach(function (x) { x.disabled = true; });
    boton.textContent = 'Un segundo…';

    var q = new URLSearchParams(location.search);
    var cuerpo = {
      nombre: datos.nombre, email: datos.email, instagram: datos.ig,
      telefono: datos.telefono, pais: datos.pais, codigo_pais: datos.codigo_pais, zona_horaria: zona,
      ejerce: respuestas.ejerce, profesion: respuestas.profesion, facturacion: respuestas.facturacion,
      bottleneck: respuestas.bottleneck, bottleneck_texto: cuello,
      utm_source: q.get('utm_source') || '', utm_medium: q.get('utm_medium') || '',
      utm_campaign: q.get('utm_campaign') || '', utm_content: q.get('utm_content') || '',
      fbclid: q.get('fbclid') || '', fbp: cookie('_fbp'), fbc: cookie('_fbc'),
      pagina: location.href, website: form.elements.website.value,
      test_event_code: q.get('test_event_code') || ''
    };

    fetch('/api/recurso', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
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
        // b = opción del cuello de botella (no es un dato personal); el texto de "otro" no viaja
        location.href = '/confirmacion-2?e=' + j.etapa + '&c=' + c + '&v=' + encodeURIComponent(respuestas.profesion) + '&b=' + encodeURIComponent(respuestas.bottleneck);
      })
      .catch(function () {
        controles.forEach(function (x) { x.disabled = false; });
        boton.textContent = texto;
        mostrarError(paso, 'No se pudo enviar. Probá de nuevo.');
      });
  }
})();
