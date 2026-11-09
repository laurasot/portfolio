# Propuesta: portfolio-v2

## Intención

**Problema.** El portfolio v1 (secciones clásicas) dice qué hizo Laura Soto, pero no cómo piensa. Es intercambiable con cualquier otro portfolio.

**Por qué ahora.** El diseño ya está hecho: Figma (00 Fundamentos, 01 Storyboard, 02 Modos y estados, 04 Responsive; la 03 Inmersión está vacía) y un animatic en `v2/animatic.html`. Falta convertirlo en una experiencia real.

**Qué es.** Una experiencia en `/v2`: una estatua de piedra sentada, texto en tercera persona sobre Laura, dos preguntas al visitante y un final con salidas a Proyectos, Contacto y GitHub. Humor seco, con seguridad. Ni pretencioso, ni solemne, ni autocompasivo. No se define quién narra: solo texto sobre Laura.

**Éxito global.** Un visitante recorre las 4 escenas, recuerda la estatua y el tono, y llega a los proyectos reales. v1 sigue intacto en `/`.

## Decisiones tomadas

- SDD interactivo, store openspec, entrega `ask-on-risk`.
- **Dónde:** ruta `/v2` en este mismo repo Astro, con layout propio. v1 intacto.
- **Sin IA en la fase 1.** Sin LLM, sin endpoint, sin Cloudflare Function. Todo es un guion escrito (máquina de estados determinista). La IA queda como fase futura opcional, con la misma forma de datos (`line`, `pose`, `sospecha`, etc.).
- **Sin audio de voz.** Solo texto en pantalla. Portada opcional "¿Con sonido? Sí · No". La experiencia debe funcionar completa sin sonido.
- **Tono:** esperas cortas ("…" ~2 s, líneas separadas 1,2 s, fades de 600 ms). Sin porcentajes de confianza: "Sospechas" que terminan con "Puedo estar equivocada."
- **Atajo siempre visible** "Ir directo a proyectos →" desde el segundo 1, hacia una página de proyectos simple, sin estatua ni animación.
- **Sin enlace "versión clásica"** en `/v2` (v1 sigue en `/`).

### Las 4 escenas
1. El encuentro. 2. La conversación. 3. Experimentos y cosas raras (los errores son "cosas raras" ligeras, sin escena propia). 4. Final: "Eso es lo que sé de ella. / El resto está en su GitHub." + salidas Proyectos · Contacto · GitHub.

### Pregunta 1: "¿Qué te importa más cuando conoces a alguien?"
Cambia el comportamiento del sitio, no las secciones.

| Respuesta | Comportamiento |
|---|---|
| Ideas | Proceso primero. "Bien. Me salto la parte donde intento impresionarte." |
| Resultados | Números y proyectos rápido. "Perfecto. Te muestro números y no te quito más tiempo." |
| Honestidad | "Sin adornos": su parte real en proyectos de equipo, lo que aprende ahora, una opinión técnica. "Ok. Te cuento las cosas como son, sin adornos." |
| Elegancia | "Entonces menos." La UI quita sospecha y atajo uno a uno, fondo en modo hueso, 3 proyectos de una línea. Cierra: "Quité todo lo que sobraba. La cinta no, esa se queda." |

### Pregunta 2: "¿Qué admiras más?"
Cada respuesta trae una línea y la Sospecha #2.

| Respuesta | Línea | Sospecha |
|---|---|---|
| Ideas | "Ideas. Perfecto. / Tengo de sobra." | Te aburren las respuestas obvias. |
| Éxito | "Éxito. Me gusta. / A Laura también." | Te gustan las cosas que se terminan. |
| Dinero | "Respuesta honesta. / Casi nadie elige esa. Bueno, casi nadie lo admite." | No te convence mucho el marketing. |
| Reconocimiento | "Reconocimiento. / No te preocupes, no se lo voy a contar a nadie." | Lees los créditos al final de las películas. |

### Estatua (imágenes 2D por capas, sin 3D)
- 6 poses: base, pensando, cinta, duda, mira-cinta, giro (frontal, solo en el giro final).
- Cambio de pose con crossfade ~800 ms, leve inclinación de cabeza o espejo, post-its en el pedestal (cortes secos), una grieta pequeña con cinta que aparece en "cosas raras" y se queda, halo cálido solo cuando hay interés, respiración de 6 s.
- Placa solo en el cuadro final, con solo "Laura Soto". El giro final ocurre una sola vez (crossfade 2 s + leve squash en scaleX).
- Cámara: encuadre por escena 100% → 115% → 100–104%, 1,6 s ease, la línea del suelo se mueve la mitad (parallax). El texto aparece cuando la cámara termina. Zoom menor en tablet/móvil (110% / 106%).

## Alcance por fases

### Fase 0 - Diseño: hecha, falta el contenido
**Hecho:** Figma (páginas 00, 01, 02, 04), `v2/animatic.html` (se sirve con `.claude/launch.json`, config `animatic-v2`), imágenes de estatua en `v2/`.
**Falta (Laura):** escribir el contenido real (ver Riesgos): experimentos, "cosas raras", su parte real por proyecto, lo que aprende, opiniones, cifras de Resultados. La página 03 Inmersión de Figma queda vacía; no bloquea.

### Fase 1 - `/v2` guionado (este cambio)
**Dentro:**
- Ruta `/v2` con layout propio; una isla client-only y una máquina de estados determinista con el guion como datos tipados.
- Estatua 2D por capas, cámara, las 4 escenas, las 4 rutas de la Pregunta 1 y las respuestas de la Pregunta 2.
- Página de proyectos del atajo, con los 6 proyectos de v1 (Incident Multiagent, Traductor de lengua de señas, Asistente de ventas en tiempo real, SpeakFlow, Music Under the Hood, Interpretaciones de cueca): una línea, stack, enlaces, contacto y "← Volver a la sala".
- Responsive: desktop ≥1024 / tablet 768–1023 / móvil <768. Estatua abajo a la derecha al 100/85/62% (más pequeña en cuadros de contenido); texto de voz arriba a la izquierda de 44/36/28 px, nunca sobre la estatua; opciones en fila / wrap / apiladas; objetivos táctiles ≥44 px.
- Accesibilidad: HTML semántico, `aria-live` para las líneas, teclado completo, `prefers-reduced-motion` = cortes secos sin respiración, cámara ni giro; `noscript` con lo esencial (quién es, proyectos, contacto).
- Portada de sonido opcional; la música se enchufa solo si se resuelve la licencia.
- Contenido provisional (placeholders) claramente marcado donde falte texto de Laura.

**Fuera:** LLM, endpoint, 3D, cambios de comportamiento en v1.

### Fase futura opcional
- IA (LLM) redactando líneas con el mismo formato de datos, con validación y fallback al guion. Solo si se decide después de la fase 1.
- Estatua 3D (GLB), solo si el 2D no alcanza.

## Enfoque

- `/v2` en `src/pages/v2/` (portada y `proyectos`), `src/layouts/V2Layout.astro`, componentes en `src/components/V2/<Nombre>/<Nombre>.astro` + `.module.css`, guion en `src/data/v2/`. Una sola isla client-only, solo en `/v2`.
- **Assets:** `design/v2/` para animatic y referencias (no se publica); imágenes de estatua optimizadas en `src/assets/v2/` (Astro las optimiza). Recortes transparentes de alta resolución antes de producción.
- **Bilingüe (es/en):** todo el texto vive en el guion por idioma (`src/data/v2/es`, `src/data/v2/en`), nunca escrito dentro de los componentes. Suma ~15% al tamaño estimado y duplica el contenido que hay que escribir.
- **v2 autocontenida:** la v2 se moverá a otro repo más adelante. No importa nada de v1 (ni componentes, ni `BaseLayout`, ni `global.css`/`tokens.css`): tiene su propio layout, estilos, tokens y datos. Mudarla = copiar sus carpetas.
- **Datos de proyectos:** se duplican en `src/data/v2/` (copiados de `src/components/Projects/Projects.astro`). v1 no se toca.
- La máquina de estados es el contrato: cada nodo es un dato (`line`, `pose`, `sospecha`, efectos de UI), así una IA futura puede ocupar el mismo lugar.
- Verificación: `npm run build` (no hay test runner) más revisión manual en tres anchos y con `prefers-reduced-motion`.

## Áreas afectadas

- Nuevas: `src/pages/v2/*`, `src/layouts/V2Layout.astro`, `src/components/V2/*`, `src/data/v2/*`, `src/assets/v2/*`, `design/v2/*`.
- v1 no se toca.
- Preexistentes: `BaseLayout` referencia `/ico.png`, que no existe en `public/`; `astro.config.mjs` no tiene `site`; no hay config de despliegue (hosting por decidir, con estático alcanza).
- No se usan `RULES.md`, configs de eslint, `.cursor/rules` ni `tsconfig.app/node.json` (restos obsoletos de React).

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **Contenido que solo Laura puede escribir** (experimentos, cosas raras, parte real por proyecto, aprendizaje, opiniones, cifras): ruta crítica. | Placeholders marcados en el código; Claude propone borradores, Laura reescribe. No publicar con placeholders. |
| **Música "Last Hour" de FKJ tiene derechos de autor**: necesita licencia. | Opcional y desactivada por defecto; la experiencia funciona completa sin ella. Alternativas: licenciar, pista libre o sin música. |
| **Imágenes de estatua de baja resolución y fondo blanco roto**: se verían mal con capas y zoom 115%. | Conseguir recortes transparentes de alta resolución antes de producción; mientras tanto, desarrollar con las actuales. |
| **Sin enlace a v1**: impacientes, lectores de pantalla o sin JS pueden perderse. | Atajo a proyectos desde el segundo 1, `noscript`, `aria-live`, teclado, reduced-motion. |
| **Rendimiento en móvil** (capas, cámara, imágenes). | Imágenes optimizadas, solo transform/opacity, zoom reducido, degradación con reduced-motion. |
| **Tamaño del PR**: ver estimación. | PRs encadenados. |

## Estimación de tamaño y entrega

Fase 1: ~1.500–2.200 líneas cambiadas sin contar binarios (guion y datos ~300, máquina de estados y isla ~400, componentes y CSS ~700–900, página de proyectos ~200, layout y config ~100). **Supera el presupuesto de 400 líneas por PR: se recomiendan PRs encadenados**, por ejemplo: (1) assets, layout y esqueleto de `/v2` + atajo a proyectos; (2) máquina de estados y guion (con placeholders); (3) estatua, cámara y animación; (4) responsive, accesibilidad y sonido. Decisión final en la fase de tareas.

## Plan de reversión

Todo es aditivo y vive en `/v2`. Revertir = borrar la ruta y sus archivos, o no enlazarla. v1 no cambia.

## Criterios de éxito

- `/v2` recorre las 4 escenas y las 4 rutas de la Pregunta 1 con las 4 respuestas de la Pregunta 2, sin IA ni servidor.
- El atajo lleva a la página de proyectos sin estatua en cualquier momento, y "← Volver a la sala" regresa.
- Funciona sin sonido, con teclado, con `aria-live` y con `prefers-reduced-motion`; `noscript` presente.
- Responsive correcto en los tres anchos, con objetivos táctiles ≥44 px.
- `npm run build` pasa; v1 sin cambios visibles.
- No hay placeholders en lo publicado.

## Preguntas abiertas

1. Música "Last Hour" de FKJ (licencia o alternativa): **se ve después**. Fase 1 deja el sonido listo pero sin pista.
2. Recortes transparentes de alta resolución de la estatua: **los hace Laura después**. Fase 1 se desarrolla con las imágenes actuales.
3. Contenido real (los textos entre corchetes del diseño): Claude propone borradores a partir de v1 y LinkedIn, Laura los corrige. Antes de publicar.
4. ~~Datos de proyectos compartidos o duplicados~~ → **resuelto: duplicar** (v2 se moverá a otro repo).
5. ~~Idioma~~ → **resuelto: español e inglés.** El guion se escribe en los dos idiomas (el humor se adapta, no se traduce literal). Por definir en diseño: cómo se elige el idioma (detección del navegador + selector discreto) y las rutas (`/v2` y `/en/v2`).
6. Hosting y dominio: **Laura ya los tiene** (se configuran al publicar). La v2 es estática, así que no requiere nada especial. Fecha: por definir.
