// Plan (lead magnet): manda los datos al webhook y lleva a la página de descarga
(function () {
  // Pegar acá el link del webhook (GHL "Inbound Webhook" o Zapier "Catch Hook")
  var WEBHOOK_URL = '';

  var form = document.getElementById('plan-form');
  if (!form) return;
  var error = form.querySelector('.plan-form-error');
  var button = form.querySelector('button[type="submit"]');
  var thanks = location.hostname.indexOf('plan.') === 0 ? '/gracias' : '/plan/gracias';

  function fail(msg) {
    error.textContent = msg;
    error.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    error.hidden = true;
    var data = new FormData(form);
    var nombre = String(data.get('nombre') || '').trim();
    var email = String(data.get('email') || '').trim();
    var telefono = String(data.get('telefono') || '').trim();
    if (!nombre) return fail('Escribí tu nombre.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Revisá tu email.');
    if (telefono.replace(/\D/g, '').length < 8) return fail('Revisá tu número de WhatsApp.');

    var params = new URLSearchParams(location.search);
    var body = new URLSearchParams({
      nombre: nombre,
      email: email,
      telefono: telefono,
      origen: 'plan.dealmakerconsulting.com',
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || ''
    });

    button.disabled = true;
    button.textContent = 'Enviando…';

    var send = WEBHOOK_URL
      // no-cors + form-urlencoded: el webhook recibe los datos sin bloqueo de CORS (no se lee la respuesta)
      ? fetch(WEBHOOK_URL, { method: 'POST', mode: 'no-cors', body: body, keepalive: true }).catch(function () {})
      : Promise.resolve(console.warn('Plan: falta configurar WEBHOOK_URL en assets/plan.js'));

    send.then(function () { location.href = thanks; });
  });
})();
