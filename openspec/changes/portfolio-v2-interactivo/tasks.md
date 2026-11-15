# Tareas: portfolio-v2-interactivo

Entradas: `proposal.md` (sección "Decisiones"), `design.md`, `specs/*/spec.md` (deltas; R# = requisito del delta). Sin test runner: la verificación de cada tarea es `npm run build` en verde (valida grafo, paridad es/en y `selfCheck`) + la comprobación manual en navegador indicada. Estilo: Prettier (semi, singleQuote, 2 espacios, 100 cols, trailingComma all). Sin dependencias nuevas. v2 aislada de v1: se copia, nunca se importa; `src/data/v1.ts` y toda la v1 NO se tocan.

`V2_STRICT=1 npm run build` seguirá fallando por los `[[TODO]]` personales de Laura (experimento, raras, aprende, opinión, `ui.noscript.who`): es esperado y aceptado.

Estrategia de entrega: PRs encadenados sobre `feat/v2-interactivo`, `ask-on-risk`, presupuesto ~400 líneas por slice. Cada PR compila solo y se puede fusionar solo.

Leyenda: `[EDITORIAL]` = decisión de contenido que Laura debe confirmar.

---

## Slice 1 — Avance del visitante (~230 líneas)

Depende de: nada. Cierra W1. Resultado: ningún paso avanza solo; el guion sigue lineal (sin hubs todavía).

- [x] 1.1 Strings de UI y tipo `hold`
  - Archivos: `src/v2/data/types.ts` (`ui.continue`; comentario de `hold` = pausa mínima), `src/v2/data/es.ts`, `src/v2/data/en.ts` (`ui.continue`: "continuar" / "continue").
  - Aceptación: v2-experiencia R8 (mismo texto en todos los dispositivos), v2-i18n R2 (copy en datos). Build verde.
- [x] 1.2 Quitar pasos puente `cierre` y `giro`
  - Archivos: `es.ts`, `en.ts` (constante `afterQ2` con `next: { by: 'mode', to: {...} }` en los `a-*` y `a-ideas-otra-vez`; `quien` -> `fin`; `fin` conserva `pose: 'giro'`, `plaque`, `ui.exits`). En este slice `afterQ2` apunta a los primeros pasos lineales de cada modo (el hub llega en 3).
  - Aceptación: v2-experiencia R6/R8 (ninguna pantalla vacía que exija clic). `validate` pasa (sin pasos inalcanzables).
- [x] 1.3 Cola `later`/`flush` y fases `reveal` -> `hold` -> `ready`
  - Archivos: `src/v2/components/Sala/sala.client.ts` (eliminar `later(() => go(next), ...)`; `later` guarda `{fn}` + timer; `flush()` cancela timers y ejecuta pendientes; `hold` no se multiplica por `reduced`, solo es 0 en `instant`; en `enter`, si `turning`, `wait = max(wait, t(T.turn))`).
  - Aceptación: v2-experiencia R2 (`hold` pausa mínima, no avanza; se conserva al retomar), R9 (reducido: `hold` aplica y el primer gesto lo salta), cierra W1. Escenarios "pausa mínima" y "retomar conserva hold".
- [x] 1.4 Botón "continuar" y gestos de avance
  - Archivos: `Sala.astro` (`<template id="t-continue">`), `sala.client.ts` (div de controles al final de `#text` con `aria-live="polite"` y `data-in` en `ready`; foco solo si `activeElement` es `body` o está en `#text`; listener `click` en `[data-stage]` ignorando `a, button, [data-gate]`, portada visible, selección de texto y pasos sin `advance`; Enter/ArrowRight: en `reveal` -> `flush()`, en `ready` -> `advance()`; guardia < 250 ms tras `enter`), `Sala.module.css` (`.continue` con tipografía `.eyebrow`, foco visible 2 px `--tinta`, contenedor flex gap 24 px, `padding-top: 16px`).
  - Aceptación: v2-experiencia R8 (clic, toque, Enter, ArrowRight y botón avanzan igual; nunca avanza solo; clic en enlace/atajo/opción no avanza; preguntas no avanzan por clic suelto), R9 (Tab + Enter), v2-responsive-a11y R4/R5.
- [x] 1.5 Valores de `hold` nuevos `[EDITORIAL]`
  - Archivos: `es.ts`, `en.ts` (mismos valores en ambos). Propuesta: solo líneas 600-900, con bloques 1200, los antiguos 2000-3000 bajan.
  - Aceptación: es y en idénticos (paridad). Laura confirma los números tras probar el ritmo.
- [x] 1.6 Verificación del slice
  - `npm run build` verde. Navegador `/v2` y `/en/v2`: recorrer de punta a punta sin que nada avance solo; probar los 4 modos hasta `fin`; retomar mitad de recorrido (atajo + volver) y ver que la pista espera `hold`; con `prefers-reduced-motion` la pausa sigue. Probar que el primer gesto completa y el segundo avanza no se siente lento (riesgo del diseño, sección 10).

---

## Slice 2 — Modelo, motor y validación con paridad W7 (~230 líneas)

Depende de: nada (paralelo a 1). El validador debe pasar con el guion del slice 1. Sin cambios de guion ni de UI.

- [x] 2.1 Tipos del hub
  - Archivos: `src/v2/data/types.ts` (`HubOption { id, label, to, note? }`, `Hub { options, done, doneLabel }`, `Step.hub`, `Step.menu`, `ui.menu`, `ui.seen`).
  - Aceptación: TS strict sin errores. v2-preguntas R7, R8, R9. Los campos nuevos son opcionales o aún sin uso en el guion: en/es siguen compilando.
- [x] 2.2 Estado y motor
  - Archivos: `src/v2/components/Sala/engine.ts` (`State.seen: string[]`; `createState` -> `seen: []`; `allSeen`, `markSeen` idempotente, `redirect`, `sanitize(raw, has)`; `selfCheck` ampliado: `allSeen` true/false, `markSeen` idempotente, `redirect` con hub completo/incompleto, `sanitize` con estado viejo sin `seen`, `step` inexistente, basura y `mode` inválido).
  - Aceptación: v2-preguntas R10 (todo visto -> `done`), R11 (sin `seen` = vacío; claves desconocidas ignoradas; determinismo). `selfCheck` corre en build y falla si se rompe una regla (probar rompiendo una a propósito y revertir).
- [x] 2.3 Validación de grafo con ciclos
  - Archivos: `src/v2/data/validate.ts` (aristas `next`, `options[].to`, `hub.options[].to`, `hub.done`; BFS estática se conserva; alcanzabilidad concreta por las 16 combinaciones `(mode, q2)`; terminación: todo paso visitado alcanza `fin`, único terminal permitido).
  - Aceptación: v2-preguntas R6/R10. Un paso inalcanzable en una combinación o un terminal distinto de `fin` rompe el build.
- [x] 2.4 Reglas de hub bien formado y retorno
  - Archivos: `validate.ts` (`options` no vacío; `done` existe y no es hub; sin `options`/`next`/`blocks` en el mismo paso; ids de `HubOption` únicos en todo el guion; cada `to` existe; desde cada `to` se alcanza el id del hub; todo `menu` referencia un paso con `hub`).
  - Aceptación: v2-preguntas R7/R9/R10. Sin hubs en el guion actual, las reglas pasan vacías; probar con un hub de prueba temporal mal formado (revertir).
- [x] 2.5 Paridad estructural W7
  - Archivos: `validate.ts` (`shape(step)` = pose, tilt, flip, camera, light, dim, top, ui, hold, next, options `{to,set,note}`, hub `{done, options:[{id,to,note}]}`, menu, nLines, nBlocks, hasPostit, hasPlaque, hasSospecha; comparar con `JSON.stringify` e informar id + campo; además `projects` mismo largo, mismas `url`, `stack.length`; `ui.exits` mismo largo).
  - Aceptación: v2-i18n R2, escenarios "paridad estructural" y "divergencia detectada" (cambiar un `next` o `pose` en `en.ts` hace fallar el build con id y campo; revertir). Cierra W7.
- [x] 2.6 Verificación del slice
  - `npm run build` verde con el guion de slice 1 (y también sin él: si 1 no está fusionado, con el guion actual). Si W7 destapa divergencias reales preexistentes es/en, corregirlas en este mismo PR (anotar cuántas).

---

## Slice 3a — Hub de Ideas y cliente del hub (~220 líneas)

Depende de: 1 y 2. Resultado: el modo Ideas usa hub; el cliente sabe pintar y operar cualquier hub. Contenido provisional `[[TODO]]`.

- [ ] 3a.1 Cliente: render del hub y vistos
  - Archivos: `sala.client.ts` (`hub.options` como botones `.option` reusando `t-option` + botón final `hub.doneLabel` con `data-done`; numeración 1..n+1; opción vista con `data-seen` y `aria-label = "{label} ({ui.seen})"`; al elegir: `markSeen`, `pick`, `enter`; foco inicial en la primera opción no vista; `enter` empieza con `redirect`; hub con `ui: { exit: true }`, `top: 220`), `Sala.module.css` (`[data-seen]` atenuada .55 + marca "✓" por `::after`; `[data-chosen] .option { opacity: .25 }` gana en la elección).
  - Aceptación: v2-preguntas R7/R8/R10, v2-responsive-a11y R4 (foco al hub) y R5 (estado visto anunciable, no solo atenuación). El hub no avanza por clic suelto ni por tiempo.
- [ ] 3a.2 Cliente: "volver al menú", "Seguir" y retomado
  - Archivos: `Sala.astro` (`<template id="t-menu">`), `sala.client.ts` (botón "volver al menú" junto a "continuar" en pasos con `menu` y `next !== menu`, sin ser el foco por defecto, no marca visto; `load()` -> `sanitize(JSON.parse(...), id => id in script.steps)`, `null` -> `createState(start)`; conserva `sos` aparte), `es.ts`/`en.ts` (`ui.menu`: "volver al menú" / "back to menu"; `ui.seen`: "visto" / "seen").
  - Aceptación: v2-preguntas R9 (volver sin terminar no marca visto; "Seguir" sí), R11 (retomar en hub restaura `seen`; sesión antigua sin `seen` no falla; estado guardado en `cierre`/`giro` cae a inicio), v2-proyectos R4.
- [ ] 3a.3 Guion Ideas con hub
  - Archivos: `es.ts`, `en.ts` (`hub-ideas`: líneas "¿Qué quieres ver?" / "What do you want to see?", `doneLabel` "Ya vi suficiente" / "I have seen enough", opciones `ideas:exp` -> `exp-1`, `ideas:fav` -> `fav`, `ideas:raras` -> `raras` -> `duda`, `done: 'ya-se'`; `menu: 'hub-ideas'` en `exp-1`, `fav`, `raras`, `duda`; `next: 'hub-ideas'` en el último paso de cada rama; `afterQ2` y `a-ideas-otra-vez` apuntan a `hub-ideas` para Ideas) `[EDITORIAL]` etiquetas de las opciones.
  - Aceptación: v2-preguntas R3/R4/R7 (escenarios "abrir una rama" y "rama de dos pasos": `duda` siempre tras `raras`). `validate` pasa (hub bien formado, retorno, paridad es/en de `hub`).
- [ ] 3a.4 Verificación del slice
  - `npm run build` verde. Navegador: Ideas -> hub; abrir una rama, "Seguir", ver marca de visto; "volver al menú" sin marcar; "Ya vi suficiente" -> `ya-se`; abrir las 3 -> `ya-se` directo sin ver el hub; retomar en hub con `seen`; estado viejo sin `seen` no rompe.

---

## Slice 3b — Hubs de Resultados y Honestidad, Elegancia directo (~170 líneas)

Depende de: 3a. Solo guion es/en (sin cambios de cliente).

- [ ] 3b.1 Resultados con hub
  - Archivos: `es.ts`, `en.ts` (partir `num-1` en `num-1`, `num-2`, `num-prod`, un bloque cada uno; `hub-resultados` con `res:1`, `res:2`, `res:prod`; `menu`/`next` como en Ideas; `afterQ2` -> `hub-resultados`). Contenido provisional en `[[TODO]]` hasta el slice 4. `[EDITORIAL]` etiquetas ("Resultado 1", "Resultado 2", "El sistema en producción").
  - Aceptación: v2-preguntas R7 (tabla Resultados), R10. `validate` pasa.
- [ ] 3b.2 Honestidad con hub
  - Archivos: `es.ts`, `en.ts` (partir `real-1` en `real-1`, `real-2`, `real-3`; `hub-honestidad` con `hon:hizo`, `hon:aprende`, `hon:opinion`). `[EDITORIAL]` etiquetas ("Lo que hizo ella", "Lo que está aprendiendo", "Una opinión suya").
  - Aceptación: v2-preguntas R7 (tabla Honestidad), R10.
- [ ] 3b.3 Elegancia sin hub
  - Archivos: `es.ts`, `en.ts` (`afterQ2` y Q1 Elegancia -> `menos-1` -> `menos-2` -> `ya-se`; sin hub).
  - Aceptación: v2-preguntas R2 (escenario "Elegancia sin menú"); v2-experiencia R6 (final tras sus 3 proyectos).
- [ ] 3b.4 Verificación del slice
  - `npm run build` verde. Navegador: los 4 modos hasta `fin` en es y en; hubs de Resultados y Honestidad con vistos y "todo visto -> ya-se".

---

## Slice 4 — Contenido copiado de la v1, es + en (~260 líneas)

Depende de: 3a y 3b. Todo se COPIA a `src/v2/data`; ningún import de `src/data/v1.ts` (v2-proyectos R6). Leer `src/data/v1.ts` solo como fuente. Voz de la v2: tercera persona, breve; reescritura, no copia literal.

- [ ] 4.1 Líneas de los 6 proyectos
  - Archivos: `src/v2/data/projects.es.ts`, `projects.en.ts` (`line` desde `summary` de cada sistema; cueca: `music.text`; stack y enlaces).
  - Aceptación: v2-proyectos R2 (escenario "listado sin TODO de proyecto"; 6 con línea, stack y enlaces, es y en), v2-i18n R2 (paridad `projects`: largo, `url`, `stack.length`).
- [ ] 4.2 Favoritos y Resultados
  - Archivos: `es.ts`, `en.ts` (`fav`: Traductor, Incident Multiagent, Music Under the Hood; `num-1` Asistente de ventas `<3 s`; `num-2` SpeakFlow `<3 s` rotulado "en desarrollo"; `num-prod` Traductor `<5 s`, "Requisito de latencia", problema + restricción; línea de apertura "Números. Sin adjetivos."). `[EDITORIAL]` qué proyectos llenan favoritos y Resultado 1/2 (aquí por orden y cifra).
  - Aceptación: v2-proyectos R2 (escenario "contenido de la v1 en la sala"), v2-preguntas R7 (el sistema en producción = Traductor, < 5 s).
- [ ] 4.3 Elegancia y Honestidad "lo que hizo"
  - Archivos: `es.ts`, `en.ts` (`menos-1` x3: Traductor, Incident Multiagent, SpeakFlow; `real-1` desde `profile.statement` adaptado a tercera persona). `[EDITORIAL]` los 3 proyectos de Elegancia.
  - Aceptación: v2-proyectos R2; v2-preguntas R2.
- [ ] 4.4 Se queda `[[TODO]]` para Laura (NO rellenar)
  - `exp-1`, `raras` x2, `duda`, `real-2`, `real-3`, apertura de `hub-honestidad`/`real-1`, `ui.noscript.who`, en es y en.
  - Aceptación: v2-proyectos R2 escenario "contenido personal pendiente": `V2_STRICT=1` los reporta y solo esos.
- [ ] 4.5 Traducción al inglés `[EDITORIAL]`
  - Archivos: `en.ts`, `projects.en.ts`. Claude traduce con el mismo tono (decisión 6); misma estructura que es. Laura revisa el inglés después.
  - Aceptación: v2-proyectos R6, v2-i18n R2 (escenario "datos copiados en ambos idiomas"). Paridad estructural pasa.
- [ ] 4.6 Verificación del slice
  - `npm run build` verde; `V2_STRICT=1 npm run build` lista únicamente TODO personales. `/v2/proyectos` y `/en/v2/projects` sin TODO de proyecto. `grep` de `src/v2` por imports de `src/data` o `v1` = 0. Leer las ramas de Resultados/Favoritos/Elegancia en el navegador en es y en (sin desbordes por textos largos en 390 px).

---

## Slice 5 — W4 (44 px) y W5 (atajo sobre la portada) (~70 líneas)

Depende de: 1 (toca `.option`/`.continue`). Puede ir en cualquier punto tras 1, en paralelo con 3/4.

- [ ] 5.1 Objetivos táctiles de 44 px (W4)
  - Archivos: `Sala.module.css` (`--hit: 44px` en `.sala`; en `.stage` >= 1024 `--hit: calc(44px / var(--fit, 1))`; usar en `.option` (`min-height`, `min-width`, `padding-inline: 8px`), `.continue`, `.exits a`, `.shortcut`; QUITAR `min-height: 0` del atajo >= 1024), `src/v2/styles/tokens.css` (`.v2-lang`: `display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; min-width: 44px; min-height: 44px`; `z-index: 10`).
  - Aceptación: v2-responsive-a11y R3 (escenarios "controles cortos" y "enlace de idioma y atajo"). Medir con DevTools en 1440, 768 y 390: "Sí"/"No", idioma, atajo, "continuar", opciones, salidas >= 44x44 reales en pantalla.
- [ ] 5.2 Atajo sobre la portada de sonido (W5)
  - Archivos: `sala.client.ts` (`shortcut.hidden = false` antes de mostrar `gate`), `Sala.module.css` (`.shortcut { position: relative; z-index: 6 }`, en >= 1024 solo suma `z-index: 6`, por encima de `.gate` z 5).
  - Aceptación: v2-experiencia R5 (escenario "atajo con portada de sonido": en primera visita, ~1 s después, visible, por encima y activable; clic navega sin tocar la preferencia de sonido; Tab lo alcanza).
- [ ] 5.3 Verificación del slice
  - `npm run build` verde. Navegador en primera visita (borrar `localStorage`/`sessionStorage`): portada abierta + atajo visible y clicable. `prefers-reduced-motion` sin transiciones nuevas.

---

## Slice 6 — Specs, README y cierre (docs)

Depende de: 1-5 (3a, 3b, 4 incluidos).

- [ ] 6.1 Specs y README
  - Archivos: `openspec/changes/portfolio-v2-interactivo/specs/**` (revisar que reflejan lo implementado), README de v2 (avance del visitante, hubs, `seen`, hold, notas de aislamiento). No tocar `src/data/v1.ts` ni la v1.
  - Aceptación: coherencia con v2-experiencia R2/R5/R6/R8/R9, v2-preguntas R2/R3/R7-R11, v2-proyectos R2/R4/R6, v2-responsive-a11y R3-R6, v2-i18n R2.
- [ ] 6.2 Checklist manual en navegador (marcar cada ítem; anotar fallos)
  - [ ] Los 4 modos (Ideas, Resultados, Honestidad, Elegancia) recorridos hasta `fin`, en es y en.
  - [ ] Marcas de visto en cada hub (atenuada + "✓" + nombre accesible "(visto)"); reabrir una opción vista funciona.
  - [ ] "volver al menú" desde cada paso de una rama (incl. `raras` y `duda`): vuelve al hub y NO marca visto; "Seguir" marca visto.
  - [ ] Todo visto -> `ya-se` directo sin reaparecer el hub; "Ya vi suficiente" con solo una opción vista -> `ya-se`.
  - [ ] Retomar con estado viejo (sin `seen`, p. ej. un `v2.state` pegado a mano) no da error y `seen` vacío; retomar en hub/rama con `seen`; estado en paso eliminado cae a inicio.
  - [ ] Solo teclado: Tab/Enter/Espacio/ArrowRight por toda la sala, hub (foco en la primera no vista), "continuar", "volver al menú", atajo, idioma, salidas; foco visible; Enter con foco en un botón no avanza dos veces.
  - [ ] `prefers-reduced-motion`: `hold` sigue aplicando, cortes secos, el primer gesto salta la pausa.
  - [ ] Nada avanza solo (dejar 60 s en un paso con la pista visible); clic en enlace/atajo/idioma/opción no avanza; preguntas y hub no avanzan por clic suelto; doble toque < 250 ms ignorado.
  - [ ] Atajo visible sobre la portada de sonido en primera visita.
  - [ ] Viewports 1440, 768 y 390: sin desbordes, texto legible, hub con 4 botones cabe.
  - [ ] Objetivos táctiles >= 44x44 (medidos): "Sí"/"No", idioma, atajo, "continuar", opciones del hub, salidas.
  - [ ] Lector de pantalla (si es posible): anuncia líneas, aparición de "continuar", hub y "visto".
- [ ] 6.3 Verificación final
  - `npm run build` verde; `V2_STRICT=1 npm run build` falla solo por los TODO personales listados en 4.4; `git diff main -- src/data src/pages` de v1 = vacío (v1 intacta); sin imports de v1 desde `src/v2`. Generar `verify-report.md`.

---

## Items editoriales que Laura debe confirmar

1. Etiquetas de los hubs y sus opciones (3a.3, 3b.1, 3b.2) y textos "¿Qué quieres ver?" / "Ya vi suficiente".
2. Qué proyectos llenan Favoritos (Traductor, Incident Multiagent, Music Under the Hood), Resultado 1 / Resultado 2 (Asistente de ventas, SpeakFlow "en desarrollo") y los 3 de Elegancia (Traductor, Incident Multiagent, SpeakFlow) (4.2, 4.3).
3. Valores de `hold` (1.5).
4. Revisión del inglés provisional (4.5).
5. Contenido personal pendiente (4.4): experimento, cosas raras, lo que aprende, opinión, `ui.noscript.who`.

---

## Review Workload Forecast

| Slice | Estimado (líneas cambiadas) |
|---|---|
| 1 Avance del visitante | ~230 |
| 2 Modelo, motor y validación | ~230 |
| 3a Hub de Ideas + cliente | ~220 |
| 3b Resultados/Honestidad/Elegancia | ~170 |
| 4 Contenido v1 es+en | ~260 |
| 5 W4/W5 | ~70 |
| 6 Specs y cierre | docs |
| **Total código** | **~1180** |

- Estimated changed lines: ~1180 en total; ningún slice individual supera ~260.
- 400-line budget risk: Low por slice con 3 partido en 3a/3b (sin partir, el slice 3 serían ~380-400: Medium/High). El total supera 400, por lo que no cabe en un solo PR.
- Chained PRs recommended: Yes (7 PRs: 1, 2, 3a, 3b, 4, 5, 6).
- Decision needed before apply: Yes. Confirmar (a) cadena de PRs con la división 3a/3b en lugar del slice 3 único, y (b) que el slice 6 puede ser solo docs. Sin esa confirmación, `ask-on-risk` obliga a parar.

### Tabla de slices y dependencias

| Slice | Contenido | Depende de | Puede ir en paralelo con |
|---|---|---|---|
| 1 | Avance del visitante (sin auto-avance, `hold`, "continuar") | - | 2 |
| 2 | Modelo, motor, validación, paridad W7 | - (debe pasar con guion de 1) | 1 |
| 3a | Hub de Ideas + cliente del hub, vistos, volver al menú | 1, 2 | 5 |
| 3b | Hubs Resultados/Honestidad, Elegancia directo | 3a | 5 |
| 4 | Contenido v1 es+en | 3a, 3b | 5 |
| 5 | W4 (44 px) y W5 (atajo) | 1 | 2, 3a, 3b, 4 |
| 6 | Specs, README, checklist manual, verify | 1-5 | - |

Orden recomendado: (1 ‖ 2) -> 3a -> 3b -> 4; 5 tras 1 en cualquier punto; 6 al final.
