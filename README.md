# dealmaker.fit

Embudo de dealmakerconsulting.com como sitio estático en Vercel (réplica de las páginas de GoHighLevel).

Estilo: paleta DealMaker sobre fondo blanco (texto `#0A0A0A`, acento amarillo `#FFEE07`) y tipografía estilo Apple (SF Pro, con Inter como respaldo). Variables en `assets/base.css`. Logo y favicon: `assets/logo-dm.svg`.

| Paso | Ruta | Archivo |
|---|---|---|
| Presentación | `/` (y `/presentacion`) | `index.html` |
| Agenda | `/booking-page` | `booking-page.html` |
| Gracias | `/gracias` | `gracias.html` |
| Página de nutrición | `/nutrigr-704299` | `nutrigr-704299.html` |
| No califica | `/nc` | `nc.html` |

## Flujo

1. **Presentación**: hero + VSL, debajo el botón "Agendar llamada" (la promesa aparece en la barra fija al scrollear), casos de éxito, preguntas frecuentes y al final el calendario de GHL (`#agenda`). Todos los botones bajan al calendario.
2. **Agenda**: calendario de GHL `Sesión de Diagnóstico Profesional` (`JdrYfF1pF3JpMgoEW1Sv`).
   La redirección después de agendar se configura en GHL (Calendario → Confirmación → redirect a `/gracias`).
3. **Gracias**: confirmación por WhatsApp (tarjeta + barra fija), videos antes de la llamada, propuesta de valor, preguntas y casos de éxito. Usa el mismo diseño que la Presentación (`assets/landing.css` + `assets/gracias.css`).
4. **Nutrición**: videos previos a la llamada + botón de WhatsApp.

## Videos

Los espacios de video están vacíos: buscar `data-video-slot` y reemplazar `src="about:blank"`
(o `data-src="about:blank"` en nutrición) por la URL del embed.

## Tracking

Google Tag Manager `GTM-NQ8RKDRH` en todas las páginas (desde ahí cargan GA4 y el pixel de Meta).

## Deploy

Vercel, proyecto conectado a este repo. Cada push a `main` despliega.

## Test A/B del título

En la Presentación cada visitante ve una de dos promesas (título y texto del botón), sorteada 50/50 y recordada en su navegador:

- **A:** "Convertí tu profesión en un negocio de $60.000 al año en 4 meses"
- **B:** "Convertí tu profesión en un negocio online de $60K al año en 4 meses"

Para ver una variante a mano: `/?v=a` o `/?v=b`. La variante viaja en el PageView del pixel `1034841362227406`
como parámetro `headline_variant` y en el dataLayer (evento `headline_variant`). Los textos están en `index.html`
(clases `headline-a` / `headline-b`).

## Pixel

Meta Pixel `1034841362227406` cargado directo en todas las páginas, solo con PageView (eventos automáticos desactivados con `autoConfig`). GTM sigue cargando además el pixel
`1083063284052786` con sus propios eventos.

## Casos de éxito

La lista de testimonios está en `assets/casos.js` (una sola lista para la Presentación y Gracias).
Cada caso tiene nombre, resultado (opcional) y video: Loom (`loom`, `thumb`, `ratio` alto/ancho) o Drive (`drive`).
Al tocar un caso el video se abre en una ventana respetando si es vertical u horizontal.
