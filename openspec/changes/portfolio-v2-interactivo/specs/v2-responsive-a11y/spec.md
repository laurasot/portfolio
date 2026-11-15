# Delta: v2-responsive-a11y

Base: `openspec/changes/portfolio-v2/specs/v2-responsive-a11y/spec.md`. Cierra W4.

## MODIFIED Requirements

### R3. Objetivos táctiles (modificado)
Todo control interactivo DEBE medir al menos 44×44 px en alto y ancho, incluidos el enlace de idioma, los botones cortos ("Sí", "No"), el atajo de escritorio, la pista "continuar" y las opciones del hub (cierra W4). El atajo de escritorio NO DEBE usar `min-height: 0`.

**Escenario: controles cortos**
- Dado los botones "Sí" y "No" de la portada de sonido
- Entonces cada uno mide al menos 44×44 px.

**Escenario: enlace de idioma y atajo**
- Dado el enlace de idioma y el atajo en desktop y en móvil
- Entonces cada área activable mide al menos 44×44 px.

### R4. Teclado (modificado)
Toda la experiencia (opciones, hub, "volver al menú", "Seguir", pista "continuar", atajo, selector de idioma, salidas, volver) DEBE operarse con teclado, con foco visible y orden lógico. Enter y ArrowRight DEBEN avanzar un paso sin pregunta cuando la pista es visible. Al aparecer un hub, el foco DEBE moverse a su primera opción (o a la primera no vista).

**Escenario: solo teclado en el hub**
- Dado un visitante sin ratón que llega al hub
- Cuando usa Tab y Enter/Espacio
- Entonces recorre ramas, vuelve al menú, elige "Ya vi suficiente" y llega a las salidas.

**Escenario: foco al llegar al hub**
- Dado el paso previo al hub
- Cuando el hub aparece
- Entonces el foco está en una opción del hub.

### R5. Lectores de pantalla (modificado)
Las líneas del guion DEBEN anunciarse mediante `aria-live`. La pista "continuar", el hub y el estado "visto" de cada opción también DEBEN ser anunciables (texto accesible; no solo atenuación visual).

**Escenario: opción vista anunciada**
- Dado una opción marcada como vista
- Entonces su nombre accesible indica que ya fue vista.

### R6. prefers-reduced-motion (aclaración)
Con movimiento reducido, `hold` SIGUE aplicando como pausa mínima antes de la pista; solo los movimientos de cámara, pose y respiración son cortes secos.
