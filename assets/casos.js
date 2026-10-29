// Casos de éxito: lista única para la Presentación y Gracias.
// Para sumar o cambiar un testimonio, editar solo esta lista.
//   video: { loom: '<id del embed>', thumb: '<url de la miniatura>', ratio: alto/ancho }  (ratio 1.7931 = vertical, 0.5625 = horizontal)
//      o:  { drive: '<id del archivo de Drive>' }
var CASOS = [
  { name: 'Cris', win: '', video: { loom: '0866776f2dcc4bf59a95c366e026fd9f', thumb: 'https://cdn.loom.com/sessions/thumbnails/0866776f2dcc4bf59a95c366e026fd9f-ea10ec0864f0c3b2.jpg', ratio: 1.7778 } },
  { name: 'Juan Cruz', win: '', video: { loom: '4063144bda0141b597df2a1e25b21220', thumb: 'https://cdn.loom.com/sessions/thumbnails/4063144bda0141b597df2a1e25b21220-49e2c98ac702b65d.jpg', ratio: 1.7778 } },
  { name: 'Jan', win: 'Definió su cliente ideal y creció rápido', video: { loom: '1373f3e982fc4320b3ace29aea92a7b7', thumb: 'https://cdn.loom.com/sessions/thumbnails/1373f3e982fc4320b3ace29aea92a7b7-227f6c6862ad6898.jpg', ratio: 0.5625 } },
  { name: 'Tatto', win: '', video: { loom: 'b45b99d4c2c644dca0ef3c7d92fe7cdb', thumb: 'https://cdn.loom.com/sessions/thumbnails/b45b99d4c2c644dca0ef3c7d92fe7cdb-8fb555347e0626da.jpg', ratio: 1.7931 } },
  { name: 'Martín Rodríguez', win: 'Ordenó sus objetivos y empezó a vender más', video: { loom: '1311b4eba57e48438d8b25e5ccdcedc3', thumb: 'https://cdn.loom.com/sessions/thumbnails/1311b4eba57e48438d8b25e5ccdcedc3-36f6064b96cccf20.jpg', ratio: 1.7778 } },
  { name: 'Gonza', win: 'Llevó su servicio a otro nivel', video: { loom: '354073a7275048ac894d8799566b0d48', thumb: 'https://cdn.loom.com/sessions/thumbnails/354073a7275048ac894d8799566b0d48-40d9f326fa741601.jpg', ratio: 1.7778 } },
  { name: 'Héctor', win: 'Triplicó sus resultados', video: { loom: '704f980c5e744b8f90d2865d098783c2', thumb: 'https://cdn.loom.com/sessions/thumbnails/704f980c5e744b8f90d2865d098783c2-cd9fcadc5675b578.jpg', ratio: 1.7931 } },
  { name: 'Carlos', win: 'Ganó claridad y mejoró sus resultados', video: { loom: '8a06a9996dad446b9158ffe9697d8271', thumb: 'https://cdn.loom.com/sessions/thumbnails/8a06a9996dad446b9158ffe9697d8271-4bc25ee1e174a2fd.jpg', ratio: 0.5625 } },
  { name: 'Yuki', win: 'Hizo crecer su marca personal con estructura', video: { loom: 'be390ac0ae564a0ea97393b2f399b60d', thumb: 'https://cdn.loom.com/sessions/thumbnails/be390ac0ae564a0ea97393b2f399b60d-89875e5e50895e2e.jpg', ratio: 1.7778 } },
  { name: 'Lucas', win: 'Armó su estrategia para sumar más clientes', video: { loom: '5ccca0b574224b8eb1ec6154bea6fb29', thumb: 'https://cdn.loom.com/sessions/thumbnails/5ccca0b574224b8eb1ec6154bea6fb29-9d05dc1c5995d0a6.jpg', ratio: 1.7778 } },
  { name: 'Ramón', win: 'Pasó a triplicar sus ingresos', video: { drive: '10BAWPkZkqKmNkQRt0q8w1L0WGZ4Y6ZVf' } },
  { name: 'Ian', win: 'Alcanzó su pico de facturación', video: { drive: '14IiviRlMXaPP-tgTXE7XskqFfFV-tkoB' } },
  { name: 'Andrés', win: 'Logró su independencia económica', video: { drive: '1zyf4gA5hiBG6gIoVl5q3NO_mAf0_Y3N4' } },
  { name: 'Nahue', win: 'Estructuró su servicio y pudo cobrar más', video: { drive: '1cDeagsvxRVpSto-B64b_iycz40-FeLK4' } },
  { name: 'Joaco', win: 'Encontró su nicho y duplicó sus clientes', video: { drive: '1NN8__eFnn6E5q-TiZ6Uwb5Xtudb6SH99' } },
  { name: 'Coco', win: 'Multiplicó por 5 sus resultados', video: { drive: '1N32JAim9Ty_RAWNRGstRQQ4iexUDwzWI' } }
];

(function () {
  var grid = document.querySelector('[data-casos]');
  if (!grid) return;

  function videoInfo(v) {
    if (v.loom) return { src: 'https://www.loom.com/embed/' + v.loom + '?autoplay=1&hide_owner=true&hide_share=true&hide_title=true', thumb: v.thumb, ratio: v.ratio || 1.7778 };
    return { src: 'https://drive.google.com/file/d/' + v.drive + '/preview', thumb: 'https://drive.google.com/thumbnail?id=' + v.drive + '&sz=w640', ratio: 1.7778 };
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  grid.innerHTML = CASOS.map(function (c, i) {
    var v = videoInfo(c.video);
    return '<article class="case">' +
      '<button type="button" class="case-video" data-caso="' + i + '" aria-label="Ver testimonio de ' + esc(c.name) + '">' +
        '<img src="' + esc(v.thumb) + '" alt="" loading="lazy">' +
        '<span class="case-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>' +
      '</button>' +
      '<div class="case-body">' +
        '<p class="case-name">' + esc(c.name) + '</p>' +
        (c.win ? '<h3 class="case-win">' + esc(c.win) + '</h3>' : '') +
      '</div>' +
    '</article>';
  }).join('');

  // Reproductor en ventana: respeta si el video es vertical u horizontal
  var modal = document.createElement('div');
  modal.className = 'case-modal';
  modal.hidden = true;
  modal.innerHTML = '<div class="case-modal-backdrop" data-close></div>' +
    '<div class="case-modal-box" role="dialog" aria-modal="true"><button type="button" class="case-modal-close" data-close aria-label="Cerrar">&times;</button><div class="case-modal-frame"></div></div>';
  document.body.appendChild(modal);
  var frame = modal.querySelector('.case-modal-frame');

  function open(i) {
    var v = videoInfo(CASOS[i].video);
    frame.style.setProperty('--ratio', v.ratio);
    frame.innerHTML = '<iframe src="' + esc(v.src) + '" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen title="Testimonio de ' + esc(CASOS[i].name) + '"></iframe>';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    modal.hidden = true;
    frame.innerHTML = '';
    document.body.style.overflow = '';
  }
  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-caso]');
    if (btn) open(+btn.getAttribute('data-caso'));
  });
  modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
})();
