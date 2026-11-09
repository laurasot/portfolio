import type { PageData } from './types';

// Datos copiados de v1 (src/components/Projects); v2 no importa nada de v1.
const data: PageData = {
  lang: 'es',
  name: 'Laura Soto',
  home: '/v2',
  projectsHref: '/v2/proyectos',
  ui: {
    exit: 'Ir directo a proyectos →',
    projectsTitle: 'Proyectos',
    projectsBack: '← Volver a la sala',
    contact: 'Contacto',
    langLabel: 'EN',
  },
  contactLinks: [
    { label: 'Email', href: 'mailto:laura5florencia@gmail.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/laurasot/' },
    { label: 'GitHub', href: 'https://github.com/laurasot' },
  ],
  projects: [
    {
      name: 'Incident Multiagent',
      line: '[[TODO: una línea sobre Incident Multiagent]]',
      stack: ['Multi-Agent', 'AWS Bedrock', 'AgentCore', 'Strands SDK', 'MCP', 'CloudWatch', 'CDK'],
      links: [{ label: 'GitHub', url: 'https://github.com/laurasot/incident-multiagent' }],
    },
    {
      name: 'Traductor de lengua de señas con IA',
      line: '[[TODO: una línea sobre el traductor de lengua de señas]]',
      stack: ['Generative AI', 'RAG', 'Python', 'Go', 'TypeScript', 'Real-time Streaming'],
      links: [],
    },
    {
      name: 'Asistente de ventas en tiempo real',
      line: '[[TODO: una línea sobre el asistente de ventas]]',
      stack: ['Real-time AI', 'NLP', 'Video Streaming', 'TLS', 'Context Detection'],
      links: [],
    },
    {
      name: 'SpeakFlow',
      line: '[[TODO: una línea sobre SpeakFlow]]',
      stack: ['Electron + React', 'TypeScript', 'FastAPI', 'LangChain', 'Groq', 'Deepgram'],
      links: [
        { label: 'Backend API', url: 'https://github.com/laurasot/speakflow-api' },
        { label: 'Desktop App', url: 'https://github.com/laurasot/speakflow-desktop' },
      ],
    },
    {
      name: 'Music Under the Hood',
      line: '[[TODO: una línea sobre Music Under the Hood]]',
      stack: ['Python', 'Librosa', 'PyTorch', 'Machine Learning', 'Music Theory'],
      links: [
        {
          label: 'GitHub',
          url: 'https://github.com/laurasot/music-intelligence-backend/tree/develop',
        },
      ],
    },
    {
      name: 'Interpretaciones de cueca',
      line: '[[TODO: una línea sobre las interpretaciones de cueca]]',
      stack: ['Piano', 'Cueca', 'Folclor', 'Performance'],
      links: [],
    },
  ],
};

export default data;
