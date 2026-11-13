# Playbook · Lead magnet de plan.dealmakerconsulting.com

Réplica del embudo de `plan.speaksellers.com` para **DealMaker FIT**. Misma arquitectura, mismas reglas de tracking y
el mismo sistema de diseño; cambia el contenido (Roadmap DealMaker FIT, 4 etapas, fuente: `ETAPAS.pdf`).

## Piezas

| Pieza | URL (subdominio) | Archivo |
|---|---|---|
| Landing con formulario (5 pasos) | `/` | `plan/index.html`, `plan/app.js`, `plan/plan.css` |
| Endpoint que califica | `POST /api/recurso` | `api/recurso.js`, `api/_meta-capi.js` |
| Confirmación 1 (no califica) | `/confirmacion-1?e=1&c=…` | `plan/confirmacion-1/index.html` |
| Confirmación 2 (califica) | `/confirmacion-2?e=N&c=…&v=…` | `plan/confirmacion-2/index.html` |
| Roadmap por etapa | `/roadmap/<slug>` y `/roadmap/<slug>.pdf` | `plan/roadmap/` |

Slugs: `tecnico` (Etapa 01), `crecimiento` (02), `emprendedor` (03), `empresario` (04).
`/roadmap?e=N&c=…` redirige al documento de la etapa N.

## Formulario y calificación

Desde el 2026-11-11, inspirado en ivansanchezcoach.com: arranca con un toque (sin escribir) y todo el contacto va al final.
Barra con "Paso X de 5", porcentaje y flecha para volver arriba a la izquierda; opciones con círculo de selección.

1. ¿Hoy a qué te dedicás? `entrenador` (Entrenador / coach presencial) / `nutricionista` / `online` (Entrenador online) / `otro`
   (las 4 de ivansanchezcoach.com, desde el 2026-11-11; "Otro" también califica)
2. ¿Ya trabajás como <profesión> con clientes? `si` / `no`
3. ¿Cuánto facturás hoy por mes? `menos-1000` / `1000-2000` / `2000-3000` / `3000-4000` / `4000-5000` / `mas-5000`
   (de a $1k desde el 2026-11-11). Etapa: menos de $1k → 1 · $1k a $3k → 2 · $3k a $5k → 3 · más de $5k → 4.
   Si en el paso 2 respondió `no`, este paso se saltea y la facturación queda en `menos-1000`.
4. ¿Cuál es tu principal desafío hoy en día? En lenguaje simple, sin "leads": `clientes` / `contenido` / `convertir` / `precios` / `tiempo`.
   Llega a GHL y a la base como `bottleneck` (el valor) y `bottleneck_texto` (la frase de la opción), y arma el mensaje de WhatsApp
   de la confirmación 2 ("mi principal desafío es …"). Las opciones viejas siguen aceptadas en el servidor.
5. Nombre · Email · país + WhatsApp · Instagram, todos obligatorios (el país se completa solo por IP o zona horaria). "Recibir mi roadmap" envía.

A GHL llegan **solo los leads que califican**, recién al terminar el paso 5. El que abandona en las preguntas no se guarda.

`califica = facturacion !== "menos-1000"` (el que no trabaja con clientes queda en `menos-1000`). Desde el 2026-11-11 la profesión no descalifica.
El paso 4 (desafío) se guarda y viaja a GHL, pero no califica ni descalifica. No se manda a Meta.
No califica → confirmación 1 con el botón a su roadmap. Solo el que califica → confirmación 2 (WhatsApp)
y Lead por CAPI. La etapa (qué documento recibe) sale siempre de la facturación.

## Diferencias con el original

- **Datos:** en vez de Supabase, todo registro queda en Neon y cada lead **calificado** además va al **Inbound Webhook de GoHighLevel** (`GHL_WEBHOOK_URL`), que manda la notificación.
  Como no hay base propia, el "repetido" lo resuelve GHL (contacto por email) y Meta (mismo `event_id` por email).
  Lleva: contacto, respuestas (`ejerce`, `profesion`, `facturacion`, `bottleneck`, cada una con su `_texto`), etapa,
  `utm_source/medium/campaign/content/term/id`, `fbclid`, `fbc`, `fbp`, `ip`, `user_agent`, `event_id`, `pagina` y `prueba`.
- **Mail:** no se manda. El no calificado tiene el botón directo a su roadmap en la confirmación 1.
- **Práctica constante (roleplay):** el roadmap de DealMaker no la define, así que las etapas no tienen esa hoja.
  Cada etapa cierra con su trampa, su señal de avance y lo que hace falta para pasar a la siguiente.
- **Acento:** amarillo `#FFEE07`. Sobre blanco no se lee como texto, así que se usa como marcador/subrayado; en las
  hojas oscuras, los títulos van con el degradado amarillo.
- **GTM:** el subdominio no carga GTM; solo el píxel `1034841362227406` con PageView (eventos automáticos apagados).

## Variables de entorno (Vercel, Sensitive)

`GHL_WEBHOOK_URL` · `META_CAPI_TOKEN` · `META_PIXEL_ID` (opcional, por defecto 1034841362227406) · `META_TEST_EVENT_CODE` (opcional).

Base propia: cada registro (califique o no) va a **Neon** (Vercel Marketplace, recurso `dealmaker-leads`, tabla
`roadmap_registros`, `docs/neon-roadmap.sql`) y de respaldo a Vercel Blob privado (`dealmaker-leads`). Ver `api/_leads.js`.
Exportar a CSV: `node herramientas/exportar-leads.js leads.csv [--calificados]` (lee `DATABASE_URL` de `.env.local`).
El Lead a Meta sale de `/api/recurso` por CAPI (no del workflow de GHL), en paralelo con GHL y aunque GHL falle.
Si Meta no responde, se reintenta en el momento (2 intentos) y, si igual falla, el cron diario `/api/reintentar-meta`
(12:00 UTC, `CRON_SECRET`) lo vuelve a mandar desde Neon con el mismo `event_id`, hasta 7 días.
Para reenviar calificados que no llegaron (máx. 7 días): exportar el CSV de GHL y correr
`node herramientas/reenviar-leads-meta.js leads.csv --probar` (después sin `--probar`, con `META_CAPI_TOKEN`).

## Pruebas

Siempre con emails `@resend.dev` y `utm_source=prueba-tecnica`. Un lead de prueba que califica solo manda Lead a Meta
si viene `test_event_code` (cae en "Probar eventos").
En la vista previa de Vercel, `/?plan=1` hace que ese navegador vea el subdominio; `/?plan=0` lo apaga.

## Mantenimiento

- Texto del roadmap: solo `plan/roadmap/etapas.js`. Después, regenerar los PDFs:
  `npx serve -l 4190 plan` y `bash herramientas/armar-roadmap-pdf.sh`.
- Vista previa del hero: tarjetas dibujadas con HTML/CSS en `plan/index.html` (`.previa`, `.hoja`), sin imágenes. `plan/previa-portada.webp` queda solo para `og:image`.
- Prueba social: testimonios en video desde `/assets/casos.js` (misma lista que la landing principal) y portadas de casos en `plan/casos/*.webp` (720 × 900).
- Vista local igual a producción: `node herramientas/servir-plan.js` (puerto 4191; sirve `/plan` en la raíz y `/assets`).
- Número de WhatsApp, mensaje y desafío: `plan/confirmacion-2/index.html`.
