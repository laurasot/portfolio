# Diseño técnico: portfolio-v2-interactivo

Rama `feat/v2-interactivo`. Entradas: `proposal.md` (sección "Decisiones" final) y `openspec/changes/portfolio-v2/design.md` (arquitectura base, que sigue vigente: Astro estático + runtime vanilla TS, guion como datos, `engine.ts` puro). Este documento solo describe lo que cambia. Sin dependencias nuevas, sin tocar la v1.

## 1. Resumen del enfoque

- El guion sigue siendo un grafo de pasos en `src/v2/data/{es,en}.ts`. Se añade UN concepto: el paso **hub** (menú de ramas). Las ramas son pasos de bloque normales cuyo último `next` apunta al id del hub. No hay `Next` nuevo ni pila de retorno: el ciclo hub↔rama es un `next: 'hub-ideas'` normal.
- El visitante avanza: se elimina `later(() => go(next), ...)`. Cada paso con `next` termina con un botón real "continuar". `hold` queda como pausa mínima antes de mostrar ese botón.
- Estado: `State` gana `seen: string[]` (global, ids de opción con prefijo único). Es la única fuente de verdad del "visto"; se guarda en el `v2.state` existente.
- Validación: BFS estático (ya tolera ciclos porque usa `seen`) + simulación concreta por combinación modo/q2 para alcanzabilidad y terminación + paridad estructural es/en.

## 2. Modelo de datos (`types.ts`)

```ts
export interface HubOption { id: string; label: string; to: string; note?: number }
export interface Hub { options: HubOption[]; done: string; doneLabel: string }

// Step: cambios
hold?: number;   // ms de pausa mínima ANTES de mostrar "continuar" (ya no avanza solo)
hub?: Hub;       // paso menú: excluye options, next, blocks
menu?: string;   // id del hub al que vuelve el botón "volver al menú" (solo pasos de rama)

// Script.ui: nuevos textos
continue: string;  // es "continuar" / en "continue"
menu: string;      // es "volver al menú" / en "back to menu"
seen: string;      // es "visto" / en "seen" (aria-label de opción vista)
```

Decisiones:

| Tema | Decisión | Alternativa descartada |
|---|---|---|
| Hub | Campo propio `hub`, no un flag sobre `options` | `options` con `hub: true`: obliga a que `pick`, validador y motor distingan por flag; `options` es "elige y avanza", el hub es "elige, vuelve, se acumula" |
| Retorno de rama | `next: 'hub-x'` (string normal) en el último paso; `menu: 'hub-x'` en todos los pasos de rama | `Next` nuevo `{ hub }` o pila de retorno en el estado: más estado, más casos en `resolve`, el id fijo ya basta porque cada rama pertenece a un único hub |
| Visto | `seen: string[]` global; id de `HubOption` único en todo el guion (`ideas:exp`, `ideas:fav`, `ideas:raras`, `res:1`, `res:2`, `res:prod`, `hon:hizo`, `hon:aprende`, `hon:opinion`) | `seen` por hub (`Record<hub, string[]>`): más forma que validar al retomar, sin beneficio |
| "Visto" se marca | Al ABRIR la opción (en el click), no al terminarla | Marcar al volver: pierde la marca si cierra la pestaña a mitad de rama |
| "volver al menú" | Botón secundario en el mismo contenedor de controles; se omite en el último paso de la rama (donde `next === menu`, "continuar" ya vuelve) | Siempre mostrar ambos: dos botones que hacen lo mismo |
| Todo visto | Al entrar a un paso con `hub`, `redirect` devuelve `hub.done` si `allSeen`; sin pantalla intermedia | Mostrar el hub con todo atenuado (contradice la decisión 5) |
| Pasos puente sin texto | Se eliminan `cierre` (los `a-*` usan `next: { by:'mode', to:{...} }` directo, constante `afterQ2` en es/en) y `giro` (`quien` → `fin`; el giro de pose ocurre al entrar a `fin`) | Mantenerlos: sin líneas, "ningún paso avanza solo" dejaría una pantalla vacía que exige clic |
| Texto tras el giro | En `enter`, si `turning`, `wait = max(wait, t(T.turn))` para que las líneas de `fin` aparezcan al terminar el giro | Paso `giro` con `auto`: rompe la regla "nada avanza solo" |

Nota de contenido: `hold` pasa a ser pausa de lectura. Valores nuevos (slice 1): pasos solo-líneas 600-900, con bloques 1200, el resto de los antiguos 2000-3000 bajan. Ajuste fino a criterio de Laura.

## 3. Motor (`engine.ts`)

```ts
export interface State { step: string; mode?: Mode; q2?: Q2; seen: string[] }
createState(start) -> { step: start, seen: [] }
resolve(next, state)            // sin cambios
allSeen(hub: Hub, s: State): boolean            // hub.options.every(o => s.seen.includes(o.id))
markSeen(s: State, id: string): void            // idempotente
redirect(step: Step, s: State): string          // step.hub && allSeen ? step.hub.done : step.id
sanitize(raw: unknown, has: (id: string) => boolean): State | null
```

- `sanitize` es la compatibilidad de retomado: acepta objeto con `step` string existente (`has`), `mode`/`q2` solo si pertenecen a los conjuntos conocidos (si no, `undefined`), `seen` filtrado a strings (ausente = `[]`). Si `raw` no es objeto o `step` no existe devuelve `null` y el cliente arranca de cero. Un estado viejo (sin `seen`) NO rompe: queda `seen: []`. Si un paso de rama se retoma con modo ausente, `go()` ya captura el throw de `resolve` y reinicia (catch existente, se conserva).
- Aislamiento de retomado: `sanitize` conserva `sos` aparte en el cliente (`{ ...clean, sos: raw.sos ?? null }`).
- `selfCheck` suma casos: `allSeen` verdadero/falso; `markSeen` idempotente; `redirect` con hub completo e incompleto; `sanitize` con (a) estado viejo sin `seen`, (b) `step` inexistente, (c) basura, (d) `mode` inválido.

## 4. Validación (`validate.ts`)

Aristas: `next` (todas las ramas `by`), `options[].to`, `hub.options[].to`, `hub.done`. La BFS actual con conjunto `seen` ya termina con ciclos; se conserva como alcanzabilidad estática (sobre-aproximada: expande `by` a todos los valores).

Reglas nuevas (errores de build):

1. **Alcanzabilidad concreta**: para cada una de las 16 combinaciones `(mode, q2)`, BFS desde `start` donde una opción con `set` incompatible con la combinación se omite y `by` se resuelve con la combinación. La unión de visitados debe cubrir todos los pasos. Cuesta ~16 BFS sobre ~40 nodos.
2. **Terminación**: en cada combinación, todo paso visitado debe alcanzar `fin` (BFS inversa desde los pasos sin salidas). El único paso terminal permitido es `fin`. Los hubs siempre terminan porque `done` es una arista.
3. **Hub bien formado**: `options` no vacío; `done` existe y NO es un hub (evita bucle de redirect); sin `options`, `next` ni `blocks` en el mismo paso; ids de `HubOption` únicos en todo el guion; cada `to` existe.
4. **Retorno**: desde cada `hub.options[].to` debe alcanzarse el id del hub (siguiendo `next`); todo `menu` referencia un paso con `hub`.
5. **Paridad estructural (W7)**, comparando contra `ref`: `shape(step)` = `{ pose, tilt, flip, camera, light, dim, top, ui, hold, next, options: [{to, set, note}], hub: {done, options:[{id,to,note}]}, menu, nLines, nBlocks, hasPostit, hasPlaque, hasSospecha }` (textos excluidos); se compara con `JSON.stringify` y se informa el campo que difiere por paso. Además: `projects` mismo largo, mismos `name`-índice por posición, mismas `url` y `stack.length`; `ui.exits` mismo largo. (Mismos ids de pasos ya se comprueba.)
6. TODO: sin cambios (`V2_STRICT=1` falla; modo normal avisa). Seguirá fallando tras el cambio: quedan TODO personales (ver sección 7), es esperado.

## 5. Runtime del cliente (`sala.client.ts`, `Sala.astro`)

### Fases de un paso
`reveal` (líneas/bloques aparecen) → `hold` → `ready` (aparece el botón "continuar"). Pasos con `options` o `hub` no tienen `ready`: esperan elección.

- `later(fn, ms)` guarda `{fn}` en una cola además del timer. `flush()` cancela los timers y ejecuta las funciones pendientes en orden (muestra todo y el botón).
- Un gesto de avance (clic en escenario, ArrowRight, Enter con foco en body) en fase `reveal` hace `flush()` (completa el paso, también salta `hold`); en fase `ready` llama `advance()`. Dos gestos: leer, luego seguir. Guardia: se ignoran gestos < 250 ms tras `enter` (doble toque accidental).
- `hold` aplica con movimiento reducido: `T` en 0 pero `hold` no se multiplica por `reduced`; solo se pone a 0 en `instant` (retomado: W1 cerrado). Con reducido el visitante puede saltar la pausa con el primer gesto (decisión 1).

### Botón "continuar"
- `<template id="t-continue"><button type="button" class={styles.continue} data-continue>` y `t-menu` análogo en `Sala.astro`; texto desde `script.ui.continue` / `script.ui.menu` (el cliente rellena `textContent`; el SSR no los pinta).
- Va dentro de un `div` de controles añadido al final de `#text` (`aria-live="polite"`: el lector anuncia el botón). El div recibe `data-in` en `ready` (fade existente, sin animar layout).
- Foco: mismo criterio que las opciones (solo si `activeElement` es `body` o está dentro de `#text`). Enter/Espacio sobre el botón enfocado es click nativo; el handler global de Enter exige `target === body`, no hay doble disparo.
- En pasos de rama con `menu` y `next !== menu`: botón "volver al menú" junto a "continuar" (menú no es el foco por defecto).

### Clic/toque en el escenario
Listener `click` en `[data-stage]`. Se ignora si: `e.target.closest('a, button, [data-gate]')`, o si `!gate.hidden`, o si hay selección de texto (`getSelection()?.toString()`), o si el paso no tiene `advance` (preguntas, hub, paso final). Así no se roba un clic a opciones, enlaces, atajo ni salidas. El selector de idioma está en el layout, fuera del escenario, y no recibe el evento. El teclado nunca depende del clic: botón focalizable + Enter/ArrowRight.

### Hub
- Render: `hub.options` como botones `.option` (reusa `t-option`) + un botón final `hub.doneLabel` con `data-done`. Numeración 1..n+1 funciona con el handler de dígitos existente (`options[]` incluye el botón de salida).
- Opción vista (`state.seen.includes(o.id)`): `data-seen`, `aria-label = "{label} ({ui.seen})"`, CSS atenuada y marca "✓" por `::after`. Sigue clicable (reabrir).
- Al elegir: `markSeen(state, o.id)`, `pick` (nota, bloqueo `data-chosen`, delay `T.choose`), luego `enter`.
- Foco inicial: primera opción NO vista (si todas vistas no ocurre: redirect). Al volver de una rama cae sobre la siguiente sin ver.
- `enter(id)` empieza con `const target = redirect(script.steps[id], state); if (target !== id) return enter(target, instant)`. Guardia de bucle: `done` nunca es hub (validado).
- El hub tiene `ui: { exit: true }` y `top: 220`.

### Retomado
`load()` → `sanitize(JSON.parse(...), (id) => id in script.steps)`; si `null`, `createState(start)`. Un estado guardado en un paso eliminado (`cierre`, `giro`) cae a inicio. Retomar en un hub o rama restaura `seen`. Guardar sigue en cada `enter`.

### Portada de sonido y atajo (W5)
Antes de mostrar `gate`, el cliente hace `shortcut.hidden = false` (el primer paso ya lo tiene). CSS: `.shortcut { position: relative; z-index: 6 }` (en ≥1024 ya es `absolute`, solo suma `z-index: 6`), por encima de `.gate` (z 5). `.v2-lang` en `tokens.css` recibe `z-index: 10`. El DOM ya tiene el atajo antes de `gate`, así que el orden de Tab lo alcanza. El clic en el atajo con la portada visible navega, sin tocar la preferencia de sonido.

## 6. Estilos y W4 (44 px)

El escenario en ≥1024 se escala con `--fit` (típicamente 0,7-0,9): `44px` fijos miden menos en pantalla. Se define `--hit: 44px` en `.sala` y en `.stage` ≥1024 `--hit: calc(44px / var(--fit, 1))`. Se usa en:

- `.option` (`min-height: var(--hit)`, `min-width: var(--hit)`, `padding-inline: 8px` para "Sí"/"No"), `.continue`, `.exits a`, `.shortcut` (se QUITA `min-height: 0` de ≥1024).
- `.v2-lang` (`tokens.css`): `display:inline-flex; align-items:center; justify-content:center; box-sizing:border-box; min-width:44px; min-height:44px` (está fuera del escenario, no se escala).
- `.continue`: tipografía de `.eyebrow` (sans 11px uppercase, `--suave`), `background:none; border:0; cursor:pointer`, foco visible 2 px `--tinta` como `.option`. Contenedor de controles: flex, gap 24 px, `padding-top: 16px`.
- Solo `transform`/`opacity` en transiciones; en reducido ya aplica `.sala * { transition: none !important }`.
- Excepción: `[data-chosen] .option { opacity: .25 }` debe ganar sobre `data-seen` (.55) solo en el estado de elección; orden en CSS lo resuelve.

## 7. Contenido del guion

Voz de la v2: tercera persona, breve. Claude escribe es y traduce en (misma estructura obligatoria por W7). Laura revisa después.

### Estructura por modo (ids de paso)

- **Q2 → siguiente**: los `a-*` y `a-ideas-otra-vez` usan `next: { by: 'mode', to: { ideas: 'hub-ideas', resultados: 'hub-resultados', honestidad: 'hub-honestidad', elegancia: 'menos-1' } }`. Q1 Elegancia sigue yendo directo a `menos-1`.
- **Ideas** `hub-ideas` (líneas: "¿Qué quieres ver?"; `doneLabel` "Ya vi suficiente"):
  - `ideas:exp` → `exp-1` (menu `hub-ideas`, next `hub-ideas`)
  - `ideas:fav` → `fav` (next `hub-ideas`)
  - `ideas:raras` → `raras` → `duda` (next `hub-ideas`); `raras.menu` y `duda.menu` = `hub-ideas`
  - `done: 'ya-se'`
- **Resultados** `hub-resultados`: se parte `num-1` (hoy 2 bloques) en `num-1`, `num-2`, `num-prod` (un bloque cada uno); opciones `res:1`, `res:2`, `res:prod` ("El sistema en producción").
- **Honestidad** `hub-honestidad`: se parte `real-1` en `real-1` (lo que hizo), `real-2` (lo que aprende), `real-3` (una opinión); opciones `hon:hizo`, `hon:aprende`, `hon:opinion`.
- **Elegancia**: sin hub. `menos-1` (3 proyectos) → `menos-2` → `ya-se`, sin cambios de estructura.
- **Final compartido**: `ya-se` → `quien` → `fin` (`giro` eliminado; `fin` conserva `pose: 'giro'`, `plaque`, `ui.exits`).

### Qué se rellena desde la v1 (copia a `src/v2/data`, sin importar de `src/data/v1.ts`)

| Dato | Fuente v1 | Destino |
|---|---|---|
| `projects[].line` x6 (es/en) | `summary` de cada sistema; cueca: `music.text` | `projects.es.ts`, `projects.en.ts` (alimenta `/proyectos`, noscript y el script) |
| `fav` bloques | Traductor (éxito A), Incident Multiagent (éxito B), Music Under the Hood (pequeño/experimental) | `es.ts`, `en.ts` (eyebrow, title, body = resumen corto) |
| `num-1` | Asistente de ventas, `<3 s`, "Detección" + restricción | `es.ts`, `en.ts` |
| `num-2` | SpeakFlow, `<3 s`, "Respuesta sugerida" + restricción (marcado en desarrollo) | `es.ts`, `en.ts` |
| `num-prod` | Traductor de lengua de señas, `<5 s`, "Requisito de latencia", `problem` + `constraint` | `es.ts`, `en.ts` |
| `num-1` línea de apertura | Redacción nueva breve ("Números. Sin adjetivos.") | `es.ts`, `en.ts` |
| `menos-1` bloques x3 | Traductor, Incident Multiagent, SpeakFlow (`title`, `summary`) | `es.ts`, `en.ts` |
| `real-1` (lo que hizo) | `profile.statement` v1 adaptado a tercera persona | `es.ts`, `en.ts` |
| Textos nuevos de hub, `ui.continue/menu/seen`, `doneLabel` | Redacción nueva | es/en |

Supuesto a validar con Laura: la elección de qué sistema es "Resultado 1/2" y los 3 de Elegancia (aquí por orden y cifra). Un resultado "en desarrollo" (SpeakFlow) se rotula como tal.

### Se queda `[[TODO]]` para Laura (es y en)

`exp-1` (experimento), `raras` x2 y `duda` (cosas raras), `real-2` (lo que aprende), `real-3` (opinión), línea de apertura de `hub-honestidad`/`real-1`, `ui.noscript.who`. Con esto `V2_STRICT=1` seguirá fallando hasta que ella los complete: aceptado.

## 8. Cambios por archivo

| Archivo | Cambio | Líneas aprox. |
|---|---|---|
| `src/v2/data/types.ts` | `Hub`, `HubOption`, `Step.hub/menu`, `hold` redefinido, `ui.continue/menu/seen` | +20 |
| `src/v2/components/Sala/engine.ts` | `seen` en `State`, `allSeen`, `markSeen`, `redirect`, `sanitize`, `selfCheck` ampliado | +55 |
| `src/v2/data/validate.ts` | Aristas de hub, 16 combos (alcanzabilidad), terminación, reglas de hub, paridad estructural | +110/-15 |
| `src/v2/components/Sala/sala.client.ts` | Sin auto-avance; cola `later`/`flush`; fases; `t-continue`/`t-menu`; clic en escenario; hub (render, seen, foco, redirect); `load` con `sanitize`; atajo antes de la portada; espera del giro | +130/-25 |
| `src/v2/components/Sala/Sala.astro` | Templates `t-continue`, `t-menu` | +4 |
| `src/v2/components/Sala/Sala.module.css` | `--hit`, `.continue`, controles, `data-seen`, z-index atajo, quitar `min-height:0` | +45/-3 |
| `src/v2/styles/tokens.css` | `.v2-lang` 44 px + `z-index` | +8 |
| `src/v2/data/es.ts`, `en.ts` | Quitar `cierre`/`giro`; `afterQ2`; hubs; pasos partidos; holds; contenido v1; strings ui | +110 cada uno |
| `src/v2/data/projects.es.ts`, `projects.en.ts` | `line` desde v1 | ~12 cada uno |
| `openspec/changes/portfolio-v2-interactivo/specs/**`, `README` v2 | Deltas y notas | slice 6 |
| `src/data/v1.ts` y toda la v1 | NO se tocan | 0 |

## 9. Plan de slices (PRs encadenados sobre `feat/v2-interactivo`)

| # | Slice | Contenido | Líneas | Depende de |
|---|---|---|---|---|
| 1 | Avance del visitante | Sin auto-avance, `hold` = pausa mínima, botón `t-continue`, `flush`, clic/Enter/ArrowRight, giro/`cierre` eliminados, strings ui `continue`, holds nuevos. Cierra W1 | ~230 | — |
| 2 | Modelo, motor y validación | `types` (hub/menu/seen), `engine` (seen, redirect, sanitize, selfCheck), `validate` completo (ciclos, terminación, hub, paridad W7). Sin cambios de guion ni de UI | ~230 | — (paralelo a 1; el validador debe pasar con el guion de slice 1) |
| 3 | Hubs y ramas | Pasos hub y partidos en es/en (con contenido provisional TODO), render y foco del hub en cliente, `data-seen`, "volver al menú", Elegancia directo | ~380 | 1 y 2 |
| 4 | Contenido desde la v1 | `projects.*.line`, `fav`, `num-*`, `menos-1`, `real-1`, textos de hub; traducción en | ~260 | 3 |
| 5 | Avisos W4/W5 | `--hit`, `.v2-lang`, atajo sobre la portada, z-index | ~70 | 1 (toca `.option`/`.continue`) |
| 6 | Specs y cierre | Deltas v2-experiencia/preguntas/proyectos/responsive-a11y/i18n, README, `verify` | docs | 1-5 |

Orden: 1 ‖ 2 → 3 → 4; 5 en cualquier punto tras 1; 6 al final. Mejora respecto al plan de la propuesta: W7 baja a slice 2 (comparte archivo y propósito con la validación de ciclos y así el slice 3 ya nace protegido por paridad); se separa W4/W5 en su propio PR pequeño porque no depende de la estructura de hubs. Si el slice 3 pasa de ~400 líneas, partirlo en (3a) Ideas+cliente del hub y (3b) Resultados/Honestidad/Elegancia.

## 10. Riesgos y supuestos

- El primer gesto "completa" y el segundo "avanza": hay que probar que no se sienta lento. Si molesta, el primer gesto avanza directo y `flush` queda solo para la espera de `hold` con reducido.
- Orden de `seen` dentro de `sessionStorage`: se pierde al cerrar la pestaña, igual que el retomado actual (aceptado).
- La simulación de 16 combinaciones asume que `mode`/`q2` solo se fijan por `set` de opciones; si se añade otro `set`, hay que ampliar `BRANCHES` y la simulación.
- Sin pruebas automáticas de UI; la verificación del foco, lector de pantalla y táctil es manual (`npm run build` solo valida grafo, paridad y `selfCheck`).
- Valores de `hold` y elección de resultados/proyectos son criterio editorial: Laura debe confirmarlos.
- `--hit` con `calc(44px / var(--fit))` depende de que `--fit` se fije en `.stage` antes de pintar (`fit()` corre antes de `enter`); sin JS no hay escenario de todos modos.
