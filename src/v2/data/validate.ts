import { selfCheck } from '../components/Sala/engine';
import type { Next, Script, Step } from './types';

selfCheck();

const BRANCHES = {
  mode: ['ideas', 'resultados', 'honestidad', 'elegancia'],
  q2: ['ideas', 'exito', 'dinero', 'reconocimiento'],
};

const targets = (n?: Next): string[] =>
  !n ? [] : typeof n === 'string' ? [n] : Object.values(n.to);

/** Rompe el build si el grafo está roto; avisa (o falla con V2_STRICT=1) si quedan [[TODO. */
export function validate(script: Script, ref?: Script): void {
  const errors: string[] = [];
  const { steps, start } = script;
  // Paridad de idiomas: mismos ids de pasos que el guion de referencia.
  if (ref) {
    const a = Object.keys(steps);
    const b = Object.keys(ref.steps);
    for (const k of a.filter((k) => !b.includes(k)))
      errors.push(`paso "${k}" no existe en ${ref.lang}`);
    for (const k of b.filter((k) => !a.includes(k)))
      errors.push(`falta el paso "${k}" de ${ref.lang}`);
  }
  if (!steps[start]) errors.push(`start "${start}" no existe`);

  // Aristas del paso. Con `c` (combinación mode/q2) se simula un recorrido concreto:
  // se omiten opciones cuyo `set` no encaja y `by` se resuelve; sin `c` se expande todo.
  type Combo = { mode: string; q2: string };
  const out = (id: string, c?: Combo): string[] => {
    const st = steps[id];
    const opts = (st.options ?? []).filter(
      (o) => !c || ((!o.set?.mode || o.set.mode === c.mode) && (!o.set?.q2 || o.set.q2 === c.q2)),
    );
    const nexts = [st.next, ...opts.map((o) => o.to)].flatMap((n) =>
      !c ? targets(n) : n && typeof n === 'object' ? [n.to[c[n.by]]].filter(Boolean) : targets(n),
    );
    const hub = st.hub ? [...st.hub.options.map((o) => o.to), st.hub.done] : [];
    return [...nexts, ...hub];
  };
  for (const id of Object.keys(steps)) {
    for (const n of [steps[id].next, ...(steps[id].options ?? []).map((o) => o.to)]) {
      if (n && typeof n === 'object') {
        const missing = BRANCHES[n.by].filter((k) => !(k in n.to));
        if (missing.length) errors.push(`${id}: by ${n.by} sin ramas ${missing.join(',')}`);
      }
    }
  }
  // BFS desde `from`; los destinos inexistentes se ignoran aquí (se informan en la pasada estática).
  const walk = (from: string, c?: Combo) => {
    const seen = new Set<string>();
    const queue = steps[from] ? [from] : [];
    while (queue.length) {
      const id = queue.pop()!;
      if (seen.has(id)) continue;
      seen.add(id);
      queue.push(...out(id, c).filter((t) => steps[t]));
    }
    return seen;
  };

  const seen = new Set<string>();
  const queue = steps[start] ? [start] : [];
  while (queue.length) {
    const id = queue.pop()!;
    if (seen.has(id)) continue;
    seen.add(id);
    for (const t of out(id)) {
      if (steps[t]) queue.push(t);
      else errors.push(`${id}: destino "${t}" no existe`);
    }
  }
  for (const [key, s] of Object.entries(steps)) {
    if (s.id !== key) errors.push(`${key}: id "${s.id}" no coincide`);
    if (!seen.has(key)) errors.push(`${key}: inalcanzable desde start`);
  }

  // Alcanzabilidad concreta y terminación por cada combinación (mode, q2).
  if (steps[start]) {
    const reached = new Set<string>();
    for (const mode of BRANCHES.mode) {
      for (const q2 of BRANCHES.q2) {
        const c = { mode, q2 };
        const vis = walk(start, c);
        vis.forEach((id) => reached.add(id));
        for (const id of vis) {
          if (id !== 'fin' && !out(id, c).some((t) => steps[t]))
            errors.push(`${id}: paso terminal distinto de "fin" (${mode}/${q2})`);
          else if (!walk(id, c).has('fin')) errors.push(`${id}: no alcanza "fin" (${mode}/${q2})`);
        }
      }
    }
    for (const id of Object.keys(steps))
      if (!reached.has(id) && seen.has(id)) errors.push(`${id}: inalcanzable en toda combinación`);
  }

  // Hubs bien formados y retorno.
  const optIds = new Map<string, string>();
  for (const st of Object.values(steps)) {
    const h = st.hub;
    if (st.menu && !steps[st.menu]?.hub) errors.push(`${st.id}: menu "${st.menu}" no es un hub`);
    if (!h) continue;
    if (!h.options.length) errors.push(`${st.id}: hub sin opciones`);
    if (!steps[h.done]) errors.push(`${st.id}: hub.done "${h.done}" no existe`);
    else if (steps[h.done].hub) errors.push(`${st.id}: hub.done "${h.done}" es otro hub`);
    if (st.options || st.next || st.blocks)
      errors.push(`${st.id}: un hub no puede tener options, next ni blocks`);
    for (const o of h.options) {
      if (optIds.has(o.id))
        errors.push(`${st.id}: id de opción "${o.id}" repetido (${optIds.get(o.id)})`);
      optIds.set(o.id, st.id);
      if (!steps[o.to]) errors.push(`${st.id}: opción ${o.id} apunta a "${o.to}" que no existe`);
      else if (o.to !== st.id && !walk(o.to).has(st.id))
        errors.push(`${st.id}: desde ${o.id} (${o.to}) no se vuelve al hub`);
    }
  }

  // Paridad estructural (W7): mismo guion en forma, solo cambian los textos.
  if (ref) {
    const shape = (st: Step) => ({
      pose: st.pose,
      tilt: st.tilt,
      flip: st.flip,
      camera: st.camera,
      light: st.light,
      dim: st.dim,
      top: st.top,
      ui: st.ui,
      hold: st.hold,
      next: st.next,
      options: st.options?.map((o) => ({ to: o.to, set: o.set, note: o.note })),
      hub: st.hub && {
        done: st.hub.done,
        options: st.hub.options.map((o) => ({ id: o.id, to: o.to, note: o.note })),
      },
      menu: st.menu,
      nLines: st.lines?.length,
      nBlocks: st.blocks?.length,
      hasPostit: !!st.postit,
      hasPlaque: !!st.plaque,
      hasSospecha: !!st.sospecha,
    });
    for (const id of Object.keys(steps).filter((k) => ref.steps[k])) {
      const a = shape(steps[id]) as Record<string, unknown>;
      const b = shape(ref.steps[id]) as Record<string, unknown>;
      for (const f of Object.keys(a))
        if (JSON.stringify(a[f]) !== JSON.stringify(b[f]))
          errors.push(
            `${id}.${f} difiere de ${ref.lang}: ${JSON.stringify(a[f])} vs ${JSON.stringify(b[f])}`,
          );
    }
    const same = (what: string, x: unknown, y: unknown) =>
      JSON.stringify(x) !== JSON.stringify(y) &&
      errors.push(`${what} difiere de ${ref.lang}: ${JSON.stringify(x)} vs ${JSON.stringify(y)}`);
    same('projects (largo)', script.projects.length, ref.projects.length);
    script.projects.forEach((p, i) => {
      const r = ref.projects[i];
      if (!r) return;
      same(
        `projects[${i}] url`,
        p.links.map((l) => l.url),
        r.links.map((l) => l.url),
      );
      same(`projects[${i}] stack.length`, p.stack.length, r.stack.length);
    });
    same('ui.exits (largo)', script.ui.exits.length, ref.ui.exits.length);
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
