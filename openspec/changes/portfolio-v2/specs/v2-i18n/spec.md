# Spec: v2-i18n

Bilingüe es/en. Delta: capacidad nueva. Las rutas exactas y el mecanismo de elección los decide el diseño.

## Requisitos

### R1. Dos idiomas completos
`/v2` y la página de proyectos DEBEN existir en español e inglés, con la experiencia completa en ambos. El humor se adapta; NO DEBE ser traducción literal.

### R2. Copy en datos por idioma
Todo texto visible (líneas, preguntas, opciones, sospechas, etiquetas de UI, proyectos, aria-labels, `noscript`) DEBE vivir en el guion por idioma (`src/data/v2/es`, `src/data/v2/en`). Los componentes NO DEBEN contener texto escrito a mano. Ambos idiomas DEBEN tener la misma estructura de nodos.

**Escenario: paridad**
- Dado un nodo del guion en español
- Entonces existe el mismo nodo en inglés, con las mismas poses y efectos.

### R3. Elección de idioma
El visitante DEBE poder cambiar de idioma con un selector discreto; la elección inicial PUEDE basarse en el idioma del navegador. Cambiar de idioma NO DEBE perder el progreso de forma inesperada: DEBE quedar documentado en el diseño si reinicia o conserva el nodo.

**Escenario: selector**
- Dado un visitante en `/v2` en español
- Cuando elige English
- Entonces ve la versión en inglés de la experiencia.

### R4. Atributos del documento
Cada página DEBE declarar su idioma (`lang`) correctamente.
