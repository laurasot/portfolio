import type { PageData } from './types';
import es from './projects.es';

// Mismos enlaces y stack que es; solo cambian los textos.
const data: PageData = {
  ...es,
  lang: 'en',
  home: '/en/v2',
  projectsHref: '/en/v2/projects',
  ui: {
    exit: 'Go straight to projects →',
    projectsTitle: 'Projects',
    projectsBack: '← Back to the room',
    contact: 'Contact',
    langLabel: 'ES',
  },
  projects: es.projects.map((p, i) => {
    const name = [
      'Incident Multiagent',
      'AI Sign Language Translator',
      'Real-time Sales Assistant',
      'SpeakFlow',
      'Music Under the Hood',
      'Cueca Interpretations',
    ][i];
    return { ...p, name, line: `[[TODO: one line about ${name}]]` };
  }),
};

export default data;
