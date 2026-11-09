# Spec: v2-responsive-a11y

Responsive, accesibilidad y sonido. Delta: capacidad nueva.

## Requisitos

### R1. Breakpoints
Desktop ≥1024 px, tablet 768–1023 px, móvil <768 px.

### R2. Tamaños
| | Desktop | Tablet | Móvil |
|---|---|---|---|
| Estatua (abajo a la derecha) | 100 % | 85 % | 62 % |
| Texto de voz (arriba a la izquierda) | 44 px | 36 px | 28 px |
| Opciones | en fila | wrap | apiladas |

La estatua DEBE ser más pequeña en cuadros de contenido. El texto NO DEBE superponerse a la estatua en ningún ancho.

**Escenario: móvil**
- Dado un viewport de 375 px
- Cuando se muestra una pregunta
- Entonces las opciones están apiladas, el texto es de 28 px y no toca la estatua.

### R3. Objetivos táctiles
Todo control interactivo DEBE medir al menos 44×44 px.

### R4. Teclado
Toda la experiencia (opciones, atajo, selector de idioma, salidas, volver) DEBE operarse con teclado, con foco visible y orden lógico.

**Escenario: solo teclado**
- Dado un visitante sin ratón
- Cuando usa Tab y Enter/Espacio
- Entonces puede responder ambas preguntas y llegar a las salidas.

### R5. Lectores de pantalla
HTML semántico. Las líneas del guion DEBEN anunciarse mediante `aria-live`.

### R6. prefers-reduced-motion
Con `prefers-reduced-motion: reduce`, los cambios DEBEN ser cortes secos: sin respiración, sin movimiento de cámara ni giro animado. El contenido y el orden NO DEBEN cambiar.

**Escenario: movimiento reducido**
- Dado `prefers-reduced-motion: reduce`
- Cuando cambia de pose o encuadre
- Entonces el cambio es instantáneo y no hay respiración.

### R7. noscript
Sin JavaScript, la página DEBE mostrar lo esencial: quién es Laura, proyectos y contacto.

### R8. Sonido
La portada de sonido "¿Con sonido? Sí · No" PUEDE existir. El sonido DEBE ser opt-in y estar desactivado por defecto. La experiencia DEBE estar completa sin sonido. En la fase 1 no hay pista; elegir "Sí" NO DEBE producir errores.

**Escenario: sin sonido**
- Dado un visitante que elige No (o ignora la portada)
- Entonces recorre toda la experiencia sin pérdida de contenido.
