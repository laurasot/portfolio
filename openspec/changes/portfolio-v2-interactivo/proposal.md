# Propuesta: portfolio-v2-interactivo

Rama: `feat/v2-interactivo` (desde develop). Cambio previo: `openspec/changes/portfolio-v2/` (specs, diseño, tareas y `verify-report.md`).

## Intención

### Problema
La v2 (`src/v2/**`, rutas `/v2` y `/en/v2`) es una "sala" guionada con una estatua de piedra. El feedback de Laura: hoy "parece un video". Solo Q1 y Q2 piden una acción; todos los demás pasos avanzan solos con temporizadores `hold` (`sala.client.ts:209`, `later(() => go(next), at + t(step.hold ?? 0))`). El visitante mira, no participa.

### Por qué ahora
- La v1 ya tiene contenido real de 5 sistemas técnicos (`src/data/v1.ts`), así que se pueden rellenar los `[[TODO]]` de proyectos y resultados que hoy bloquean `V2_STRICT=1`.
- La verificación anterior dejó avisos (W1, W4, W5, W7) que encajan en este cambio.

### Éxito
- Ningún paso avanza solo. El visitante decide cuándo seguir (clic, toque, Enter, ArrowRight).
- Tras Q2 y `cierre`, cada modo (salvo Elegancia) llega a un hub "¿Qué quieres ver?". El visitante recorre las ramas que quiera, en el orden que quiera, y sale con "Ya vi suficiente".
- Los `[[TODO]]` de proyectos y resultados salen de la v1; los personales siguen marcados para Laura.
- W1, W4, W5 y W7 quedan cerrados. `npm run build` verde, sin tocar la v1.

## Alcance

### Dentro
1. **El visitante avanza**
   - Se elimina el auto-avance. Cada paso sin pregunta espera clic, toque, Enter o ArrowRight, con una pista discreta de "continuar".
   - Dentro de un paso, las líneas siguen apareciendo en secuencia automática (son un solo golpe).
   - `hold` deja de ser temporizador de avance. Resuelve W1: los `hold` ya no se saltan al retomar, porque no hay avance que saltar.
2. **Ramas explorables**
   - Pasos hub nuevos por modo: opciones + "Ya vi suficiente". Elegir una abre su contenido (pasos de bloque existentes, reutilizados). "Seguir" vuelve al hub con la opción marcada como vista.
   - "Ya vi suficiente", o haber visto todo, lleva al final compartido: `ya-se` → `quien` → `giro` → `fin`.
   - El conjunto de vistos se guarda en el `sessionStorage` de retomado ya existente (`v2.state`).
   - Ideas: exp-1 (el experimento que casi no funcionó), fav (mis favoritos), raras + duda (lo que salió raro).
   - Resultados: Resultado 1, Resultado 2, El sistema en producción (Traductor de lengua de señas, < 5 s).
   - Honestidad: lo que hizo ella, lo que está aprendiendo, una opinión suya.
   - Elegancia: sin menú. Muestra directo sus 3 proyectos ("menos").
3. **Contenido desde la v1**
   - Se COPIA a `src/v2/data` (resumen, métrica, restricción, stack, enlaces). Nunca se importa de la v1 (spec v2-aislamiento).
   - Rellena: favoritos, resultados y los 3 proyectos de Elegancia.
   - Se queda como `[[TODO]]` para Laura: experimento, cosas raras, lo que aprende, opinión.
4. **Avisos de la verificación anterior**
   - W4: objetivos táctiles < 44 px. Enlace de idioma (~40 px), botones cortos "Sí"/"No", atajo de escritorio con `min-height: 0`.
   - W5: el atajo de salida queda oculto bajo la portada de sonido en la primera visita.
   - W7: la validación de paridad solo compara ids. Debe comparar también estructura: pose, cámara, destinos de `next` y `options`.

### Fuera
- W2: Elegancia salta Q2 y su "quitar" no es secuencia visible. Decisión aceptada.
- W3: persistencia parcial de la cinta (poses con cinta horneada). Decisión aceptada.
- W6 y las sugerencias S1-S6 (documentar reset/keep del idioma, parallax, hreflang, etc.). No se tocan salvo que caigan de paso.
- Escribir el contenido personal de Laura.
- Nuevas poses, assets, audio o dependencias.
- Cambios en la página `/proyectos` (sin JS) o en cualquier archivo de la v1.

## Capacidades / specs afectadas

| Spec existente | Cambio |
|---|---|
| v2-experiencia | R2 (tiempos): `hold` ya no avanza. R1/R3: pasos a ritmo del visitante, pista "continuar". R5: el atajo visible desde el primer instante (W5). R6: el final se alcanza desde el hub. Delta grande. |
| v2-preguntas | R3/R4: tras Q2 aparece el hub. Se añaden requisitos para el hub y el conjunto de vistos. Elegancia sin hub (sigue sin Q2, W2 fuera de alcance). |
| v2-proyectos | R2: líneas de proyecto rellenas desde datos de la v1. R4: retomado conserva el conjunto de vistos. |
| v2-responsive-a11y | R3 (44 px, W4). R4 (teclado: Enter/ArrowRight avanza, foco en el hub). R5 (aria-live para pista y hub). |
| v2-i18n | R2: validación de paridad estructural (W7). Paridad es/en también para el hub y los datos copiados. |
| v2-aislamiento | Sin cambio de requisito. Se aplica: datos copiados, sin import de v1. |
| v2-estatua | Sin cambio. |

## Enfoque

- **Motor** (`engine.ts`, `sala.client.ts`): reemplazar el `later(() => go(next), ...)` por un estado "listo para continuar". Al terminar las líneas y bloques se muestra la pista y se arma el avance por clic/toque/Enter/ArrowRight. `advance` ya existe y se reutiliza. El handler de teclado ya soporta ArrowRight/Enter. Se añade el clic/toque sobre el escenario, sin robar clics de botones, enlaces ni atajo.
- **Modelo de datos** (`types.ts`): un paso `hub` con opciones y marca de visto. Opción: destino + clave de "visto". Estado: `seen: string[]` junto a `mode`/`q2`/`sos` en `State`. La rama termina con un paso "Seguir" que vuelve al hub. "Ya vi suficiente" y "todo visto" resuelven a `ya-se`.
- **Reutilización**: los pasos de bloque existentes (exp-1, fav, raras, duda, num-1, real-1...) se conectan al hub en lugar de a la cadena lineal. Solo se añaden pasos de hub y "volver".
- **Validación** (`validate.ts`): el grafo ya no es un árbol. Seguir comprobando alcanzabilidad, y sumar paridad estructural (W7) que cubra pose, cámara, tilt, flip, light, ui, top, dim, `next` y `options.to`.
- **Datos**: copiar proyectos de la v1 a `src/v2/data` (es/en) como datos propios. Sin enlace de código con la v1.
- **CSS/UI**: tokens para 44 px mínimo, pista "continuar", estado visto de la opción. El atajo pasa por encima de la portada de sonido (z-index o portada que no lo cubre).

## Riesgos

- **Grafo con ciclos** (hub ↔ rama): `validate.ts` y `selfCheck` asumen un grafo que avanza. Riesgo de bucles o resume en un estado incoherente. Mitigación: el estado `seen` es la única fuente y `resolve` lo valida.
- **Clic en cualquier parte avanza**: puede chocar con enlaces, atajo, selector de idioma y opciones. Mitigación: ignorar clics en elementos interactivos; las preguntas y el hub nunca avanzan por clic suelto.
- **Accesibilidad**: avance por clic global sin equivalente de teclado sería una regresión. Mitigación: Enter/ArrowRight y botón visible "continuar" focalizable.
- **Ritmo sin `hold`**: sin tiempo mínimo, un visitante puede saltarse líneas antes de leerlas. Ver pregunta abierta 1.
- **Contenido v1 en voz de la v2**: el texto de la v1 es técnico; el tono de la v2 es en tercera persona y más narrativo. Se requiere reescritura breve, no copia literal. Laura debe revisar.
- **Paridad en/es**: el contenido v1 está en español. La versión en inglés requiere traducción. Mientras no exista, el `en` queda con `[[TODO]]` o con una traducción provisional.
- **Tamaño de PR**: el motor y los datos juntos pueden superar ~400 líneas. Se corta en cadena.
- **Retomado**: una sesión guardada por la versión actual no tiene `seen`; debe tratarse como vacío.

## Reversión

- Cada slice es un PR independiente sobre `feat/v2-interactivo`. Revertir un PR restaura el comportamiento anterior de esa capa.
- Todo vive en `src/v2/**` y `openspec/`; no hay migración de datos. `sessionStorage` es por pestaña y las claves nuevas se ignoran si se vuelve atrás (`load()` ya tolera estado desconocido).
- Reversión total: revertir la rama; `/v2` vuelve a la sala guionada actual.

## Decisiones (antes preguntas abiertas)

1. **`hold` se conserva como pausa mínima** (decisión de Laura): tras la última línea del paso, la pista "continuar" aparece después de `hold`; no avanza sola. Con movimiento reducido la pausa sigue aplicando, pero el visitante puede avanzar antes con teclado o clic.
2. **Pista "continuar"**, un solo texto en todos los dispositivos (es: "continuar", en: "continue"); el gesto lo explica el propio botón focalizable.
3. **Opciones vistas se marcan** (decisión de Laura): siguen en el hub, atenuadas con marca de visto, y se pueden reabrir.
4. **Sí hay "volver al menú"** desde cualquier paso de una rama, además de "Seguir" al final.
5. **Con todo visto, directo al final** (decisión de Laura): pasa a `ya-se` sin volver a mostrar el hub.
6. **Inglés del contenido copiado de la v1: lo traduce Claude** (decisión de Laura) con el mismo tono; Laura lo revisa después.
7. **"duda" sigue siempre a "raras"** dentro de la opción "Lo que salió raro" (dos pasos).

## Plan de slices (PRs encadenados, ~400 líneas cada uno)

1. **Avance del visitante**: motor sin auto-avance, pista "continuar", clic/toque/teclado, `hold` fuera. Specs v2-experiencia. Cierra W1.
2. **Hub y ramas (estructura)**: tipos, `seen` en el estado, pasos hub y "volver" para Ideas/Resultados/Honestidad, Elegancia directo; validación de grafo con ciclos.
3. **Contenido desde la v1**: datos copiados a `src/v2/data` (es/en), rellena favoritos, resultados y los 3 proyectos de Elegancia. Personal queda `[[TODO]]`.
4. **Avisos**: W4 (44 px), W5 (atajo bajo la portada), W7 (paridad estructural en `validate.ts`).
5. **Specs y cierre**: deltas de specs, README, verificación.

Orden: 1 → 2 → 3, y 4 puede ir en paralelo con 3. Con riesgo de tamaño, `ask-on-risk` pregunta antes de apply.
