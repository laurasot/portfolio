# Delta: v2-proyectos

Base: `openspec/changes/portfolio-v2/specs/v2-proyectos/spec.md`.

## MODIFIED Requirements

### R2. Seis proyectos (modificado)
Los `[[TODO]]` de las líneas de proyecto y de resultados DEBEN sustituirse por contenido tomado de la v1 (resumen, métrica, restricción, stack, enlaces), reescrito en la voz de la v2 (tercera persona, tono de `v2-experiencia` R4). El contenido DEBE copiarse a los datos de v2 en es y en; NO DEBE importarse de ningún archivo de la v1. Cada uno de los 6 proyectos DEBE tener línea, stack y enlaces.

Siguen marcados `[[TODO]]` para Laura, y NO DEBEN rellenarse: el experimento, las cosas raras, lo que está aprendiendo y su opinión.

**Escenario: listado sin TODO de proyecto**
- Dado un visitante en la página de proyectos, en es o en en
- Entonces ve los 6 proyectos con línea, stack y enlaces, sin `[[TODO]]` en ellos.

**Escenario: contenido de la v1 en la sala**
- Dado los modos Resultados, Elegancia y la rama "Mis favoritos"
- Cuando se muestran sus bloques
- Entonces su contenido proviene de los datos copiados de v2 (favoritos, resultados y los 3 proyectos de Elegancia), no de la v1.

**Escenario: contenido personal pendiente**
- Dado el experimento, cosas raras, lo que aprende y la opinión
- Entonces siguen como `[[TODO]]` y `V2_STRICT=1` los reporta.

### R4. Volver a la sala (modificado)
El retomado DEBE conservar, además del mismo nodo y las respuestas dadas, el conjunto de vistos (`seen`, ver `v2-preguntas` R11). El nodo retomado DEBE conservar su `hold` (ver `v2-experiencia` R2).

**Escenario: retomar en el hub**
- Dado un visitante en el hub de Ideas con una opción vista que usó el atajo
- Cuando pulsa "← Volver a la sala"
- Entonces vuelve al hub con esa opción marcada como vista.

## ADDED Requirements

### R6. Aislamiento del contenido copiado
Los datos copiados de la v1 DEBEN vivir en los datos propios de v2 y la traducción al inglés DEBE tener la misma estructura que el español (traducción provisional permitida, revisable por Laura).

**Escenario: sin import de v1**
- Dado el código bajo `src/v2/**`
- Entonces ningún import apunta a `src/data/v1.ts` ni a otros archivos de la v1.
