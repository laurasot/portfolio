import type { Mode, Next, Q2 } from '../../data/types';

export interface State {
  step: string;
  mode?: Mode;
  q2?: Q2;
}

export const createState = (start: string): State => ({ step: start });

/** Puro y determinista: mismo `next` + mismo estado = mismo paso. */
export function resolve(next: Next, state: State): string {
  if (typeof next === 'string') return next;
  const key = state[next.by];
  const id = key && next.to[key];
  if (!id) throw new Error(`[v2] sin rama para ${next.by}=${key ?? 'undefined'}`);
  return id;
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
}
