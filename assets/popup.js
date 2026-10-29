// Abre/cierra el popup del formulario de calificación
(function () {
  var popup = document.getElementById('popup');
  if (!popup) return;
  function open() { popup.hidden = false; document.body.style.overflow = 'hidden'; }
  function close() { popup.hidden = true; document.body.style.overflow = ''; }
  document.querySelectorAll('[data-open-popup]').forEach(function (el) { el.addEventListener('click', open); });
  document.querySelectorAll('[data-close-popup]').forEach(function (el) { el.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
