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

1. Nombre · Email · Instagram · país + WhatsApp, todos obligatorios (el país se completa solo por IP o zona horaria; si no se detecta, hay que elegirlo). Se valida el formato y pasa a las preguntas; todavía no se envía nada.
2. ¿Cuál es tu profesión? `entrenador` (Coach fitness) / `nutricionista` / `kinesiologo` / `osteopata` / `otro`
3. ¿Ya trabajás como <profesión> con clientes? `si` / `no`
4. ¿Cuánto facturás hoy por mes? `menos-1000` / `1000-3000` / `3000-5000` / `mas-5000` → define la etapa 1 a 4.
   Si en el paso 3 respondió `no`, este paso se saltea y la facturación queda en `menos-1000`.
5. ¿Cuándo querés empezar a llevar tu profesión a lo online? `ahora` / `3-meses` / `mirando` → al tocar la respuesta se envía.

El lead llega a GHL recién al terminar el paso 5: quien deja los datos y abandona en las preguntas no se guarda.

`califica = profesion !== "otro" && ejerce === "si" && facturacion !== "menos-1000" && momento !== "mirando"`.
Cualquier respuesta negativa → confirmación 1 con el botón a su roadmap. Solo el que califica → confirmación 2 (WhatsApp)
y Lead por CAPI. La etapa (qué documento recibe) sale siempre de la facturación.

## Diferencias con el original

- **Datos:** en vez de Supabase, cada lead se manda a un **Inbound Webhook de GoHighLevel** (`GHL_WEBHOOK_URL`).
  Como no hay base propia, el "repetido" lo resuelve GHL (contacto por email) y Meta (mismo `event_id` por email).
- **Mail:** no se manda. El no calificado tiene el botón directo a su roadmap en la confirmación 1.
- **Práctica constante (roleplay):** el roadmap de DealMaker no la define, así que las etapas no tienen esa hoja.
  Cada etapa cierra con su trampa, su señal de avance y lo que hace falta para pasar a la siguiente.
- **Acento:** amarillo `#FFEE07`. Sobre blanco no se lee como texto, así que se usa como marcador/subrayado; en las
  hojas oscuras, los títulos van con el degradado amarillo.
- **GTM:** el subdominio no carga GTM; solo el píxel `1034841362227406` con PageView (eventos automáticos apagados).

## Variables de entorno (Vercel, Sensitive)

`GHL_WEBHOOK_URL` · `META_CAPI_TOKEN` · `META_PIXEL_ID` (opcional, por defecto 1034841362227406) · `META_TEST_EVENT_CODE` (opcional).

## Pruebas

Siempre con emails `@resend.dev` y `utm_source=prueba-tecnica`. Un lead de prueba que califica solo manda Lead a Meta
si viene `test_event_code` (cae en "Probar eventos").
En la vista previa de Vercel, `/?plan=1` hace que ese navegador vea el subdominio; `/?plan=0` lo apaga.

## Mantenimiento

- Texto del roadmap: solo `plan/roadmap/etapas.js`. Después, regenerar los PDFs:
  `npx serve -l 4190 plan` y `bash herramientas/armar-roadmap-pdf.sh`.
- Imagen de vista previa: `plan/previa-*.webp` son capturas de hojas reales (`/roadmap/crecimiento?solo=<sección>`).
- Número de WhatsApp, mensaje y cuello de botella por etapa: `plan/confirmacion-2/index.html`.
