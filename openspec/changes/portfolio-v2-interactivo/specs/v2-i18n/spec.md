# Delta: v2-i18n

Base: `openspec/changes/portfolio-v2/specs/v2-i18n/spec.md`. Cierra W7. W6 queda fuera.

## MODIFIED Requirements

### R2. Copy en datos por idioma (modificado)
Todo texto visible, incluidos hub, opciones, "volver al menú", "Seguir", "Ya vi suficiente", marca de visto, pista "continuar" y los datos copiados de la v1, DEBE vivir en los datos por idioma. Ambos idiomas DEBEN tener la misma estructura de nodos, y la validación de build DEBE comprobarla más allá de los ids (cierra W7): para cada paso, `pose`, cámara, `tilt`, `flip`, `light`, `ui`, `top`, `dim`, `hold`, `next` y los destinos `options.to` (y las claves de "visto" de las opciones) DEBEN ser idénticos entre es y en. Solo el texto puede diferir. Cualquier diferencia DEBE fallar el build con el id del paso y el campo.

**Escenario: paridad estructural**
- Dado un paso en es y el mismo id en en
- Entonces tienen las mismas poses, cámara, efectos, `next` y destinos de opciones.

**Escenario: divergencia detectada**
- Dado un paso en en cuyo `next` o `options.to` difiere del de es, o con distinta pose
- Cuando corre `npm run build`
- Entonces el build falla indicando id y campo distintos.

**Escenario: hub con el mismo número de opciones**
- Dado el hub de un modo
- Entonces es y en tienen las mismas opciones, en el mismo orden y con las mismas claves de visto.

**Escenario: datos copiados en ambos idiomas**
- Dado los proyectos y resultados copiados de la v1
- Entonces existen en es y en con la misma estructura (inglés traducido con el mismo tono, revisable por Laura).
