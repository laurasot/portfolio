# Spec: v2-aislamiento

Aislamiento de v1, build y placeholders. Delta: capacidad nueva.

## Requisitos

### R1. v1 intacto
v1 en `/` NO DEBE cambiar en comportamiento ni apariencia, y sus archivos no se modifican.

**Escenario: v1**
- Dado el build con v2
- Cuando se abre `/`
- Entonces es idéntica a antes del cambio.

### R2. v2 autocontenida
Ningún archivo de v2 (`src/pages/v2`, `src/layouts/V2Layout.astro`, `src/components/V2`, `src/data/v2`, `src/assets/v2`) DEBE importar nada de v1 (componentes, `BaseLayout`, `global.css`, `tokens.css`, datos). v2 DEBE tener su propio layout, estilos, tokens y datos.

**Escenario: sin imports a v1**
- Dado el código de v2
- Cuando se buscan imports hacia archivos de v1
- Entonces no hay ninguno.

### R3. Build
`npm run build` DEBE pasar. v2 DEBE ser estática (sin servidor, endpoint ni función).

### R4. Placeholders detectables
Todo contenido provisional DEBE llevar un marcador único y buscable (por ejemplo `[[PLACEHOLDER]]`) en los datos. Un build de publicación NO DEBE contener ese marcador; debe existir una comprobación que lo detecte.

**Escenario: placeholder pendiente**
- Dado texto provisional en el guion
- Cuando se ejecuta la comprobación de publicación
- Entonces falla y señala dónde está.

**Escenario: contenido final**
- Dado que Laura reemplazó todo el contenido
- Cuando se ejecuta la comprobación
- Entonces pasa.

### R5. Assets y diseño
Los archivos de diseño (animatic, referencias) viven en `design/v2/` y NO DEBEN publicarse. Solo las imágenes optimizadas en `src/assets/v2/` forman parte del build.
