# Diseño: portfolio-v2

Base: `proposal.md` y el prototipo `v2/animatic.html` (se mueve a `design/v2/`). El diseño porta el animatic a Astro tal cual: mismas constantes, mismo motor de pasos, pero con el guion como datos tipados por idioma y un solo script de cliente. No se inventa un motor nuevo.

## 1. Arquitectura

Salida 100% estática. Una página de sala (con una `<script>` de Astro en TypeScript, sin React ni dependencias nuevas) y una página de proyectos sin JS.

Todo el código v2 vive bajo **una carpeta, `src/v2/`**, más las páginas (Astro obliga a que estén en `src/pages`). Mudar la v2 = copiar `src/v2/`, `src/pages/v2/`, `src/pages/en/v2/`. (Desvío menor de la propuesta, que repartía en `src/components/V2`, `src/data/v2`, `src/assets/v2`: aquí van todas dentro de `src/v2/`.)

```
src/
  pages/
    v2/index.astro            # sala es      -> <Sala lang="es" />
    v2/proyectos.astro        # proyectos es -> <Proyectos lang="es" />
    en/v2/index.astro         # sala en
    en/v2/projects.astro      # proyectos en
  v2/
    layouts/V2Layout.astro    # <html lang>, fuentes, tokens, selector de idioma, detección
    styles/tokens.css         # paleta (blanco / hueso "Elegancia"), tipografías, tiempos
    components/
      Sala/Sala.astro         # escenario, <template>s, JSON del guion, <noscript>
      Sala/Sala.module.css
      Sala/sala.client.ts     # <script>: runtime (estado, tiempos, DOM, resume)
      Sala/engine.ts          # puro: resolve(next,state), createState (sin DOM)
      Sala/sound.ts           # WebAudio opt-in
      Proyectos/Proyectos.astro + Proyectos.module.css
    data/
      types.ts                # Script, Step, Option, Next, Project...
      es.ts  en.ts            # export default <Script> (TODO el texto)
      poses.ts                # PoseId, RENDER (crop | cutout), mapa pose -> imagen
      validate.ts             # grafo + marcador [[TODO: ...]]
    assets/poses/             # base.png pensando.png cinta.png duda.png mira-cinta.png giro.png
design/v2/                    # animatic.html + referencias (no se publica)
```

`astro.config.mjs` no cambia (sin i18n de Astro, sin `site`). v1 no se toca.

## 2. Modelo de datos

El guion es un grafo de pasos serializable (sin funciones), así un LLM futuro puede producir los mismos objetos.

```ts
// src/v2/data/types.ts
export type PoseId = 'base' | 'pensando' | 'cinta' | 'duda' | 'mira-cinta' | 'giro';
export type Mode = 'ideas' | 'resultados' | 'honestidad' | 'elegancia';
export type Q2 = 'ideas' | 'exito' | 'dinero' | 'reconocimiento';

/** Destino: un id, o ramificado por una variable del estado. */
export type Next = string | { by: 'mode' | 'q2'; to: Record<string, string> };

export interface Option {
  label: string;
  to: Next;                         // p. ej. Q2 "Ideas" tras Q1 "Ideas" -> paso "ideas otra vez"
  set?: { mode?: Mode; q2?: Q2 };   // efecto sobre el estado
  note?: number;                    // Hz de la nota (solo si hay sonido)
}

export interface Block { eyebrow: string; title: string; body?: string }

export interface Step {
  id: string;
  lines?: string[];                 // una por vez, 1,2 s entre sí
  pose: PoseId;
  tilt?: number;                    // grados (cabeza hacia ti)
  flip?: boolean;                   // espejada (mira a otro lado)
  camera: number;                   // k del animatic: 1 | 1.15 | 1.02 | 1.04
  light?: boolean;                  // halo cálido (solo con interés)
  postit?: string;                  // corte seco
  plaque?: string;                  // solo en el cuadro final: "Laura Soto"
  sospecha?: { eyebrow: string; text: string };   // el pie "Puedo estar equivocada." va en ui
  ui?: { exit?: boolean; exits?: boolean };       // atajo / salidas finales
  blocks?: Block[];                 // contenido (experimentos, proyectos, cosas raras)
  top?: number;                     // y del texto en el escenario (330 por defecto, 220 con bloques)
  dim?: boolean;                    // atenúa la línea anterior
  hold?: number;                    // ms antes de avanzar solo (tras cámara + líneas)
  options?: Option[];               // si existe, espera respuesta; si no, usa next
  next?: Next;                      // ausente = paso final
}

export interface Project { name: string; line: string; stack: string[]; links: { label: string; url: string }[] }

export interface Script {
  lang: 'es' | 'en';
  start: string;                    // id del primer paso
  steps: Record<string, Step>;
  ui: {                             // todo el texto fijo, incluido el de los componentes
    soundPrompt: string; yes: string; no: string; exit: string; sospechaFoot: string;
    exits: { label: string; href: string }[];
    projectsTitle: string; projectsBack: string; contact: string;
    langSwitch: { label: string; href: string };
    noscript: { who: string };
  };
  projects: Project[];
}
```

Ejemplo (extracto de `es.ts`):

```ts
steps: {
  q1: { id: 'q1', pose: 'pensando', camera: 1.15, postit: 'no hay respuesta incorrecta', ui: { exit: true },
    lines: ['¿Qué te importa más cuando conoces a alguien?'],
    options: [
      { label: 'Ideas',      set: { mode: 'ideas' },      to: 'r-ideas', note: 392 },
      { label: 'Elegancia',  set: { mode: 'elegancia' },  to: 'r-elegancia', note: 587.33 },
      /* resultados, honestidad */ ] },
  'q2-ideas': { /* mismo q2 pero lines distintas si mode=ideas */ },
  'cierre': { id: 'cierre', pose: 'cinta', camera: 1.02, next: { by: 'mode', to: { ideas: 'exp-01', resultados: 'num-01', honestidad: 'real-01', elegancia: 'menos-01' } } },
}
```

Reglas del grafo:
- **Modos**: no hay lógica en el motor; cada modo es una rama de pasos escritos (`Next.by='mode'`). "Elegancia" quita sospecha y atajo paso a paso simplemente porque esos pasos no traen `sospecha` ni `ui.exit`. El tema hueso lo da CSS con `html[data-mode="elegancia"]` (el motor solo escribe `dataset.mode`).
- **Q2** y "Ideas otra vez": `set.q2` guarda la respuesta; `Option.to` puede ser `{ by:'mode', to:{ ideas:'q2-ideas-otra-vez', ... } }`. La Sospecha #2 es el campo `sospecha` del paso de respuesta.
- **Placeholders**: cualquier cadena puede contener `[[TODO: ...]]`.
- **IA futura**: un generador devuelve `Step` con `next` ya resuelto; el motor no distingue.

## 3. Flujo de ejecución

`engine.ts` (puro, sin DOM): `createState() -> {step, mode?, q2?}` y `resolve(next, state) -> id`. `validate.ts` hace los asserts de sí mismo (ver 9). `sala.client.ts` es el port del `show()` del animatic:

```
init: lee <script type="application/json" id="v2-script"> (guion de ese idioma)
      state = sessionStorage('v2.state') ?? createState(); si hay estado -> sin portada, corte seco
enter(step):
  1 clear timers; guarda state en sessionStorage (try/catch)
  2 cortes secos inmediatos: pose (crossfade 800 ms), tilt/flip, plaque, postit, light, ui.exit/exits, sospecha,
    dataset.mode
  3 cámara: efectiva = 1 + (k-1)*factor(breakpoint); si cambió, wait 1600 ms (0 con reduced-motion)
  4 líneas: se AÑADEN al DOM al revelarse (para aria-live), separadas 1200 ms, fade 600 ms
  5 options -> aparecen (600 ms) y esperan clic/teclado; elegir: marca .pick, nota, aplica set, 1200 ms,
    enter(resolve(option.to, state))
    blocks -> fade 600 ms
    sin options y con next -> tras hold ms enter(resolve(next))
    sin next -> fin (quedan las salidas)
```

Las constantes (1600/800/600/1200/2000, `ease`) pasan a variables CSS en `tokens.css`; el script lee los ms de un único objeto `T`. El giro (única vez) se detecta como en el animatic: `pose==='giro'` y la capa aún no activa -> crossfade 2 s + `squash`.

Teclado: opciones son `<button>`; teclas 1–4 eligen; `Enter`/`→` salta la espera (`hold`) del paso actual. Sin botones prev/play del animatic (eran herramientas de diseño).

Resume: al abrir `proyectos` desde el atajo, el estado ya está en `sessionStorage`. "← Volver a la sala" es un `<a>` a `/v2` (o `/en/v2`); al cargar con estado válido (el id existe en el guion) se retoma en ese paso con corte seco y sin portada de sonido. Si falla `sessionStorage` o el id no existe, empieza de cero.

## 4. Estatua y cámara

Se reutiliza el animatic literal:
- Espacio de diseño **1440×900**, `#cam` con `transform-origin: 1040px 340px` y `transform: translate(-(k-1)*180px, -(k-1)*430px) scale(k)`; transición 1600 ms.
- Línea del suelo partida alrededor del pedestal, se mueve la mitad (parallax): `sx = 1040-(k-1)*180`, `y = 780+(k-1)*40`.
- Poses: 6 capas apiladas, `opacity` con crossfade; `.breathe` 6 s; `poseWrap` para tilt/flip/squash.
- Recorte CSS (`background-size:1536px 1024px; background-position:-990px -380px`) + `mix-blend-mode:multiply` + `brightness/contrast` + máscara de bordes.

Cambios al portarlo:
- Imágenes en `src/v2/assets/poses/<pose-id>.png`. En el frontmatter de `Sala.astro`: `getImage({ src, format: 'webp', width: 1536 })` por pose (mismo tamaño, así el recorte sigue siendo válido) y la URL va en `style="--img:url(...)"` de cada capa. No se usa `<Image>` porque el recorte es CSS `background`.
- `poses.ts` exporta `RENDER = 'crop' | 'cutout'`. Con `'cutout'`, `Sala.astro` pone `data-render="cutout"` y el CSS sustituye el bloque *crop + multiply + filter + mask* por `background-size: contain; background-position: bottom` sin tocar el runtime. Cambio de assets = reemplazar PNG y cambiar esa constante (y, si el encuadre cambia, `--crop-*`).
- Solo `transform` y `opacity` se animan.
- Placa y post-it: elementos dentro de `#cam`, corte seco (`hidden`).

## 5. i18n

Sin la config i18n de Astro (no cambia `astro.config.mjs`, no afecta v1). Cuatro páginas finas, una por idioma y vista:

| Vista | es (por defecto) | en |
|---|---|---|
| Sala | `/v2` | `/en/v2` |
| Proyectos | `/v2/proyectos` | `/en/v2/projects` |

Cada página importa su guion (`es.ts` o `en.ts`) y lo pasa a `Sala`/`Proyectos`; los componentes no contienen texto. `ui.langSwitch.href` apunta a la página equivalente del otro idioma.

Detección: un `<script is:inline>` mínimo en `V2Layout`, solo en las salas de entrada (`/v2`), con `localStorage('v2.lang')`: si no hay preferencia y `navigator.language` empieza por `en`, `location.replace('/en/v2')`. El selector discreto "EN / ES" guarda la preferencia al hacer clic. Todo en try/catch. `<html lang>` y `hreflang` alternos se escriben en el layout. El atajo y las salidas usan las rutas de su mismo idioma.

## 6. Responsive

Escenario escalado 1440×900 **solo en desktop ≥1024** (JS `fit()` del animatic, o `--s` en CSS). En <1024 un layout fluido, porque escalar 1440 a 390 px dejaría 9 px de texto:

| | Desktop ≥1024 | Tablet 768–1023 | Móvil <768 |
|---|---|---|---|
| Layout | escenario 1440×900 escalado | fluido, grid: texto arriba, estatua abajo-dcha | igual |
| Estatua (ancho) | 100% (86% en contenido) | 85% | 62% |
| Voz | 44 px | 36 px | 28 px |
| Opciones | fila | wrap | apiladas, alto ≥44 px |
| Cámara máx. | 115% | 110% | 106% |

Cámara en fluido: solo `scale(k_efectiva)` con `transform-origin` en la estatua (sin `translate` en px); `k_efectiva = 1+(k-1)*factor` (factor 1 / 0,67 / 0,4). Suelo: línea única CSS en fluido (sin división). El runtime decide el modo con `matchMedia('(min-width:1024px)')`; el texto de voz nunca se coloca sobre la estatua (zona propia del grid). Contenido (`blocks`) reduce la estatua y permite scroll interno.

## 7. Accesibilidad

HTML semántico (`main`, `h1` visualmente oculto con el nombre, `button` para opciones, `nav` en salidas). `#text` con `aria-live="polite"`; las líneas se insertan al aparecer. Foco visible; el foco pasa al primer botón cuando aparecen las opciones sin robarlo si ya hay otro foco. `prefers-reduced-motion`: `T` = 0 (cortes secos), sin respiración, cámara ni squash (ya en el animatic vía variables CSS; el runtime lee la media query). Atajo "Ir directo a proyectos →" es un `<a>` real. `<noscript>` (en `Sala.astro`, desde `ui.noscript`): quién es, lista de proyectos, enlace a proyectos, contacto. Contraste ≥4,5:1 en `--suave` sobre blanco y hueso (verificar). Objetivos táctiles ≥44 px.

## 8. Sonido

`sound.ts` (~25 líneas): la nota WebAudio del animatic (`note(hz)`), creada solo si la persona dijo "Sí" en la portada; fuera de la portada, nada suena. Por defecto "No"; se guarda en `sessionStorage('v2.sound')`. Un `AudioContext` perezoso (requiere gesto, el clic de la portada lo da). Pista futura: `export const TRACK: string | null = null` en `sound.ts`; si no es null se carga un `<audio loop>` tras el "Sí". Sin cambios de runtime para activarla.

## 9. Placeholders `[[TODO: ...]]`

`validate.ts` exporta `validate(script)`, llamado en el frontmatter de las páginas (corre en `npm run build`):
1. **Siempre falla** si el grafo está roto: `start`/`next`/`to` inexistentes, pasos inalcanzables, `by` sin todas las ramas necesarias.
2. Busca `/\[\[TODO/` en `JSON.stringify(script)`: **imprime un aviso** con el conteo y los ids de paso; con `V2_STRICT=1` (el comando/CI de publicación) **lanza error**.
3. Los `[[TODO: ...]]` se ven tal cual en pantalla, así que no pasan desapercibidos en revisión.

Comprobación extra de una línea para CI: `grep -r "\[\[TODO" dist`.

## 10. Decisiones

| Decisión | Elegido | Alternativa rechazada y por qué |
|---|---|---|
| Carpeta | `src/v2/` único + 2 carpetas de páginas | Repartir en `components/data/assets` como en la propuesta: mudar a otro repo cuesta más y se mezcla con v1 |
| Idioma | Páginas finas `/v2` + `/en/v2` y datos por idioma | i18n de Astro: toca la config global y no aporta con 4 páginas; un solo `[lang]` dinámico: rutas de proyectos con nombres distintos y `getStaticPaths` para nada |
| Detección | Cliente (localStorage + `navigator.language`) | Cabecera `Accept-Language`: requiere servidor; el sitio es estático |
| Runtime | `<script>` de Astro vanilla TS | React/Preact island: dependencia nueva para ~300 líneas que ya existen en el animatic |
| Elementos de UI | `<template>` renderizados por Astro (clases del módulo CSS) y el script solo clona y cambia `data-*` | Crear HTML con `innerHTML` en el script (como el animatic): clases hasheadas inaccesibles, texto fuera del guion |
| Ramas | `Next` serializable (`by` + mapa) | Funciones `next(state)`: no serializable, una IA no podría rellenarlo |
| Modos | Ramas de pasos escritos + `data-mode` CSS | Motor con reglas de efectos: más código y el contenido igual hay que escribirlo por modo |
| Tiempos | Port de timers del animatic | Web Animations/async-await: reescritura sin ganancia |
| Imágenes | `getImage` webp mismo tamaño + CSS `background` + `RENDER` | `<Image>`: no sirve para el recorte CSS; reencuadrar los PNG a mano ahora: trabajo que reemplazarán los recortes transparentes |
| Escenario | Escalado solo en ≥1024, fluido debajo | Escalar siempre: texto ilegible y objetivos táctiles <44 px en móvil |
| Resume | `sessionStorage` (estado completo) | Query param/hash: el estado (modo, q2) no cabe limpio; `localStorage` retomaría en visitas nuevas |
| Placeholders | Validación en el frontmatter + `V2_STRICT` | Script `prebuild` aparte o integración Astro: más piezas; solo grep: no valida el grafo |

## 11. Riesgos

- **Calidad de imágenes**: el recorte+multiply+máscara es un parche; al 115% se ve el borde. Mitigado por `RENDER='cutout'`, pero la fecha de los recortes es de Laura.
- **Contenido bilingüe**: duplica lo que hay que escribir; Q2 × modos multiplica ramas (cada modo con su 'cierre'); acotar: las respuestas de Q2 comparten el paso de contenido siguiente.
- **Camera en fluido**: `scale` con origen en la estatua puede recortar texto en móvil si la estatua está cerca del borde; requiere prueba real en tres anchos.
- **Resume** con ids que cambian entre despliegues: validar el id y caer en el inicio.
- **Redirección por idioma** puede sorprender al compartir enlaces; solo se aplica en la entrada `/v2` y sin preferencia guardada.
- **Fuentes de Google**: dependencia externa y FOUT; si molesta, autoalojar con `@fontsource` (no incluido ahora).
- Preexistentes ignorados: `/ico.png` inexistente en v1; falta `site` (afecta a `hreflang` absolutos y sitemap: se pasa a relativas hasta publicar).

## 12. Tamaño y PRs encadenados (≤400 líneas cada uno, sin binarios)

| # | Contenido | Líneas aprox. |
|---|---|---|
| 1 | Mover animatic a `design/v2/`, PNG a `src/v2/assets/poses/`, `V2Layout` + `tokens.css`, `types.ts`, `poses.ts`, datos de proyectos (es/en), `Proyectos`, 4 páginas finas (sala con stub), selector/detección de idioma | ~380 |
| 2 | `engine.ts` + `validate.ts` (con asserts) + guion `es.ts` completo (con TODOs) | ~380 |
| 3 | Guion `en.ts` + `Sala.astro` (escenario, templates, JSON, noscript) | ~330 |
| 4 | `sala.client.ts`: estado, secuencia cámara→líneas→opciones, teclado, resume | ~300 |
| 5 | `Sala.module.css`: estatua, cámara, suelo, poses, respiración, giro, tema hueso, responsive | ~380 |
| 6 | `sound.ts`, reduced-motion pulido, `V2_STRICT`, revisión a11y y manual en 3 anchos | ~180 |

Total ~1.950 líneas. PR 1–2 son verificables con `npm run build`; la experiencia visible llega en el 4–5. Los PR 2–3 pueden intercambiarse.
