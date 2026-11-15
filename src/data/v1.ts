// Contenido de la v1 (recorrido oscuro). Todo el texto vive aquí para editarlo sin tocar componentes.

export type Level = [title: string, detail: string][];

export interface DiagramData {
  caption: string;
  levels: Level[];
  /** Etiqueta del tramo que llega a cada nivel (edges[i] une levels[i] con levels[i + 1]). */
  edges: string[];
  /** Presupuesto total de latencia, si aplica. */
  rail?: string;
  /** Nota de lazo: el último paso vuelve al primero. */
  loop?: string;
}

export interface Link {
  label: string;
  href: string;
}

export interface System {
  id: string;
  title: string;
  tag: string;
  status?: string;
  summary: string;
  metric: [value: string, label: string];
  problem: string;
  constraint: string;
  /** Pendiente de Laura: qué eligió y por qué. Si falta, la fila no se muestra. */
  decision?: string;
  stack: string;
  links: Link[];
  diagram: DiagramData;
}

export const profile = {
  name: 'Laura Soto',
  role: 'AI Engineer · Cloud Engineer',
  statement:
    'Sistemas de IA en tiempo real y cloud, documentados por sus decisiones: la restricción, la arquitectura y el porqué.',
  stats: [
    ['<3 s', 'Respuesta en tiempo real'],
    ['<5 s', 'Traducción a lengua de señas'],
    ['05', 'Certificaciones · 2 AWS'],
  ] as [string, string][],
};

export const systems: System[] = [
  {
    id: 'traductor-senas',
    title: 'Traductor de Lengua de Señas',
    tag: 'IA generativa · tiempo real',
    summary:
      'Traduce contenido hablado a lengua de señas para un medio líder en Chile, con IA generativa y RAG.',
    metric: ['<5 s', 'Requisito de latencia'],
    problem: 'Traducir contenido hablado a lengua de señas en tiempo casi real.',
    constraint: 'Latencia crítica: menos de 5 s de extremo a extremo.',
    stack: 'Python · Go · TypeScript · RAG · modelos open source',
    links: [],
    diagram: {
      caption: 'Arquitectura',
      levels: [
        [['Audio en vivo', 'entrada']],
        [['Transcripción en streaming', 'speech-to-text']],
        [['Traducción con RAG', 'modelo open source + índice']],
        [['Selección de señas', 'biblioteca de videos']],
        [['Render', 'videos pregrabados']],
      ],
      edges: ['stream de audio', 'texto', 'traducción', 'secuencia de clips'],
      rail: '<5 s',
    },
  },
  {
    id: 'incident-multiagent',
    title: 'Incident Multiagent',
    tag: 'Multi-agente · AWS',
    summary:
      'Asistente para incidentes en AWS que razona en lenguaje natural y consulta CloudWatch y la web.',
    metric: ['CDK v2', 'Infraestructura como código'],
    problem: 'Diagnosticar incidentes cruzando métricas de CloudWatch con contexto externo.',
    constraint: 'Respuesta en streaming y memoria de corto y largo plazo.',
    stack: 'Bedrock AgentCore · Strands SDK · MCP · CloudWatch',
    links: [{ label: 'GitHub', href: 'https://github.com/laurasot/incident-multiagent' }],
    diagram: {
      caption: 'Arquitectura',
      levels: [
        [['Consulta del operador', 'lenguaje natural']],
        [['Supervisor', 'Bedrock AgentCore']],
        [
          ['Agente de monitoreo', 'MCP tools'],
          ['Agente de contexto', 'búsqueda web'],
        ],
        [
          ['CloudWatch', 'métricas y logs'],
          ['Web', 'contexto externo'],
        ],
        [['Respuesta en streaming', 'memoria corto / largo plazo']],
      ],
      edges: ['', 'orquesta', 'consulta', 'resultados'],
    },
  },
  {
    id: 'speakflow',
    title: 'SpeakFlow',
    tag: 'Copiloto · tiempo real',
    status: 'En desarrollo',
    summary:
      'Copiloto para reuniones en otro idioma: detecta cuándo necesitas apoyo y sugiere una respuesta.',
    metric: ['<3 s', 'Respuesta sugerida'],
    problem: 'Responder con seguridad en reuniones en un idioma que no dominas.',
    constraint: 'Menos de 3 s, independiente de la plataforma de videollamadas.',
    stack: 'Electron + React · FastAPI · Deepgram · Groq · LangChain',
    links: [
      { label: 'API', href: 'https://github.com/laurasot/speakflow-api' },
      { label: 'Desktop', href: 'https://github.com/laurasot/speakflow-desktop' },
    ],
    diagram: {
      caption: 'Arquitectura',
      levels: [
        [['Audio de ambos lados', 'app de escritorio']],
        [['Transcripción', 'Deepgram']],
        [['Detección del momento', 'similitud semántica']],
        [['Respuesta contextual', 'LLM en Groq']],
        [['Sugerencia en pantalla', 'Electron + React']],
      ],
      edges: ['WebSocket binario', 'texto', 'momento detectado', 'respuesta'],
      rail: '<3 s',
    },
  },
  {
    id: 'asistente-ventas',
    title: 'Asistente de Ventas en Tiempo Real',
    tag: 'NLP · tiempo real',
    summary:
      'Reconoce qué proyecto se menciona en una conversación y lo muestra al instante al ingeniero comercial.',
    metric: ['<3 s', 'Detección'],
    problem: 'Asociar menciones implícitas en una conversación a proyectos concretos.',
    constraint: 'Detección en menos de 3 s y video de latencia ultra baja.',
    stack: 'NLP · detección de contexto · streaming de video · TLS',
    links: [],
    diagram: {
      caption: 'Arquitectura',
      levels: [
        [['Voz del usuario', 'conversación natural']],
        [['Reconocimiento contextual', 'NLP']],
        [['Asociación a proyecto', 'referencias implícitas']],
        [['Respuesta visual', 'video sobre TLS']],
      ],
      edges: ['audio', 'contexto', 'proyecto'],
      rail: '<3 s',
    },
  },
  {
    id: 'music-under-the-hood',
    title: 'Music Under the Hood',
    tag: 'Señal · deep learning',
    status: 'En desarrollo',
    summary:
      'Analiza audio y extrae acordes, tonalidad, tempo y estructura armónica de forma automática.',
    metric: ['07', 'Características extraídas'],
    problem: 'Extraer información musical de alto nivel a partir de audio crudo.',
    constraint: 'Procesamiento acelerado en GPU (CUDA).',
    stack: 'Python · Librosa · PyTorch · Transformers',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/laurasot/music-intelligence-backend/tree/develop',
      },
    ],
    diagram: {
      caption: 'Arquitectura',
      levels: [
        [['Audio', 'archivo o señal']],
        [['Procesamiento de señal', 'Librosa']],
        [['Modelos transformer', 'PyTorch · CUDA']],
        [['Teoría musical', 'reglas sobre las predicciones']],
        [['Características', 'acordes · tonalidad · tempo · estructura']],
      ],
      edges: ['señal', 'features', 'predicciones', 'análisis'],
    },
  },
];

// Borrador armado con las prácticas visibles en este repo; Laura debe confirmarlo.
export const howIWork = {
  intro: 'Lo que hago antes, durante y después de escribir código.',
  principles: [
    [
      'Primero la restricción',
      'Defino qué no puede fallar —latencia, costo o privacidad— y esa cifra guía el diseño.',
    ],
    [
      'Especificar antes de construir',
      'Propuesta, especificación, diseño y tareas antes de la primera línea de código.',
    ],
    [
      'Decisiones por escrito',
      'Cada decisión queda documentada con la alternativa descartada y su porqué.',
    ],
    [
      'Cambios pequeños y medibles',
      'PRs encadenados de menos de 400 líneas e infraestructura como código.',
    ],
  ] as [string, string][],
  frameworks:
    'Spec-Driven Development · IaC con AWS CDK · PRs encadenados · desarrollo asistido por agentes de IA',
  diagram: {
    caption: 'Proceso',
    levels: [
      [['Restricción', 'qué no puede fallar · la cifra']],
      [['Especificación', 'propuesta → specs → diseño → tareas']],
      [['Decisión documentada', 'alternativa descartada + porqué']],
      [['Cambio pequeño', 'PR < 400 líneas · IaC']],
      [['Medición', '¿se cumple la restricción?']],
    ],
    edges: ['', '', '', ''],
    loop: 'si no se cumple, vuelvo a la restricción',
  } satisfies DiagramData,
};

export const specs = {
  summary:
    'AI Engineer y Cloud Engineer con formación en desarrollo full stack, cloud computing y análisis de sistemas. Trabajo con Python, TypeScript y Go en sistemas de IA generativa y de tiempo real, desplegados como código sobre AWS.',
  facts: [
    ['Enfoque', 'Latencia · Arquitectura · IaC'],
    ['Lenguajes', 'Python · TypeScript · Go · Java'],
    ['Cloud', 'AWS · CDK · Bedrock'],
  ] as [string, string][],
  /** [nombre, principal] */
  stack: [
    [
      'IA y datos',
      [
        ['Generative AI', true],
        ['NLP', true],
        ['Python', true],
        ['Machine Learning', false],
        ['Deep Learning', false],
        ['Data Science', false],
        ['Computer Vision', false],
      ],
    ],
    [
      'Cloud',
      [
        ['AWS', false],
        ['CDK', false],
        ['Bedrock', false],
        ['Docker', false],
        ['PostgreSQL', false],
      ],
    ],
    [
      'Desarrollo',
      [
        ['TypeScript', true],
        ['React', true],
        ['Node.js', false],
        ['Java', false],
        ['Go', false],
        ['Git', false],
      ],
    ],
  ] as [string, [string, boolean][]][],
  education: [
    {
      years: '2025–2028',
      title: 'Técnico en programación y análisis de sistemas',
      institution: 'Instituto Profesional San Sebastian',
    },
    {
      years: '2025',
      title: 'AWS Certified AI Practitioner',
      institution: 'Amazon Web Services',
      credential:
        'https://www.credly.com/badges/20919825-bb26-4752-b657-fa22b674730e/linked_in_profile',
    },
    {
      years: '2025',
      title: 'AWS Certified Cloud Practitioner',
      institution: 'Amazon Web Services',
      credential:
        'https://www.credly.com/badges/2a9b1667-96de-48a1-a81c-39b71ea88d99/linked_in_profile',
    },
    {
      years: '2025',
      title: 'Bootcamp Fundamentos de IA',
      institution: 'IBM y Guayerd',
      credential: 'https://www.credly.com/badges/4fd1c099-dc40-4e7f-b7c0-3bd62d1584e6',
    },
    {
      years: '2023–2025',
      title: 'Certified Tech Developer · full stack',
      institution: 'Digital House',
    },
    { years: '2022', title: 'Bootcamp Java Full Stack', institution: 'Coding Dojo' },
    { years: '2021', title: 'Bootcamp Ruby on Rails', institution: 'Le Wagon' },
  ] as { years: string; title: string; institution: string; credential?: string }[],
};

export const music = {
  title: 'Música',
  text: 'Piano y composición. Interpretaciones de cuecas experimentales del compositor Patricio Fuentes, con un enfoque expresivo contemporáneo.',
  tags: ['Composición', 'Teoría musical', 'Interpretación', 'Ableton'],
};

export const contact = {
  title: 'Hablemos de sistemas.',
  lead: 'Para colaboración en proyectos de IA, cloud o desarrollo.',
  links: [
    {
      label: 'Email',
      value: 'laura5florencia@gmail.com',
      href: 'mailto:laura5florencia@gmail.com',
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/laurasot',
      href: 'https://www.linkedin.com/in/laurasot/',
    },
    { label: 'GitHub', value: 'github.com/laurasot', href: 'https://github.com/laurasot' },
  ],
};

/** Orden del recorrido: id de ancla, nombre corto para "siguiente" y sección del menú. */
export const nav = [
  { id: 'sistemas', label: 'Sistemas' },
  { id: 'como-trabajo', label: 'Cómo trabajo' },
  { id: 'especificaciones', label: 'Especificaciones' },
  { id: 'otros', label: 'Otros' },
  { id: 'contacto', label: 'Contacto' },
];
