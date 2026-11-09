# Spec: v2-preguntas

Preguntas, modos y sospechas. Delta: capacidad nueva. Determinista, sin IA.

## Requisitos

### R1. Pregunta 1 con cuatro modos
La escena 2 DEBE preguntar "¿Qué te importa más cuando conoces a alguien?" con cuatro opciones. La respuesta DEBE cambiar el comportamiento del sitio, no las secciones.

| Opción | Comportamiento | Línea de respuesta (ejemplo) |
|---|---|---|
| Ideas | Proceso primero | "Bien. Me salto la parte donde intento impresionarte." |
| Resultados | Números y proyectos rápido | "Perfecto. Te muestro números y no te quito más tiempo." |
| Honestidad | Modo "sin adornos": parte real de Laura en proyectos de equipo, lo que aprende ahora, una opinión técnica | "Ok. Te cuento las cosas como son, sin adornos." |
| Elegancia | Ver R2 | "Entonces menos." |

**Escenario: elegir Resultados**
- Dado la Pregunta 1 visible
- Cuando el visitante elige Resultados
- Entonces se muestra la línea de respuesta y el recorrido presenta números y proyectos antes que proceso.

**Escenario: elegir Honestidad**
- Dado la Pregunta 1 visible
- Cuando el visitante elige Honestidad
- Entonces el recorrido incluye la parte real de Laura en proyectos de equipo, lo que aprende ahora y una opinión técnica.

### R2. Modo Elegancia ("quitar")
Al elegir Elegancia, la UI DEBE quitar uno a uno la sospecha y el atajo, cambiar el fondo a modo hueso y mostrar 3 proyectos de una línea cada uno. DEBE cerrar con "Quité todo lo que sobraba. La cinta no, esa se queda."

**Escenario: secuencia quitar**
- Dado que el visitante eligió Elegancia
- Cuando corre la secuencia
- Entonces primero desaparece la sospecha, luego el atajo, el fondo pasa a hueso, se ven 3 proyectos de una línea y se muestra la línea de cierre con la cinta aún visible en la estatua.

### R3. Pregunta 2
La escena 2 DEBE preguntar "¿Qué admiras más?" con cuatro respuestas, cada una con su línea y la Sospecha #2:

| Respuesta | Línea (ejemplo) | Sospecha #2 (ejemplo) |
|---|---|---|
| Ideas | "Ideas. Perfecto. / Tengo de sobra." | Te aburren las respuestas obvias. |
| Éxito | "Éxito. Me gusta. / A Laura también." | Te gustan las cosas que se terminan. |
| Dinero | "Respuesta honesta. / Casi nadie elige esa. Bueno, casi nadie lo admite." | No te convence mucho el marketing. |
| Reconocimiento | "Reconocimiento. / No te preocupes, no se lo voy a contar a nadie." | Lees los créditos al final de las películas. |

**Escenario: elegir Dinero**
- Dado la Pregunta 2 visible
- Cuando el visitante elige Dinero
- Entonces se muestra su línea y después la Sospecha #2 correspondiente.

### R4. Variante "Ideas otra vez"
Si el visitante eligió Ideas en la Pregunta 1 y de nuevo Ideas en la Pregunta 2, el guion DEBE usar una variante de la línea que reconozca la repetición, sin repetir texto idéntico.

**Escenario: Ideas dos veces**
- Dado Ideas en la Pregunta 1
- Cuando elige Ideas en la Pregunta 2
- Entonces la línea es la variante "Ideas otra vez" y no la estándar.

### R5. Sospechas
Toda sospecha DEBE terminar con "Puedo estar equivocada." NO DEBE mostrar porcentajes de confianza.

**Escenario: sospecha**
- Dado que aparece una sospecha
- Cuando se muestra completa
- Entonces su última frase es "Puedo estar equivocada." y no contiene porcentajes.

### R6. Determinismo
Para la misma secuencia de respuestas, la experiencia DEBE producir exactamente la misma secuencia de líneas, poses y efectos. NO DEBE haber IA, aleatoriedad ni llamadas de red.
