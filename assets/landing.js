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

// Aparición suave de los bloques al scrollear
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var items = document.querySelectorAll(
    '.landing section:not(.hero):not(.confirm) .section-head, .case-grid, .cases-foot, .faq-list, .more-card, ' +
    '.pillar, .calendar-card'
  );
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  items.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });

  // Respaldo: si se saltea un bloque (por ejemplo con el link a #agenda), se muestra igual
  function revealPassed() {
    var pending = document.querySelectorAll('.reveal:not(.is-in)');
    if (!pending.length) { window.removeEventListener('scroll', revealPassed); return; }
    pending.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('is-in'); io.unobserve(el); }
    });
  }
  window.addEventListener('scroll', revealPassed, { passive: true });
})();

// Calendario diferido: el iframe de GHL (y su script) se cargan cuando la agenda está cerca o al tocar "Agendar"
(function () {
  var cal = document.querySelector('iframe[data-src]');
  if (!cal) return;
  var listo = false;
  function cargar() {
    if (listo) return;
    listo = true;
    cal.src = cal.getAttribute('data-src');
    var s = document.createElement('script');
    s.src = 'https://link.msgsndr.com/js/form_embed.js';
    document.body.appendChild(s);
  }
  document.querySelectorAll('a[href="#agenda"]').forEach(function (a) { a.addEventListener('click', cargar); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { cargar(); io.disconnect(); } }, { rootMargin: '1200px 0px' });
    io.observe(cal);
  } else {
    cargar();
  }
})();
