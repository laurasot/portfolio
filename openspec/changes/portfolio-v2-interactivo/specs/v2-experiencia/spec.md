# Delta: v2-experiencia

Base: `openspec/changes/portfolio-v2/specs/v2-experiencia/spec.md`. Cierra W1 y W5 de la verificación anterior.

## MODIFIED Requirements

### R2. Tiempos (modificado)
- La espera "…" DEBE durar ~2 s.
- Las líneas consecutivas DENTRO de un mismo paso DEBEN separarse 1,2 s y seguir apareciendo en secuencia automática.
- Los fades DEBEN durar 600 ms.
- `hold` DEBE ser la pausa mínima entre la última línea de un paso y la aparición de la pista "continuar". `hold` NO DEBE hacer avanzar el paso.
- `hold` NO DEBE omitirse al cargar ni al retomar; solo la cámara y la pose pueden aplicarse de forma instantánea (cierra W1).

**Escenario: dos líneas seguidas**
- Dado que aparece una línea
- Cuando le sigue otra en el mismo paso
- Entonces la segunda aparece 1,2 s después con un fade de 600 ms.

**Escenario: pausa mínima**
- Dado un paso con `hold` de 2000 ms cuya última línea ya se mostró
- Cuando pasan menos de 2000 ms
- Entonces la pista "continuar" aún no es visible y un clic, toque, Enter o ArrowRight no avanza.

**Escenario: retomar conserva hold**
- Dado un visitante que retoma la sala en un paso sin pregunta
- Cuando el paso se muestra
- Entonces cámara y pose están ya en su sitio, pero la pista "continuar" espera el `hold` del paso.

### R5. Atajo siempre visible (modificado)
El atajo "Ir directo a proyectos →" DEBE ser visible y activable desde ~1 s tras cargar, también en la primera visita con la portada de sonido abierta (cierra W5), y mantenerse durante toda la experiencia (excepto cuando el modo Elegancia lo quita, ver `v2-preguntas`). NO DEBE existir enlace "versión clásica" a v1.

**Escenario: atajo con portada de sonido**
- Dado una primera visita sin preferencia de sonido y la portada "¿Con sonido?" visible
- Cuando pasa ~1 s
- Entonces el atajo es visible, queda por encima de la portada y es activable.

### R6. Final y salidas (modificado)
La escena 4 DEBE mostrar "Eso es lo que sé de ella. / El resto está en su GitHub." y tres salidas: Proyectos, Contacto, GitHub. El final DEBE alcanzarse desde el paso `ya-se` (por "Ya vi suficiente" o por haber visto todas las opciones del hub; ver `v2-preguntas`) siguiendo `ya-se` → `quien` → `giro` → `fin`. En Elegancia, el final se alcanza tras sus 3 proyectos sin hub.

**Escenario: recorrido completo (ajuste de R1)**
- Dado un visitante que abre `/v2`
- Cuando avanza por sus propias acciones y sale del hub
- Entonces ve las escenas 1, 2, 3 y 4 en ese orden y llega al final.

## ADDED Requirements

### R8. El visitante avanza
Ningún paso sin pregunta ni hub DEBE avanzar solo. Tras mostrar todas sus líneas y bloques, y pasado `hold`, el paso DEBE mostrar una pista "continuar" (es: "continuar", en: "continue", mismo texto en todos los dispositivos). El avance DEBE ocurrir con clic o toque sobre el escenario, Enter, ArrowRight o activando la pista.

**Escenario: avance por cualquier vía**
- Dado un paso con la pista "continuar" visible
- Cuando el visitante hace clic, toca el escenario, pulsa Enter o ArrowRight, o activa el botón
- Entonces pasa al siguiente paso, con el mismo resultado en los cuatro casos.

**Escenario: nunca avanza solo**
- Dado un paso con la pista visible
- Cuando pasa un tiempo arbitrario sin acción
- Entonces el paso sigue en pantalla.

**Escenario: clic en elemento interactivo**
- Dado un clic sobre un enlace, el atajo, el selector de idioma o una opción
- Entonces solo se activa ese elemento y el escenario no avanza.

**Escenario: preguntas y hub**
- Dado una pregunta o el hub visibles
- Cuando el visitante hace clic o toca fuera de una opción
- Entonces no avanza; solo elegir una opción continúa.

### R9. Pista "continuar" accesible
La pista DEBE ser un botón focalizable con foco visible, alcanzable con Tab, que avance al activarse con Enter o Espacio. Su aparición DEBE anunciarse (ver `v2-responsive-a11y`). Con movimiento reducido la pausa `hold` DEBE seguir aplicando, pero el visitante PUEDE avanzar antes con teclado o clic una vez visible la pista.

**Escenario: solo teclado**
- Dado un visitante sin ratón y la pista visible
- Cuando pulsa Tab y Enter
- Entonces avanza al siguiente paso.
