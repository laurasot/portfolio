# Delta: v2-preguntas

Base: `openspec/changes/portfolio-v2/specs/v2-preguntas/spec.md`. W2 (Elegancia salta Q2, "quitar" no visible) queda fuera: decisión aceptada.

## MODIFIED Requirements

### R2. Modo Elegancia (modificado)
Elegancia NO DEBE tener hub. Tras "quitar" (sospecha, atajo y fondo hueso, como en la base) DEBE mostrar directamente sus 3 proyectos de una línea, a ritmo del visitante (ver `v2-experiencia` R8), y cerrar con "Quité todo lo que sobraba. La cinta no, esa se queda." antes del final compartido. Sigue sin Q2.

**Escenario: Elegancia sin menú**
- Dado que el visitante eligió Elegancia
- Cuando termina "quitar"
- Entonces ve sus 3 proyectos, la línea de cierre y el final, sin pasar por ningún hub.

### R3. Pregunta 2 (modificado)
Tras la respuesta a Q2 y su Sospecha #2, los modos Ideas, Resultados y Honestidad DEBEN continuar en su hub (R7) y no en una cadena lineal. El resto de R3 no cambia.

### R4. Variante "Ideas otra vez" (modificado)
Sin cambio de comportamiento; la variante DEBE seguir llevando al hub de Ideas.

## ADDED Requirements

### R7. Hub por modo
Ideas, Resultados y Honestidad DEBEN tener un paso hub con el título "¿Qué quieres ver?" (en: "What do you want to see?"), una opción por rama y una opción final "Ya vi suficiente". El hub NO DEBE avanzar por clic suelto ni por tiempo.

| Modo | Opciones del hub |
|---|---|
| Ideas | El experimento que casi no funcionó (exp-1); Mis favoritos (fav); Lo que salió raro (raras, luego duda) |
| Resultados | Resultado 1; Resultado 2; El sistema en producción (Traductor de lengua de señas, < 5 s) |
| Honestidad | Lo que hizo ella; Lo que está aprendiendo; Una opinión suya |

**Escenario: abrir una rama**
- Dado el hub de Resultados
- Cuando el visitante elige "Resultado 2"
- Entonces ve el contenido de esa rama, y puede elegir las demás en cualquier orden.

**Escenario: rama de dos pasos**
- Dado el hub de Ideas
- Cuando elige "Lo que salió raro"
- Entonces ve `raras` y después `duda`, siempre en ese orden, antes de poder volver.

### R8. Opciones vistas
El hub DEBE marcar como vista toda opción cuya rama el visitante ya completó: atenuada y con marca de visto (texto accesible incluido, no solo color). Las opciones vistas DEBEN seguir activables para reabrirlas.

**Escenario: marca de visto**
- Dado un visitante que terminó "Mis favoritos" y pulsó "Seguir"
- Cuando vuelve al hub
- Entonces "Mis favoritos" aparece atenuada con la marca de visto, y al elegirla se reabre.

### R9. Volver al menú y "Seguir"
Desde cualquier paso de una rama DEBE existir "volver al menú" (en: "back to menu") que lleve al hub. El último paso de cada rama DEBE ofrecer "Seguir" (en: "Continue"), que vuelve al hub y marca la opción como vista. "volver al menú" NO DEBE marcar la opción como vista.

**Escenario: volver sin terminar**
- Dado un visitante en el primer paso de la rama `raras`
- Cuando pulsa "volver al menú"
- Entonces regresa al hub y "Lo que salió raro" no queda marcada como vista.

### R10. Salida del hub
"Ya vi suficiente" DEBE llevar a `ya-se`. Cuando todas las opciones del hub están vistas, al volver DEBE pasar directo a `ya-se` sin mostrar de nuevo el hub. Desde `ya-se` el recorrido DEBE seguir `quien` → `giro` → `fin`.

**Escenario: ya vi suficiente**
- Dado el hub con una sola opción vista
- Cuando el visitante elige "Ya vi suficiente"
- Entonces pasa a `ya-se`.

**Escenario: todo visto**
- Dado el hub con dos de tres opciones vistas
- Cuando el visitante completa la tercera y pulsa "Seguir"
- Entonces pasa a `ya-se` sin volver a mostrar el hub.

### R11. Conjunto de vistos
Un conjunto `seen` DEBE ser la única fuente de verdad de qué ramas se vieron y DEBE guardarse en el estado de retomado (`v2.state` en `sessionStorage`) junto a modo, respuestas y sospecha. Un estado guardado sin `seen` DEBE tratarse como vacío. Un `seen` con claves desconocidas DEBE ignorarse. El determinismo (R6) se mantiene: misma secuencia de acciones, misma secuencia de pasos.

**Escenario: retomar con vistos**
- Dado un visitante con "Resultado 1" visto que usa el atajo y vuelve a la sala
- Cuando retoma
- Entonces está en el mismo paso y "Resultado 1" sigue marcado como visto.

**Escenario: sesión antigua**
- Dado un estado guardado sin `seen`
- Cuando se retoma
- Entonces `seen` está vacío y no hay error.
