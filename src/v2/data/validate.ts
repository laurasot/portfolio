import { selfCheck } from '../components/Sala/engine';
import type { Next, Script } from './types';

selfCheck();

const BRANCHES = {
  mode: ['ideas', 'resultados', 'honestidad', 'elegancia'],
  q2: ['ideas', 'exito', 'dinero', 'reconocimiento'],
};

const targets = (n?: Next): string[] =>
  !n ? [] : typeof n === 'string' ? [n] : Object.values(n.to);

/** Rompe el build si el grafo está roto; avisa (o falla con V2_STRICT=1) si quedan [[TODO. */
export function validate(script: Script): void {
  const errors: string[] = [];
  const { steps, start } = script;
  if (!steps[start]) errors.push(`start "${start}" no existe`);

  const edges = (id: string) =>
    [steps[id].next, ...(steps[id].options ?? []).map((o) => o.to)].flatMap((n) => {
      if (n && typeof n === 'object') {
        const missing = BRANCHES[n.by].filter((k) => !(k in n.to));
        if (missing.length) errors.push(`${id}: by ${n.by} sin ramas ${missing.join(',')}`);
      }
      return targets(n);
    });

  const seen = new Set<string>();
  const queue = steps[start] ? [start] : [];
  while (queue.length) {
    const id = queue.pop()!;
    if (seen.has(id)) continue;
    seen.add(id);
    for (const t of edges(id)) {
      if (steps[t]) queue.push(t);
      else errors.push(`${id}: destino "${t}" no existe`);
    }
  }
  for (const [key, s] of Object.entries(steps)) {
    if (s.id !== key) errors.push(`${key}: id "${s.id}" no coincide`);
    if (!seen.has(key)) errors.push(`${key}: inalcanzable desde start`);
  }
  if (errors.length)
    throw new Error(`[v2:${script.lang}] guion inválido:\n- ${errors.join('\n- ')}`);

  const has = (v: unknown) => /\[\[TODO/.test(JSON.stringify(v));
  const where = [
    ...Object.values(steps)
      .filter(has)
      .map((s) => s.id),
    ...(has(script.ui) ? ['ui'] : []),
    ...(has(script.projects) ? ['projects'] : []),
  ];
  const count = (JSON.stringify(script).match(/\[\[TODO/g) ?? []).length;
  if (!count) return;
  const msg = `[v2:${script.lang}] ${count} [[TODO]] en: ${where.join(', ')}`;
  if (process.env.V2_STRICT === '1') throw new Error(msg);
  console.warn(msg);
}
