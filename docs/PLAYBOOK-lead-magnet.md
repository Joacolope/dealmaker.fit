# Playbook · Lead magnet de plan.dealmakerconsulting.com

Réplica del embudo de `plan.speaksellers.com` para **DealMaker FIT**. Misma arquitectura, mismas reglas de tracking y
el mismo sistema de diseño; cambia el contenido (Roadmap DealMaker FIT, 4 etapas, fuente: `ETAPAS.pdf`).

## Piezas

| Pieza | URL (subdominio) | Archivo |
|---|---|---|
| Landing con formulario (4 pasos) | `/` | `plan/index.html`, `plan/app.js`, `plan/plan.css` |
| Endpoint que califica | `POST /api/recurso` | `api/recurso.js`, `api/_meta-capi.js` |
| Confirmación 1 (no califica) | `/confirmacion-1?e=1&c=…` | `plan/confirmacion-1/index.html` |
| Confirmación 2 (califica) | `/confirmacion-2?e=N&c=…&v=…` | `plan/confirmacion-2/index.html` |
| Roadmap por etapa | `/roadmap/<slug>` y `/roadmap/<slug>.pdf` | `plan/roadmap/` |

Slugs: `tecnico` (Etapa 01), `crecimiento` (02), `emprendedor` (03), `empresario` (04).
`/roadmap?e=N&c=…` redirige al documento de la etapa N.

## Formulario y calificación

Desde el 2026-11-11, inspirado en ivansanchezcoach.com: arranca con un toque (sin escribir) y todo el contacto va al final.
Solo una barra de progreso amarilla (sin "Paso X de 4" ni porcentaje) y flecha para volver; opciones con círculo de selección.
Desde el 2026-11-16 son 4 preguntas (se sacó "¿Ya trabajás con clientes?"), con las opciones de la referencia que pasó el usuario, en argentino.

1. ¿Hoy a qué te dedicás? `online` (Entrenador online) / `entrenador` (Entrenador personal o profe de gimnasio) /
   `empleado` (Empleado en relación de dependencia) / `nutricionista` / `kinesiologo` / `estudiante` (Todavía estoy estudiando).
   Empleado y estudiante no califican. `otro` y `osteopata` son opciones viejas que el servidor sigue aceptando (otro no califica).
2. ¿Cuánto estás generando al mes? (USD) `nada` (Todavía nada) / `menos-1000` / `1000-2000` / `2000-3000` / `3000-4000` / `4000-5000` / `mas-5000`.
   Etapa: nada o menos de 1.000 → 1 · 1.000 a 3.000 → 2 · 3.000 a 5.000 → 3 · más de 5.000 → 4.
   `ejerce` ya no se pregunta: el formulario lo manda como `no` si eligió "Todavía nada" y `si` en el resto.
3. ¿En qué sentís que necesitás más ayuda? `captar` / `estables` / `presencial` / `organico` / `publicidad` / `equipo`.
   Llega a GHL y a la base como `bottleneck` (el valor) y `bottleneck_texto` (la frase de la opción), y arma el mensaje de WhatsApp
   de la confirmación 2 ("donde más ayuda necesito es en …"). Las opciones viejas siguen aceptadas en el servidor.
4. Nombre · Email · país + WhatsApp · Instagram, todos obligatorios (el país se completa solo por IP o zona horaria). "Recibir mi roadmap" envía.

A GHL llegan **solo los leads que califican**, recién al terminar el paso 4. El que abandona en las preguntas no se guarda.

`califica = facturacion` de 1.000 USD o más `&& profesion` no es `empleado`, `estudiante` ni `otro` (desde el 2026-11-16).
El paso 3 (ayuda) se guarda y viaja a GHL, pero no califica ni descalifica. No se manda a Meta.
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
