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

1. **Presentación**: hero + VSL, debajo la promesa con el botón "Agendar llamada", casos de éxito, preguntas frecuentes y al final el calendario de GHL (`#agenda`). Todos los botones bajan al calendario.
2. **Agenda**: calendario de GHL `Sesión de Diagnóstico Profesional` (`JdrYfF1pF3JpMgoEW1Sv`).
   La redirección después de agendar se configura en GHL (Calendario → Confirmación → redirect a `/gracias`).
3. **Gracias** / **Nutrición**: contenido + botón de WhatsApp.

## Videos

Los espacios de video están vacíos: buscar `data-video-slot` y reemplazar `src="about:blank"`
(o `data-src="about:blank"` en nutrición) por la URL del embed.

## Tracking

Google Tag Manager `GTM-NQ8RKDRH` en todas las páginas (desde ahí cargan GA4 y el pixel de Meta).

## Deploy

Vercel, proyecto conectado a este repo. Cada push a `main` despliega.
