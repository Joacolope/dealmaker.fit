// Landings (Presentación y Gracias): barra fija
(function () {
  // Cuándo aparece la barra (con fade):
  //   data-show="scroll" -> apenas se empieza a scrollear (Presentación)
  //   por defecto       -> después de pasar el botón principal (#cta-principal) (Gracias)
  // Si la página tiene agenda (#agenda), se esconde al llegar a ella para no tapar el calendario.
  var bar = document.getElementById('sticky-cta');
  if (!bar) return;
  var cta = document.getElementById('cta-principal');
  var agenda = document.getElementById('agenda');
  var onScroll = bar.getAttribute('data-show') === 'scroll';
  var shown = false, atAgenda = false;

  bar.hidden = false;
  function update() { bar.classList.toggle('is-visible', shown && !atAgenda); }

  if (onScroll || !cta || !('IntersectionObserver' in window)) {
    var check = function () { shown = window.scrollY > 120; update(); };
    window.addEventListener('scroll', check, { passive: true });
    check();
  } else {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      shown = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    }).observe(cta);
  }

  if (agenda && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      atAgenda = entries[0].isIntersecting;
      update();
    }, { rootMargin: '0px 0px -30% 0px' }).observe(agenda);
  }
})();
