// Landings (Presentación y Gracias): videos de casos de éxito y barra fija
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

  // La barra fija aparece después del botón principal (#cta-principal)
  // y, si la página tiene agenda (#agenda), se esconde al llegar a ella
  var bar = document.getElementById('sticky-cta');
  var cta = document.getElementById('cta-principal');
  var agenda = document.getElementById('agenda');
  if (!bar || !cta || !('IntersectionObserver' in window)) return;
  var pastCta = false, atAgenda = false;
  function update() { bar.hidden = !(pastCta && !atAgenda); }
  new IntersectionObserver(function (entries) {
    var e = entries[0];
    pastCta = !e.isIntersecting && e.boundingClientRect.top < 0;
    update();
  }).observe(cta);
  if (agenda) {
    new IntersectionObserver(function (entries) {
      atAgenda = entries[0].isIntersecting;
      update();
    }, { rootMargin: '0px 0px -30% 0px' }).observe(agenda);
  }
})();
