export type PoseId = 'base' | 'pensando' | 'cinta' | 'duda' | 'mira-cinta' | 'giro';
export type Mode = 'ideas' | 'resultados' | 'honestidad' | 'elegancia';
export type Q2 = 'ideas' | 'exito' | 'dinero' | 'reconocimiento';

/** Destino: un id, o ramificado por una variable del estado. */
export type Next = string | { by: 'mode' | 'q2'; to: Record<string, string> };

export interface Option {
  label: string;
  to: Next;
  set?: { mode?: Mode; q2?: Q2 };
  note?: number; // Hz de la nota (solo si hay sonido)
}

export interface HubOption {
  id: string; // único en todo el guion (con prefijo: 'ideas:exp'); es la clave de `seen`
  label: string;
  to: string;
  note?: number;
}

/** Paso menú: elige una rama, vuelve, se acumulan vistos; con todo visto salta a `done`. */
export interface Hub {
  options: HubOption[];
  done: string; // paso al terminar (no puede ser otro hub)
  doneLabel: string;
}

export interface Block {
  eyebrow: string;
  title: string;
  body?: string;
}

export interface Step {
  id: string;
  lines?: string[]; // una por vez
  pose: PoseId;
  tilt?: number; // grados
  flip?: boolean;
  camera: number; // k del animatic: 1 | 1.15 | 1.02 | 1.04
  light?: boolean; // halo cálido
  postit?: string;
  plaque?: string; // solo en el cuadro final
  sospecha?: { eyebrow: string; text: string };
  ui?: { exit?: boolean; exits?: boolean };
  blocks?: Block[];
  top?: number; // y del texto en el escenario (330 por defecto, 220 con bloques)
  dim?: boolean;
  hold?: number; // pausa mínima (ms) antes de mostrar "continuar"; nunca avanza solo
  options?: Option[]; // si existe, espera respuesta; si no, usa next
  hub?: Hub; // excluye options, next y blocks
  menu?: string; // id del hub al que vuelve "volver al menú" (pasos de rama)
  next?: Next; // ausente = paso final
}

export interface Project {
  name: string;
  line: string;
  stack: string[];
  links: { label: string; url: string }[];
}

export interface Script {
  lang: 'es' | 'en';
  start: string;
  steps: Record<string, Step>;
  ui: {
    soundPrompt: string;
    continue: string;
    menu?: string; // obligatorio cuando existan hubs (slice 3)
    seen?: string;
    yes: string;
    no: string;
    exit: string;
    sospechaFoot: string;
    exits: { label: string; href: string }[];
    projectsTitle: string;
    projectsBack: string;
    contact: string;
    langSwitch: { label: string; href: string };
    noscript: { who: string };
  };
  projects: Project[];
}

/** Textos de las páginas de PR 1 (sala stub + proyectos); el guion completo llega después. */
export interface PageData {
  lang: 'es' | 'en';
  name: string;
  home: string; // ruta de la sala
  projectsHref: string;
  ui: Pick<Script['ui'], 'exit' | 'projectsTitle' | 'projectsBack' | 'contact'> & {
    langLabel: string;
  };
  contactLinks: { label: string; href: string }[];
  projects: Project[];
}
