// Presentación: videos de casos de éxito y barra fija de agendar
(function () {
  // Al tocar un caso, se reemplaza la miniatura por el video de Drive
  document.querySelectorAll('.case-video[data-drive-id]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-drive-id');
      btn.classList.add('is-playing');
      btn.innerHTML = '<iframe src="https://drive.google.com/file/d/' + id + '/preview" ' +
        'allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    });
  });

  // Pixel de Meta (lo carga GTM): InitiateCheckout la primera vez que tocan "Agendar llamada"
  var checkoutSent = false;
  document.querySelectorAll('a[href="#agenda"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (checkoutSent || typeof window.fbq !== 'function') return;
      checkoutSent = true;
      window.fbq('track', 'InitiateCheckout');
    });
  });

  // La barra fija aparece después del botón principal y se esconde al llegar a la agenda
  var bar = document.getElementById('sticky-cta');
  var cta = document.getElementById('cta-principal');
  var agenda = document.getElementById('agenda');
  if (!bar || !cta || !agenda || !('IntersectionObserver' in window)) return;
  var pastCta = false, atAgenda = false;
  function update() { bar.hidden = !(pastCta && !atAgenda); }
  new IntersectionObserver(function (entries) {
    var e = entries[0];
    pastCta = !e.isIntersecting && e.boundingClientRect.top < 0;
    update();
  }).observe(cta);
  new IntersectionObserver(function (entries) {
    atAgenda = entries[0].isIntersecting;
    update();
  }, { rootMargin: '0px 0px -30% 0px' }).observe(agenda);
})();
