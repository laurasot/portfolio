import type { Hub, Mode, Next, Q2, Step } from '../../data/types';

export interface State {
  step: string;
  mode?: Mode;
  q2?: Q2;
  seen: string[]; // ids de HubOption abiertas (global al guion)
}

const MODES: Mode[] = ['ideas', 'resultados', 'honestidad', 'elegancia'];
const Q2S: Q2[] = ['ideas', 'exito', 'dinero', 'reconocimiento'];

export const createState = (start: string): State => ({ step: start, seen: [] });

/** Puro y determinista: mismo `next` + mismo estado = mismo paso. */
export function resolve(next: Next, state: State): string {
  if (typeof next === 'string') return next;
  const key = state[next.by];
  const id = key && next.to[key];
  if (!id) throw new Error(`[v2] sin rama para ${next.by}=${key ?? 'undefined'}`);
  return id;
}

export const allSeen = (hub: Hub, s: State): boolean =>
  hub.options.every((o) => s.seen.includes(o.id));

export const markSeen = (s: State, id: string): void => {
  if (!s.seen.includes(id)) s.seen.push(id);
};

/** Un hub con todo visto salta directo a `done`; cualquier otro paso se queda. */
export const redirect = (step: Step, s: State): string =>
  step.hub && allSeen(step.hub, s) ? step.hub.done : step.id;

/** Valida un estado guardado (puede venir de una versión vieja o roto); null = empezar de cero. */
export function sanitize(raw: unknown, has: (id: string) => boolean): State | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.step !== 'string' || !has(r.step)) return null;
  return {
    step: r.step,
    mode: MODES.find((m) => m === r.mode),
    q2: Q2S.find((q) => q === r.q2),
    seen: Array.isArray(r.seen) ? r.seen.filter((x): x is string => typeof x === 'string') : [],
  };
}

/** Autocomprobación: la llama validate.ts durante el build. */
export function selfCheck(): void {
  const eq = (a: unknown, b: unknown, msg: string) => {
    if (a !== b) throw new Error(`[v2] engine selfCheck: ${msg} (${String(a)} != ${String(b)})`);
  };
  const s: State = { ...createState('a'), mode: 'ideas', q2: 'dinero' };
  eq(resolve('x', s), 'x', 'next simple');
  eq(resolve({ by: 'mode', to: { ideas: 'm' } }, s), 'm', 'by mode');
  eq(resolve({ by: 'q2', to: { dinero: 'd' } }, s), 'd', 'by q2');
  let threw = false;
  try {
    resolve({ by: 'mode', to: { ideas: 'm' } }, createState('a'));
  } catch {
    threw = true;
  }
  eq(threw, true, 'rama ausente debe fallar');

  const hub: Hub = {
    options: [
      { id: 'h:a', label: 'A', to: 'a' },
      { id: 'h:b', label: 'B', to: 'b' },
    ],
    done: 'fin',
    doneLabel: 'x',
  };
  const hs = createState('h');
  eq(allSeen(hub, hs), false, 'allSeen vacío');
  markSeen(hs, 'h:a');
  markSeen(hs, 'h:a');
  eq(hs.seen.length, 1, 'markSeen idempotente');
  eq(redirect({ id: 'h', hub } as Step, hs), 'h', 'hub incompleto no redirige');
  markSeen(hs, 'h:b');
  eq(allSeen(hub, hs), true, 'allSeen completo');
  eq(redirect({ id: 'h', hub } as Step, hs), 'fin', 'hub completo redirige a done');
  eq(redirect({ id: 'p' } as Step, hs), 'p', 'paso sin hub no redirige');
  const has = (id: string) => id === 'a';
  eq(
    JSON.stringify(sanitize({ step: 'a', mode: 'ideas' }, has)),
    '{"step":"a","mode":"ideas","seen":[]}',
    'estado viejo sin seen',
  );
  eq(sanitize({ step: 'zzz' }, has), null, 'step inexistente');
  eq(sanitize('basura', has), null, 'basura');
  eq(sanitize(null, has), null, 'null');
  const bad = sanitize({ step: 'a', mode: 'nope', q2: 3, seen: ['x', 1, null] }, has)!;
  eq(bad.mode, undefined, 'mode inválido');
  eq(bad.q2, undefined, 'q2 inválido');
  eq(bad.seen.join(), 'x', 'seen solo strings');
}
