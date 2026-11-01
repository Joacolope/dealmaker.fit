// Contenido del Roadmap DealMaker FIT (fuente: ETAPAS.pdf). Para cambiar texto se toca solo este archivo.
// Bloques: {p}, {lista:[]}, {lineas:[]}, {grande}, {cita}, {cadena:[]}, {preguntas:[]}
window.RECURSO_NOMBRE = 'Roadmap DealMaker FIT';
window.AGENDA = 'https://dealmakerconsulting.com/#agenda';

// Valor del formulario -> texto legible
window.RANGO = {
  'menos-1000': 'menos de $1k',
  '1000-3000': 'entre $1k y $3k',
  '3000-5000': 'entre $3k y $5k',
  'mas-5000': 'más de $5k',
};

window.ETAPAS = [
  {
    n: 1, slug: 'tecnico', nombre: 'Profesional Técnico', rango: '$0 – $1k / mes', c: 'menos-1000',
    corto: 'Sabés ejercer tu profesión. Todavía no sabés convertirla en un negocio online.',
    cita: '“Sé hacer mi trabajo, pero todavía no sé convertirlo en negocio.”',
    comoSeVe: [
      { p: 'Esta persona puede estar recién recibida. O puede tener varios años de experiencia profesional.' },
      { p: 'La diferencia no está necesariamente en cuánto sabe sobre nutrición, entrenamiento, kinesiología, osteopatía o rendimiento. Está en cuánto desarrolló la parte empresarial.' },
      { p: 'Normalmente:' },
      { lista: ['tiene pocos clientes;', 'trabaja principalmente de forma presencial;', 'intercambia tiempo por dinero;', 'depende de consultas o sesiones individuales;', 'todavía no tiene un nicho realmente definido;', 'no tiene una oferta validada;', 'no sabe vender con consistencia;', 'no tiene un proceso comercial;', 'genera poco o ningún contenido;', 'sabe que debería desarrollar algo online, pero no sabe cómo empezar.'] },
      { p: 'Puede tener conocimientos excelentes. Pero comercialmente está empezando.' },
    ],
    problema: [
      { p: 'El problema no es:' }, { cita: '“Necesito escalar.”' },
      { p: 'Todavía no hay nada para escalar. El problema es:' },
      { grande: 'NECESITO VALIDAR.' },
      { p: 'Validar que existe un mercado dispuesto a pagar por una solución concreta.' },
    ],
    prioridad: 'FUNDACIONES + IMPLEMENTACIÓN',
    prioridadBloques: [
      { p: 'Antes de pensar en:' },
      { lista: ['automatizaciones;', 'setters;', 'closers;', 'publicidad;', 'equipos;', 'funnels complejos;'] },
      { p: 'necesita responder preguntas mucho más básicas.' },
      { preguntas: ['¿A quién ayudo?', '¿Qué problema resuelvo?', '¿Qué vendo?', '¿Cómo lo entrego?', '¿Por qué alguien pagaría por esto?'] },
    ],
    partes: [
      { titulo: 'Nicho', bloques: [
        { p: 'Definir una persona suficientemente concreta.' },
        { p: 'No:' }, { cita: '“Ayudo a personas a mejorar su salud.”' },
        { p: 'Sino algo más cercano a:' }, { cita: '“Ayudo a corredores amateurs que quieren mejorar rendimiento y recuperación.”' },
        { p: 'El objetivo no es encerrarse para siempre. Es conseguir claridad suficiente para aprender del mercado.' },
      ] },
      { titulo: 'Cliente ideal', bloques: [
        { p: 'Entender:' },
        { lista: ['qué quiere;', 'qué problema tiene;', 'qué ya intentó;', 'qué objeciones tiene;', 'qué estaría dispuesto a pagar;', 'qué resultado considera valioso.'] },
      ] },
      { titulo: 'Oferta', bloques: [
        { p: 'Dejar de vender únicamente:' },
        { lista: ['sesiones;', 'consultas;', 'horas.'] },
        { p: 'Y empezar a vender:' },
        { grande: 'UN PROCESO.' },
        { lineas: ['Problema.', 'Resultado.', 'Duración.', 'Metodología.', 'Precio.'] },
      ] },
      { titulo: 'Primeras ventas', bloques: [
        { p: 'En esta etapa el objetivo no es construir una empresa enorme. Es conseguir evidencia.' },
        { lineas: ['Personas reales.', 'Pagando dinero real.', 'Por una solución real.'] },
      ] },
      { titulo: 'Los primeros 10 clientes', bloques: [
        { p: 'Una referencia importante para salir de esta etapa es haber trabajado aproximadamente con los primeros:' },
        { grande: '10 CLIENTES.' },
        { p: '¿Por qué? Porque esos primeros clientes empiezan a darte información que ningún curso puede darte. Te enseñan:' },
        { lista: ['qué quieren realmente;', 'por qué compran;', 'qué objeciones aparecen;', 'dónde falla tu servicio;', 'qué resultado valoran;', 'qué contenido podría interesarles.'] },
      ] },
      { titulo: 'Empezar a crear contenido', bloques: [
        { lineas: ['No para hacerse viral.', 'No para ser influencer.', 'No para conseguir 100.000 seguidores.'] },
        { p: 'Sino para empezar a construir demanda. El objetivo inicial es aprender:' },
        { lista: ['qué temas llaman la atención;', 'qué problemas resuenan;', 'qué preguntas aparecen;', 'qué mensaje atrae al cliente correcto.'] },
      ] },
    ],
    trampas: [
      { titulo: 'Prepararte eternamente', bloques: [
        { lineas: ['Otro curso.', 'Otra certificación.', 'Otra mentoría.', 'Otro video.', 'Otra semana esperando sentirte listo.'] },
        { p: 'Mientras tanto:' },
        { lineas: ['cero conversaciones.', 'cero ventas.', 'cero feedback del mercado.'] },
      ], frase: 'La preparación sin implementación se convierte en procrastinación sofisticada.' },
    ],
    extra: [
      { titulo: 'Lo que no necesitás', bloques: [{ p: 'Más teoría antes de moverte.' }] },
      { titulo: 'Lo que necesitás', bloques: [{ lineas: ['Más implementación.', 'Más conversaciones.', 'Más contenido.', 'Más ofertas.', 'Más clientes reales.', 'Más feedback.'] }] },
    ],
    senal: [
      { p: 'Sabés que estás saliendo de Profesional Técnico cuando:' },
      { lista: ['definiste un nicho;', 'entendés mejor a tu cliente;', 'tenés una oferta;', 'ya vendiste online;', 'trabajaste con aproximadamente 10 clientes;', 'empezaste a crear contenido;', 'dejaste de preguntarte si alguien pagaría.'] },
      { p: 'Porque ya pagaron.' },
    ],
    siguiente: [
      { p: 'Tu objetivo ahora es dejar de vender de manera aislada. Ya validaste. Ahora necesitás:' },
      { grande: 'REPETIBILIDAD.' },
    ],
    resumen: { problema: 'validación', prioridad: 'nicho + oferta + primeros clientes', trampa: 'estudiar eternamente', objetivo: 'primeros 10 clientes + primeras ventas online' },
    transicion: { de: 'Profesión', a: 'Oferta', p: 'De saber hacer algo a saber vender una solución.' },
    principio: ['Un Profesional Técnico no necesita obsesionarse con contratar equipo.', 'Necesita clientes.'],
  },

  {
    n: 2, slug: 'crecimiento', nombre: 'Profesional en Crecimiento', rango: '$1k – $3k / mes', c: '1000-3000',
    corto: 'Ya validaste que alguien está dispuesto a pagarte online. Ahora necesitás convertir ventas aisladas en un sistema.',
    cita: '“Ya validé que puedo vender online, pero todavía no tengo previsibilidad.”',
    comoSeVe: [
      { p: 'Este profesional ya tiene algo funcionando. Tiene:' },
      { lista: ['nicho relativamente definido;', 'oferta;', 'primeros clientes;', 'experiencia;', 'ventas online;', 'cierta validación.'] },
      { p: 'Puede vender, por ejemplo:' },
      { lista: ['programas trimestrales;', 'acompañamientos;', 'coaching;', 'servicios digitales;', 'procesos de $200, $300, $500 o tickets similares.'] },
      { p: 'El problema es que todavía hay mucho desorden.' },
      { sub: 'Puede estar en dos escenarios' },
      { sub2: 'Escenario A · Ya vende online' },
      { p: 'Pero:' },
      { lista: ['factura inconsistentemente;', 'algunos meses vende y otros no;', 'no sabe exactamente por qué;', 'publica contenido genérico;', 'no conoce sus métricas;', 'no tiene un proceso comercial definido;', 'depende mucho de sí mismo;', 'su servicio puede ser mediocre;', 'consigue clientes, pero pierde muchos.'] },
      { sub2: 'Escenario B · Tiene un negocio presencial estancado' },
      { p: 'Puede tener:' },
      { lista: ['muchos clientes;', 'años de experiencia;', 'reputación;', 'buen conocimiento técnico.'] },
      { p: 'Pero llegó al techo del modelo. Más ingresos significan:' },
      { grande: 'MÁS HORAS.' },
      { lineas: ['Más pacientes.', 'Más sesiones.', 'Más tiempo dentro del consultorio o gimnasio.'] },
      { p: 'Sabe que necesita desarrollar la parte online. Pero todavía no sabe cómo convertir toda su experiencia en un sistema digital.' },
    ],
    problema: [
      { p: 'Ya no necesita responder:' }, { cita: '“¿Alguien pagaría por esto?”' },
      { p: 'Eso ya está validado. Ahora necesita responder:' },
      { grande: '“¿CÓMO HAGO PARA QUE ESTO OCURRA DE MANERA CONSISTENTE?”' },
    ],
    prioridad: 'CONVERTIR VENTAS AISLADAS EN SISTEMA.',
    prioridadBloques: [],
    partes: [
      { titulo: 'Mini Brand Funnel', bloques: [
        { p: 'El objetivo no es construir una marca gigantesca. El objetivo es desarrollar una marca personal:' },
        { lista: ['pequeña;', 'específica;', 'relevante;', 'comercialmente útil.'] },
        { p: 'Una marca que consiga que la persona correcta:' },
        { lineas: ['te descubra;', 'entienda qué hacés;', 'confíe;', 'y termine conversando con vos.'] },
        { sub2: 'El Mini Brand Funnel' },
        { p: 'El recorrido debería empezar a verse así:' },
        { cadena: ['Contenido', 'Atención correcta', 'Confianza', 'Conversación', 'Calificación', 'Llamada / venta'] },
        { p: 'No necesitás ser famoso. Necesitás crear:' },
        { grande: 'DEMANDA.' },
      ] },
      { titulo: 'Contenido con intención comercial', bloques: [
        { p: 'El contenido deja de ser:' }, { cita: '“Hoy tengo que subir algo.”' },
        { p: 'Y empieza a responder una función. Puede trabajar:' },
        { lista: ['problemas;', 'deseos;', 'errores;', 'creencias;', 'objeciones;', 'casos;', 'mecanismos;', 'resultados.'] },
        { p: 'La pregunta deja de ser:' }, { cita: '“¿Qué publico?”' },
        { p: 'Y empieza a ser:' }, { cita: '“¿Qué necesita entender mi mercado para acercarse a una decisión?”' },
      ] },
      { titulo: 'Generación de conversaciones', bloques: [
        { p: 'El profesional tiene que dejar de esperar pasivamente que alguien le escriba. Debe aprender a:' },
        { lista: ['iniciar conversaciones;', 'responder interacciones;', 'utilizar historias;', 'hacer CTAs;', 'trabajar DMs;', 'detectar interés;', 'generar oportunidades.'] },
      ] },
      { titulo: 'Setting', bloques: [
        { p: 'No todo el que responde necesita una llamada. Hay que aprender:' },
        { lista: ['quién tiene fit;', 'quién tiene un problema real;', 'quién está preparado;', 'quién tiene intención;', 'cuándo continuar;', 'cuándo cortar.'] },
      ] },
      { titulo: 'Ventas', bloques: [
        { p: 'Tiene que aprender personalmente a vender su solución. Antes de querer delegar el cierre. Necesita:' },
        { lista: ['diagnosticar;', 'hacer preguntas;', 'comprender objeciones;', 'presentar su solución;', 'hacer seguimiento;', 'cerrar.'] },
      ] },
      { titulo: 'Métricas básicas', bloques: [
        { p: 'Empieza a dejar de dirigir el negocio mediante sensaciones. Tiene que conocer:' },
        { lista: ['conversaciones;', 'leads;', 'llamadas;', 'show rate;', 'cierres;', 'ticket;', 'revenue.'] },
      ] },
      { titulo: 'Mejorar el servicio', bloques: [
        { p: 'En esta etapa puede aparecer otro problema:' },
        { grande: 'TENER CLIENTES NO SIGNIFICA TENER UN BUEN NEGOCIO.' },
        { p: 'Puede haber conseguido decenas de clientes. Pero entregarles:' },
        { lista: ['poco seguimiento;', 'servicio genérico;', 'mala experiencia;', 'poca personalización;', 'poca continuidad.'] },
        { p: 'Esto destruye:' },
        { lista: ['resultados;', 'testimonios;', 'retención;', 'reputación;', 'backend.'] },
      ] },
    ],
    trampas: [
      { titulo: 'Pensar que el problema es falta de alcance', bloques: [
        { p: 'Entonces busca:' },
        { lista: ['más seguidores;', 'viralidad;', 'videos con millones de views;', 'tendencias;', 'automatizaciones;', 'delegar.'] },
        { p: 'Pero todavía no tiene un sistema comercial claro.' },
      ], frase: 'Más alcance sobre un sistema desordenado genera más desorden.' },
      { titulo: 'Delegar demasiado pronto', bloques: [
        { lineas: ['“Necesito un setter.”', '“Necesito un closer.”', '“Necesito automatizar.”'] },
        { p: 'Pero él mismo todavía no domina:' },
        { lista: ['abrir conversaciones;', 'vender;', 'calificar;', 'medir.'] },
      ], frase: 'No podés controlar aquello que todavía no entendés.' },
    ],
    extra: [],
    senal: [
      { p: 'Sabés que dejaste de ser simplemente un Profesional en Crecimiento cuando podés explicar:' },
      { lineas: ['de dónde vienen tus clientes;', 'cuántas conversaciones necesitás;', 'cómo las calificás;', 'cómo vendés;', 'cuánto convertís;', 'y qué variable necesitás mejorar.'] },
      { p: 'Dejás de decir:' }, { cita: '“Este mes vendí bastante.”' },
      { p: 'Y empezás a decir:' }, { cita: '“Mi sistema produjo X conversaciones, Y llamadas y Z ventas.”' },
    ],
    siguiente: [
      { p: 'Ahora necesitás convertir:' },
      { cadena: ['Sistema', 'Previsibilidad'] },
    ],
    resumen: { problema: 'inconsistencia', prioridad: 'Mini Brand Funnel + adquisición + ventas + métricas', trampa: 'perseguir viralidad y delegar demasiado pronto', objetivo: 'convertir ventas aisladas en un sistema' },
    transicion: { de: 'Oferta', a: 'Sistema', p: 'De conseguir clientes ocasionales a poder generar demanda.' },
    principio: ['Un Profesional en Crecimiento no necesita construir una empresa enorme.', 'Necesita previsibilidad.'],
  },

  {
    n: 3, slug: 'emprendedor', nombre: 'Profesional Emprendedor', rango: '$3k – $5k / mes', c: '3000-5000',
    corto: 'Ya existe un negocio. Ahora necesitás previsibilidad, mejores números, retención y una operación más eficiente.',
    cita: '“Tengo un negocio online. Ahora necesito optimizarlo.”',
    comoSeVe: [
      { p: 'Acá ya existe un negocio. No solamente una profesión monetizada ocasionalmente. El Profesional Emprendedor tiene:' },
      { lista: ['nicho validado;', 'oferta validada;', 'clientes;', 'adquisición;', 'ventas;', 'métricas;', 'Mini Brand Funnel;', 'experiencia comercial.'] },
      { p: 'Ya comprobó que puede conseguir clientes online.' },
      { sub: 'La presencialidad ya no es una necesidad' },
      { p: 'Puede seguir atendiendo presencialmente. Pero porque quiere. No porque el negocio dependa económicamente de eso. Idealmente, la dependencia de presencialidad es:' },
      { grande: 'PRÁCTICAMENTE INEXISTENTE.' },
      { p: 'Esto le da más libertad sobre:' },
      { lista: ['horarios;', 'ubicación;', 'capacidad;', 'cantidad de clientes;', 'forma de entregar el servicio.'] },
    ],
    problema: [
      { p: 'La pregunta ya no es:' }, { cita: '“¿Cómo consigo mi primer cliente?”' },
      { p: 'Ni siquiera:' }, { cita: '“¿Cómo consigo clientes?”' },
      { p: 'La pregunta empieza a ser:' },
      { grande: '“¿CÓMO HAGO ESTE NEGOCIO MÁS PREDECIBLE, RENTABLE Y EFICIENTE?”' },
    ],
    prioridad: 'PREVISIBILIDAD + OPTIMIZACIÓN.',
    prioridadBloques: [],
    partes: [
      { titulo: 'Sistema comercial predecible', bloques: [
        { p: 'Tiene que conocer su máquina comercial. Por ejemplo:' },
        { lineas: ['Si necesita 5 ventas.', '¿Cuántas llamadas necesita?', 'Si necesita 20 llamadas.', '¿Cuántas conversaciones calificadas necesita?', 'Si necesita 50 conversaciones calificadas.', '¿Cuánto contenido y cuánta actividad necesita generar?'] },
      ] },
      { titulo: 'Ingeniería inversa', bloques: [
        { p: 'Deja de decir:' }, { cita: '“Quiero facturar más.”' },
        { p: 'Y empieza a trabajar hacia atrás.' },
        { cadena: ['Objetivo', 'Ventas', 'Calls', 'Conversaciones', 'Atención'] },
        { p: 'El negocio se transforma en una ecuación.' },
      ] },
      { titulo: 'Trazabilidad', bloques: [
        { p: 'Empieza a saber:' },
        { lista: ['de dónde vino un lead;', 'qué contenido consumió;', 'cuándo habló;', 'qué ocurrió en ventas;', 'cuánto compró;', 'cuánto tiempo permaneció.'] },
      ] },
      { titulo: 'Retención', bloques: [
        { p: 'Ahora conseguir clientes nuevos no puede ser la única estrategia. Tiene que preguntarse:' },
        { preguntas: ['¿Cuánto tiempo permanece un cliente?', '¿Por qué se va?', '¿Qué resultado busca después?', '¿Cómo mejoramos continuidad?'] },
      ] },
      { titulo: 'Servicio pegajoso', bloques: [
        { p: 'El objetivo es construir una experiencia que genere razones legítimas para que el cliente quiera continuar. A través de:' },
        { lista: ['medición;', 'feedback;', 'ajustes;', 'seguimiento;', 'próximos objetivos;', 'continuidad.'] },
      ] },
      { titulo: 'Backend', bloques: [
        { p: 'La cartera actual empieza a importar muchísimo. El negocio puede trabajar hacia una estructura de aproximadamente:' },
        { grande: '30 CLIENTES ACTIVOS MENSUALES' },
        { p: 'cuando el modelo de servicio y capacidad operativa lo permitan. El objetivo no es simplemente meter más personas. Es poder sostenerlas con calidad.' },
      ] },
      { titulo: 'Mejorar delivery', bloques: [
        { p: 'Más clientes con una mala entrega no es escala. Es un problema más grande. El Profesional Emprendedor necesita trabajar:' },
        { lista: ['onboarding;', 'seguimiento;', 'experiencia;', 'comunicación;', 'resultados;', 'sistemas;', 'continuidad.'] },
      ] },
      { titulo: 'Publicidad', bloques: [
        { p: 'En esta etapa ya puede empezar a tener sentido incorporar anuncios. Pero existe una diferencia fundamental. No se utilizan para salvar un negocio que no vende. Se utilizan para:' },
        { grande: 'AMPLIFICAR ALGO QUE YA FUNCIONA.' },
        { cadena: ['Orgánico', 'Validación', 'Publicidad'] },
      ] },
      { titulo: 'Empezar a delegar', bloques: [
        { p: 'También aparece una nueva pregunta:' }, { cita: '“¿Qué cosas ya no debería seguir haciendo yo?”' },
        { p: 'La delegación puede comenzar a tener sentido sobre:' },
        { lista: ['tareas operativas;', 'soporte;', 'setting;', 'seguimiento;', 'administración;', 'determinadas partes del delivery.'] },
        { p: 'Siempre que el proceso ya esté:' },
        { lineas: ['entendido;', 'documentado;', 'probado.'] },
      ] },
    ],
    trampas: [
      { titulo: 'Pensar que todo se soluciona con más clientes', bloques: [
        { p: 'El profesional llega a $3k–$5k. Entonces piensa:' }, { cita: '“Necesito el doble de leads.”' },
        { p: 'Pero quizás el verdadero problema es:' },
        { lista: ['mala retención;', 'mala entrega;', 'ticket bajo;', 'poca continuidad;', 'mala capacidad operativa.'] },
      ], frase: 'Más adquisición no arregla un backend roto.' },
      { titulo: 'Crecer más rápido que la capacidad', bloques: [
        { lineas: ['20 clientes.', '30 clientes.', '40 clientes.'] },
        { p: 'Pero el servicio empieza a destruirse. El cliente siente menos acompañamiento. Los resultados bajan. La retención cae. La reputación empeora.' },
      ], frase: 'Escalar adquisición antes de escalar la entrega puede destruir aquello que te hizo crecer.' },
    ],
    extra: [],
    senal: [
      { p: 'Sabés que estás consolidando esta etapa cuando:' },
      { lista: ['generás $3k–$5k de manera relativamente predecible;', 'la presencialidad dejó de ser una dependencia;', 'existe adquisición orgánica;', 'conocés tus principales métricas;', 'tenés proceso comercial;', 'mejoraste la retención;', 'existe backend;', 'el servicio mantiene calidad;', 'empezás a detectar qué tareas deberían dejar de depender de vos.'] },
    ],
    siguiente: [
      { p: 'Ahora el problema cambia otra vez. Ya no se trata únicamente de construir un negocio. Se trata de construir:' },
      { grande: 'UNA EMPRESA.' },
    ],
    resumen: { problema: 'optimización', prioridad: 'previsibilidad + retención + backend + delivery', trampa: 'pensar que solamente necesita más clientes', objetivo: 'negocio online predecible, rentable y menos dependiente de presencialidad' },
    transicion: { de: 'Sistema', a: 'Negocio', p: 'De vender consistentemente a controlar adquisición, ventas, retención y operación.' },
    principio: ['Un Profesional Emprendedor no necesita llenar su agenda indiscriminadamente.', 'Necesita optimizar.'],
  },

  {
    n: 4, slug: 'empresario', nombre: 'Profesional Empresario', rango: '+$5k / mes', c: 'mas-5000',
    corto: 'El negocio funciona. Ahora necesitás que pueda seguir creciendo sin que absolutamente todo dependa de vos.',
    cita: '“El negocio funciona. Ahora necesito que deje de depender completamente de mí.”',
    comoSeVe: [
      { p: 'El Profesional Empresario ya tiene una máquina comercial validada. Tiene:' },
      { lista: ['oferta;', 'nicho;', 'posicionamiento;', 'adquisición;', 'ventas;', 'delivery;', 'backend;', 'métricas;', 'clientes;', 'cash flow.'] },
      { p: 'Ya no necesita comprobar que su modelo funciona. Ahora necesita conseguir que funcione:' },
      { grande: 'MEJOR.' },
      { p: 'Y con menos dependencia de su presencia directa.' },
      { sub: 'El cambio de identidad' },
      { p: 'En las primeras etapas la pregunta es:' }, { cita: '“¿Cómo puedo hacer esto?”' },
      { p: 'En esta etapa empieza a ser:' }, { cita: '“¿Quién debería hacer esto y cómo tiene que funcionar?”' },
      { p: 'Ese es el cambio:' },
      { cadena: ['Profesional', 'Operador', 'Dueño'] },
    ],
    problema: [
      { p: 'Puede estar facturando bien. Pero seguir siendo el cuello de botella.' },
      { lineas: ['Responde todos los mensajes.', 'Hace todas las ventas.', 'Atiende todos los clientes.', 'Corrige todos los problemas.', 'Supervisa absolutamente todo.'] },
      { p: 'Tiene un negocio. Pero el negocio todavía depende de su energía.' },
    ],
    prioridad: 'ESTRUCTURA + RENTABILIDAD + ESCALA.',
    prioridadBloques: [],
    partes: [
      { titulo: 'Procesos', bloques: [
        { p: 'Documentar cómo funciona cada área. No depender de:' }, { cita: '“Yo sé cómo hacerlo.”' },
        { p: 'Convertir conocimiento implícito en procesos explícitos.' },
      ] },
      { titulo: 'Delegación', bloques: [
        { p: 'Pasar tareas a otras personas cuando:' },
        { lista: ['ya funcionan;', 'están documentadas;', 'existe una forma de medirlas;', 'otra persona puede ejecutarlas con calidad.'] },
      ] },
      { titulo: 'Automatización', bloques: [
        { p: 'Automatizar aquello que:' },
        { lista: ['se repite;', 'es predecible;', 'no necesita criterio humano permanente.'] },
        { lineas: ['No automatizar caos.', 'Automatizar procesos.'] },
      ] },
      { titulo: 'Equipo', bloques: [
        { p: 'El equipo aparece para aumentar capacidad. No para esconder problemas. Puede empezar a incorporar personas alrededor de:' },
        { lista: ['operaciones;', 'soporte;', 'ventas;', 'setting;', 'customer success;', 'administración.'] },
      ] },
      { titulo: 'Publicidad y escala de adquisición', bloques: [
        { p: 'Una vez que existen:' },
        { lista: ['buena oferta;', 'conversión;', 'buena entrega;', 'retención;', 'backend;'] },
        { p: 'la publicidad puede ampliar el sistema.' },
      ] },
      { titulo: 'Rentabilidad', bloques: [
        { p: 'Facturar más no necesariamente significa ganar más. Ahora importan:' },
        { lista: ['margen;', 'costos;', 'adquisición;', 'delivery;', 'equipo;', 'retención;', 'lifetime value.'] },
      ] },
      { titulo: 'Capacidad', bloques: [
        { p: 'La pregunta:' }, { cita: '“¿Cuántos clientes puedo conseguir?”' },
        { p: 'se transforma en:' }, { cita: '“¿Cuántos clientes puedo atender manteniendo el estándar?”' },
      ] },
      { titulo: 'Backend y lifetime value', bloques: [
        { p: 'La empresa deja de pensar solamente en la primera compra. Empieza a mirar:' },
        { grande: 'EL VALOR COMPLETO DE LA RELACIÓN.' },
        { lineas: ['Qué compra después.', 'Cuánto tiempo permanece.', 'Qué otros problemas aparecen.', 'Qué siguiente nivel necesita.'] },
      ] },
    ],
    trampas: [
      { titulo: 'Seguir operando como autoempleado', bloques: [
        { p: 'El negocio ya necesita estructura empresarial. Pero el fundador sigue actuando como en Etapa 2.' },
        { lineas: ['Quiere estar en todo.', 'Controlar todo.', 'Resolver todo.'] },
        { p: 'Entonces su tiempo vuelve a convertirse en el límite.' },
      ], frase: '' },
      { titulo: 'Confundir facturación con empresa', bloques: [
        { lineas: ['$7k.', '$10k.', '$15k.'] },
        { p: 'Pero si cada venta adicional multiplica el caos, todavía falta estructura.' },
      ], frase: 'Una empresa no es solamente un negocio que factura más. Es un sistema capaz de absorber crecimiento.' },
    ],
    extra: [],
    senal: [
      { p: 'El Profesional Empresario empieza a consolidarse cuando:' },
      { lista: ['existe adquisición predecible;', 'el sistema comercial está medido;', 'la entrega tiene procesos;', 'la retención está controlada;', 'existen tareas delegadas;', 'existe equipo cuando es necesario;', 'el fundador dejó de ser indispensable en cada interacción;', 'el negocio mantiene calidad mientras crece.'] },
    ],
    siguiente: [],
    resumen: { problema: 'dependencia del fundador', prioridad: 'procesos + capacidad + delegación + rentabilidad', trampa: 'seguir comportándose como autoempleado', objetivo: 'construir una empresa capaz de crecer sin multiplicar el caos' },
    transicion: { de: 'Negocio', a: 'Empresa', p: 'De depender del fundador a construir procesos, equipo y capacidad.' },
    principio: ['Un Profesional Empresario no necesita hacer más cosas personalmente.', 'Necesita construir estructura.'],
  },
];

// Introducción del roadmap (va en "Dónde estás")
window.ACLARACION = [
  { p: 'La facturación sirve para ubicar aproximadamente cada etapa. Pero no es lo único que importa. Dos profesionales pueden facturar $3.000 por mes y tener negocios completamente diferentes.' },
  { p: 'Por eso DealMaker FIT analiza cada etapa desde tres dimensiones:' },
  { dimensiones: [['Negocio', 'Qué estructura construiste.'], ['Adquisición y ventas', 'Cómo conseguís y convertís clientes.'], ['Operación', 'Cómo entregás, retenés y hacés crecer el negocio.']] },
];

// Destino: cómo se ve el final del camino (solo en las etapas que no son la última)
window.DESTINO = {
  titulo: 'Un negocio online real',
  p: 'DealMaker FIT no busca simplemente enseñarte a ganar dinero por internet. El objetivo es construir un profesional capaz de transformar aquello para lo que se formó en un negocio online real. Un negocio donde pueda:',
  pildoras: ['generar demanda', 'vender', 'medir', 'entregar', 'retener', 'optimizar', 'delegar', 'crecer'],
  sin: ['Sin abandonar su profesión.', 'Sin necesitar convertirse en influencer.', 'Sin depender solamente de referidos.', 'Sin tener que trabajar presencialmente doce horas por día.', 'Y sin delegar las partes fundamentales del negocio antes de entenderlas.'],
};

// Por qué se estancan (va en el resumen)
window.ESTANCAN = {
  lineas: ['Publicidad antes de validar.', 'Delegación antes de dominar.', 'Automatización antes de tener procesos.', 'Escala antes de tener retención.', 'Equipo antes de tener números.'],
  frase: 'La velocidad no viene de saltarte los fundamentos. Viene de dominar rápidamente lo que corresponde a tu etapa.',
};

// La propuesta (va en la última etapa)
window.VEHICULO = {
  p: 'DealMaker FIT está diseñado para ayudar a profesionales de la salud deportiva a crear o escalar un negocio online alrededor de su profesión. Trabajando sobre:',
  pildoras: ['Fundaciones', 'Mini Brand Funnel', 'Adquisición', 'Ventas', 'Métricas', 'Backend', 'Retención', 'Procesos', 'Delegación'],
  promesa: 'Ayudamos a profesionales de la salud deportiva a crear o escalar un negocio online que gire alrededor de su profesión, con el objetivo de generar $5k al mes y construir las bases para seguir escalando.',
};

// Cierre: siguiente paso
window.CIERRE = {
  titulo: 'Identificar tu etapa no cambia el negocio.',
  p: 'Leer este roadmap puede ayudarte a identificar tu etapa. Pero lo que cambia el negocio es saber:',
  lineas: ['cuál es hoy tu cuello de botella;', 'qué deberías dejar de hacer;', 'qué deberías empezar a hacer;', 'y en qué orden.'],
  pasos: ['Primero identificamos tu etapa.', 'Después diagnosticamos tu principal problema.', 'Y finalmente construimos el plan para llegar a la siguiente.'],
};
