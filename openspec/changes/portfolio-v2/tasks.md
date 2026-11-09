# Tareas: portfolio-v2

Entradas: `proposal.md`, `specs/*/spec.md` (R# = requisito), `design.md`. Sin test runner: la verificación de cada tarea es `npm run build` en verde + la comprobación manual indicada. Estilo: Prettier (semi, singleQuote, 2 espacios, 100 cols, trailingComma all). Sin dependencias nuevas. v1 no se toca.

Supuestos aprobados:
1. "← Volver a la sala" retoma el paso guardado; entrar directo a proyectos (sin visita previa) empieza de cero.
2. La variante "Ideas otra vez" solo si Q1 = Ideas y Q2 = Ideas.
3. Redirección de idioma solo en la primera entrada a `/v2` sin preferencia guardada; los enlaces compartidos mantienen su idioma.
4. Todo el código v2 en `src/v2/` (+ páginas); archivos de diseño a `design/v2/` (no se publica); las 6 poses usadas pasan a `src/v2/assets/poses/` con nombre = id de pose. Los PNG originales se MUEVEN, no se borran.

Cada PR ≤400 líneas cambiadas (sin binarios), compila solo y se puede fusionar solo; los siguientes se apoyan en los anteriores.

---

## PR 1 — Esqueleto v2: layout, tokens, proyectos, páginas, idioma (~380 líneas)

Resultado: `/v2`, `/en/v2`, `/v2/proyectos`, `/en/v2/projects` existen y compilan. La sala es un stub (título + atajo + selector de idioma).

- [x] 1.1 Mover archivos de diseño y poses
  - Archivos: `v2/animatic.html` y PNG de referencia -> `design/v2/`; 6 PNG usados -> `src/v2/assets/poses/{base,pensando,cinta,duda,mira-cinta,giro}.png` (mover con `git mv`/mover, no borrar el resto).
  - Aceptación: `v2/` ya no es publicado; `npm run build` verde. Spec v2-aislamiento R5 (assets y diseño), R2 (v2 autocontenida).
- [x] 1.2 Tipos y poses
  - Archivos: `src/v2/data/types.ts` (Script, Step, Option, Next, Block, Project, PoseId, Mode, Q2), `src/v2/data/poses.ts` (mapa pose -> imagen, `RENDER = 'crop' | 'cutout'`).
  - Aceptación: `astro check`/build sin errores TS strict. Specs v2-experiencia R7 (guion como datos), v2-estatua R1 (seis poses), R10 (imágenes provisionales).
- [x] 1.3 Tokens y layout
  - Archivos: `src/v2/styles/tokens.css` (paleta blanco/hueso, fuentes, tiempos 1600/800/600/1200/2000 como variables, `ease`), `src/v2/layouts/V2Layout.astro` (`<html lang>`, fuentes, `hreflang` relativos, selector EN/ES que guarda `localStorage('v2.lang')`, detección `<script is:inline>` con try/catch solo en `/v2` y solo sin preferencia).
  - Aceptación: en `/v2` con `navigator.language=en` y sin preferencia redirige a `/en/v2`; con preferencia guardada o en `/en/v2` no redirige; `<html lang>` correcto. Spec v2-i18n R3, R4; v2-experiencia R2 (tiempos como variables).
- [x] 1.4 Datos de proyectos (es/en)
  - Archivos: `src/v2/data/projects.es.ts`, `src/v2/data/projects.en.ts` (6 proyectos; descripciones en `[[TODO: …]]` donde falte contenido; enlaces/stack reales de v1 solo se copian, no se importan).
  - Aceptación: 6 entradas por idioma, sin imports desde `src/data` de v1. Spec v2-proyectos R2, R5.
- [x] 1.5 Componente Proyectos
  - Archivos: `src/v2/components/Proyectos/Proyectos.astro`, `Proyectos.module.css` (sin JS, lista de proyectos, contacto, enlace "← Volver a la sala" a `/v2` o `/en/v2`; todo el texto viene por props).
  - Aceptación: abrir `/v2/proyectos`: 6 proyectos, contacto, enlace de vuelta; funciona con JS desactivado. Spec v2-proyectos R1, R2, R3, R4 (la parte de enlace; el resume llega en PR 4).
- [x] 1.6 Cuatro páginas finas y sala stub
  - Archivos: `src/pages/v2/index.astro`, `src/pages/v2/proyectos.astro`, `src/pages/en/v2/index.astro`, `src/pages/en/v2/projects.astro` (la sala es un stub: `h1` con el nombre + atajo "Ir directo a proyectos →" real `<a>` + selector de idioma).
  - Aceptación: las 4 rutas devuelven 200 en `npm run preview`; el selector lleva a la página equivalente; las rutas v1 (`/`, etc.) siguen idénticas (diff de `dist` de v1 sin cambios). Specs v2-i18n R1/R3, v2-aislamiento R1, R3, v2-experiencia R5 (atajo).

---

## PR 2 — Motor puro, validación y guion `es.ts` (~380 líneas)

Depende de PR 1. Resultado: el guion completo en español (con TODOs) se valida durante el build; aún no se ve en pantalla.

- [x] 2.1 Motor puro
  - Archivos: `src/v2/components/Sala/engine.ts` (`createState`, `resolve(next, state)`; sin DOM; incluye un bloque de asserts de autocomprobación para `resolve` con `Next` simple y `by:'mode'`/`by:'q2'`).
  - Aceptación: los asserts corren en build (importados por `validate.ts`) y no fallan; una ruta rota los hace fallar. Spec v2-preguntas R6 (determinismo), v2-experiencia R7.
- [x] 2.2 Validación del grafo y placeholders
  - Archivos: `src/v2/data/validate.ts` (falla siempre si: `start`/`next`/`to` inexistentes, pasos inalcanzables, `by` sin todas las ramas; busca `/\[\[TODO/` y avisa con conteo + ids; con `V2_STRICT=1` lanza error).
  - Aceptación: `npm run build` imprime aviso con conteo; `V2_STRICT=1 npm run build` falla mientras haya TODOs. Spec v2-aislamiento R4 (placeholders detectables), R3 (build).
- [x] 2.3 Guion `es.ts` — escenas 1–2 y Q1/Q2
  - Archivos: `src/v2/data/es.ts` (parte 1: portada, escena de entrada, Q1 con 4 modos, Q2 con 4 respuestas, "Ideas otra vez" solo Q1=Ideas y Q2=Ideas, Sospechas, atajo `ui.exit`, `ui` completo, notas Hz del animatic).
  - Aceptación: validación pasa; Elegancia no trae `sospecha` ni `ui.exit` en sus pasos; una sola línea por vez (`lines` ordenadas). Specs v2-preguntas R1–R5, v2-experiencia R1, R3, R5.
- [x] 2.4 Guion `es.ts` — cierre, ramas por modo, final y salidas
  - Archivos: `src/v2/data/es.ts` (parte 2: `cierre` con `next:{by:'mode'}`, ramas ideas/resultados/honestidad/elegancia con `blocks` y `[[TODO: …]]`, escena final con `plaque: 'Laura Soto'`, pose `giro`, `ui.exits`).
  - Aceptación: todos los pasos alcanzables desde `start`; el último paso no tiene `next`; las salidas son el sitio/proyectos/contacto. Specs v2-experiencia R1, R6, v2-estatua R6, R7.
- [x] 2.5 Llamar a `validate` desde las páginas
  - Archivos: `src/pages/v2/index.astro` (importa `es.ts`, llama `validate`).
  - Aceptación: romper un `next` a propósito hace fallar el build (revertir tras comprobar). Spec v2-aislamiento R3, R4.

---

## PR 3 — Guion `en.ts` y componente `Sala.astro` (~330 líneas)

Depende de PR 2. Resultado: `/v2` y `/en/v2` renderizan el escenario estático (poses, plantillas, JSON, noscript) sin animación.

- [x] 3.1 Guion `en.ts`
  - Archivos: `src/v2/data/en.ts` (misma forma e ids que `es.ts`; texto en inglés; TODOs donde no haya contenido de Laura).
  - Aceptación: `validate(en)` pasa; mismos ids de pasos que `es.ts` (comprobación en `validate.ts` o assert de paridad de claves). Spec v2-i18n R1, R2.
- [x] 3.2 `Sala.astro`: escenario, plantillas y JSON
  - Archivos: `src/v2/components/Sala/Sala.astro` (frontmatter con `getImage` webp 1536 por pose; `#cam` con 6 capas `--img:url(...)`; `<template>` para línea, opción, post-it, placa, bloque, sospecha; `<script type="application/json" id="v2-script">`; `main`, `h1` oculto, `#text aria-live="polite"`, `nav` de salidas; `data-render` según `RENDER`), `src/v2/components/Sala/Sala.module.css` (mínimo: clases referenciadas, sin diseño).
  - Aceptación: en `/v2` y `/en/v2` el HTML contiene las 6 capas, el JSON de ese idioma y ningún texto escrito en el componente (todo viene del guion). Specs v2-estatua R1, R9 (solo transform/opacity), v2-i18n R2, v2-responsive-a11y R5.
- [x] 3.3 `<noscript>`
  - Archivos: `Sala.astro` (usa `ui.noscript` + `projects`).
  - Aceptación: con JS desactivado se ve quién es, lista de proyectos, enlace a proyectos, contacto. Spec v2-responsive-a11y R7.
- [x] 3.4 Conectar las páginas
  - Archivos: `src/pages/v2/index.astro`, `src/pages/en/v2/index.astro` (reemplazan el stub por `<Sala lang=... />`).
  - Aceptación: `npm run build` verde; ambas rutas muestran el escenario; v1 sin cambios. Specs v2-aislamiento R1, v2-i18n R3.

---

## PR 4 — Runtime del cliente (`sala.client.ts`) (~300 líneas)

Depende de PR 3. Resultado: la experiencia funciona (secuencia, opciones, teclado, resume) con estilo aún básico.

> Nota de PR 2: la sospecha vigente debe **mantenerse visible** en los pasos siguientes (p. ej. en `q2`) hasta que otro paso traiga una nueva o el modo Elegancia la quite; los pasos compartidos no la repiten.

- [x] 4.1 Estado, resume y cortes secos
  - Archivos: `src/v2/components/Sala/sala.client.ts` (lee JSON; `sessionStorage('v2.state')` en try/catch; valida que el id exista, si no empieza de cero; estado válido = sin portada y corte seco; aplica pose/tilt/flip/plaque/postit/light/ui/sospecha/`dataset.mode`).
  - Aceptación: recargar a mitad retoma ese paso; estado con id inexistente cae al inicio; con `sessionStorage` bloqueado no hay error. Specs v2-proyectos R4 (resume, supuesto 1), v2-estatua R2, R4, R7.
- [x] 4.2 Secuencia cámara -> líneas -> opciones
  - Archivos: `sala.client.ts` (objeto `T` único; cámara efectiva con factor por breakpoint y espera 1600 ms; líneas añadidas al DOM cada 1200 ms con fade 600 ms; opciones esperan; elegir marca `.pick`, aplica `set`, 1200 ms, `enter(resolve(to))`; `blocks`; `hold`; paso final deja las salidas; giro único con squash).
  - Aceptación: el recorrido Q1->Q2->cierre->rama->final funciona en los 4 modos; texto solo sobre Laura (zona propia). Specs v2-experiencia R2, R3, R4, R6, v2-preguntas R1–R4, v2-estatua R3, R6, R8.
- [x] 4.3 Teclado y foco
  - Archivos: `sala.client.ts` (teclas 1–4 eligen; Enter/→ salta `hold`; foco al primer botón al aparecer opciones sin robar el foco existente).
  - Aceptación: recorrer la experiencia solo con teclado; foco visible. Spec v2-responsive-a11y R4, R5.
- [x] 4.4 Atajo y vuelta desde proyectos
  - Archivos: `sala.client.ts` (el atajo conserva el estado en `sessionStorage` antes de navegar), `Proyectos.astro` si hace falta.
  - Aceptación: en medio de la experiencia, atajo -> proyectos -> "← Volver a la sala" retoma el paso; abrir `/v2/proyectos` directo y pulsar volver empieza de cero. Specs v2-proyectos R4, v2-experiencia R5.

---

## PR 5 — Estilos: estatua, cámara, responsive, tema hueso (~380 líneas)

Depende de PR 4 (puede ir en paralelo con 4 si se acuerda el contrato de clases/`data-*` de 3.2).

> Nota de PR 2: los pasos compartidos del final (`ya-se`, `quien`, `giro`) traen `ui.exit`; en `html[data-mode="elegancia"]` el atajo y la sospecha se ocultan por CSS.

- [x] 5.1 Escenario y estatua
  - Archivos: `src/v2/components/Sala/Sala.module.css` (espacio 1440×900, `#cam` con `transform-origin: 1040px 340px`, translate+scale con transición 1600 ms, suelo partido con parallax, 6 capas con crossfade 800 ms, recorte CSS + multiply + filter + máscara, `.breathe` 6 s, giro 2 s + squash, halo, post-it/placa con corte seco; solo `transform`/`opacity` animados).
  - Aceptación: se ve igual que `design/v2/animatic.html` lado a lado a 1440×900. Specs v2-estatua R1–R9.
- [x] 5.2 Imágenes: modo `cutout`
  - Archivos: `Sala.module.css` (bloque `[data-render="cutout"]`: `background-size: contain; background-position: bottom`), `poses.ts` (documentar constante).
  - Aceptación: cambiar `RENDER` a `'cutout'` no requiere tocar el runtime y la estatua sigue visible. Spec v2-estatua R10.
- [x] 5.3 Tema hueso y tipografía
  - Archivos: `tokens.css`/`Sala.module.css` (`html[data-mode="elegancia"]` hueso, tamaños de voz 44/36/28).
  - Aceptación: en modo Elegancia el fondo pasa a hueso; contraste de `--suave` ≥4,5:1 en blanco y hueso (medido). Specs v2-preguntas R2, v2-responsive-a11y R2.
- [x] 5.4 Responsive fluido
  - Archivos: `Sala.module.css`, `sala.client.ts` (`matchMedia('(min-width:1024px)')`, `fit()` solo en desktop; en <1024 grid fluido con `scale(k_efectiva)` y origen en la estatua; estatua 100/85/62 %, cámara 115/110/106 %; opciones apiladas con alto ≥44 px en móvil; bloques con scroll interno).
  - Aceptación: revisar a 1440, 768 y 390 px: texto nunca sobre la estatua, sin recorte de texto, objetivos ≥44 px. Specs v2-responsive-a11y R1, R2, R3, v2-experiencia R4.

---

## PR 6 — Sonido, movimiento reducido y verificación final (~180 líneas)

Depende de PR 5.

- [ ] 6.1 Sonido opt-in
  - Archivos: `src/v2/components/Sala/sound.ts` (`note(hz)` WebAudio perezoso; `TRACK: string | null = null`; preferencia en `sessionStorage('v2.sound')`), portada con Sí/No en `sala.client.ts`/`Sala.astro`.
  - Aceptación: por defecto no suena nada; con "Sí" suenan las notas de las opciones; con "No" nada. Spec v2-responsive-a11y R8.
- [ ] 6.2 `prefers-reduced-motion`
  - Archivos: `sala.client.ts` (`T` = 0 con la media query), `Sala.module.css` (sin respiración, cámara ni squash).
  - Aceptación: con la preferencia activa todo son cortes secos y sigue siendo completable. Spec v2-responsive-a11y R6.
- [ ] 6.3 `V2_STRICT` y revisión final
  - Archivos: documentar en el README de `src/v2/` cómo lanzar `V2_STRICT=1 npm run build` (en PowerShell: `$env:V2_STRICT=1; npm run build`; sin dependencia `cross-env`), ajustes menores de a11y.
  - Aceptación: `npm run build` verde con avisos; `V2_STRICT=1` falla con TODOs; `grep -r "\[\[TODO" dist` los lista; pasada manual en 1440/768/390 y con teclado + lector de pantalla básico. Specs v2-aislamiento R3, R4, v2-responsive-a11y R1–R8.

---

## Contenido (Laura) — no es tarea de código

El código se entrega con `[[TODO: …]]`. Laura debe escribir, en **español e inglés**:
- [ ] C.1 Líneas de la portada y de la escena de entrada.
- [ ] C.2 Pregunta 1 y sus 4 respuestas; respuestas de Q2 (4) y variante "Ideas otra vez".
- [ ] C.3 Las dos Sospechas (texto y eyebrow) y los post-its.
- [ ] C.4 Cierre y las 4 ramas (Ideas, Resultados, Honestidad, Elegancia): experimentos, números, cosas raras, "menos".
- [ ] C.5 Final: texto del giro, nombre en placa, salidas y contacto.
- [ ] C.6 Descripciones de los 6 proyectos (es + en), stack y enlaces verificados.
- [ ] C.7 Textos de `<noscript>`, selector de idioma y proyectos (`ui`).

## Assets (Laura)

- [ ] A.1 Recortes transparentes en alta resolución de las 6 poses (base, pensando, cinta, duda, mira-cinta, giro), mismo encuadre.
- [ ] A.2 Reemplazar los PNG en `src/v2/assets/poses/`, cambiar `RENDER` a `'cutout'` y ajustar `--crop-*` si cambia el encuadre.
- [ ] A.3 (Opcional) pista de audio para `TRACK`.

## Antes de publicar

- [ ] P.1 `V2_STRICT=1 npm run build` en verde (cero `[[TODO`); `grep -r "\[\[TODO" dist` vacío.
- [ ] P.2 Definir `site` en `astro.config.mjs` y pasar `hreflang`/sitemap a URLs absolutas.
- [ ] P.3 Configuración de hosting: rutas `/v2`, `/en/v2`, `/v2/proyectos`, `/en/v2/projects` (sin redirecciones de servidor que rompan la detección cliente).
- [ ] P.4 Decidir autoalojar fuentes (`@fontsource`) si el FOUT molesta.
- [ ] P.5 Comprobar que `design/v2/` no se publica.

---

## Review Workload Forecast

Estimated changed lines: 1950
400-line budget risk: High
Chained PRs recommended: Yes
Decision needed before apply: Yes

| Slice | Alcance | Líneas est. | Depende de |
|---|---|---|---|
| 1 | Mover diseño/poses, layout, tokens, tipos, proyectos, 4 páginas, idioma (sala stub) | ~380 | — |
| 2 | `engine.ts`, `validate.ts`, `es.ts` completo | ~380 | 1 |
| 3 | `en.ts`, `Sala.astro` (escenario, plantillas, JSON, noscript) | ~330 | 2 |
| 4 | `sala.client.ts` (estado, secuencia, teclado, resume) | ~300 | 3 |
| 5 | `Sala.module.css` (estatua, cámara, responsive, tema hueso) | ~380 | 4 |
| 6 | Sonido, reduced-motion, `V2_STRICT`, revisión final | ~180 | 5 |

Nota: PR 2 y 3 se pueden intercambiar parcialmente (3.1 `en.ts` no depende de 2.x salvo `validate.ts`); PR 5 puede ir en paralelo con PR 4 si se fija el contrato de clases en 3.2.
