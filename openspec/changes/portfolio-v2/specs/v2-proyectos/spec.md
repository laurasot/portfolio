# Spec: v2-proyectos

Página de proyectos del atajo. Delta: capacidad nueva.

## Requisitos

### R1. Página simple
La página de proyectos DEBE ser HTML plano, sin estatua ni animación de la experiencia, accesible en cualquier momento desde el atajo y desde las salidas finales.

### R2. Seis proyectos
DEBE listar los 6 proyectos de v1: Incident Multiagent, Traductor de lengua de señas, Asistente de ventas en tiempo real, SpeakFlow, Music Under the Hood, Interpretaciones de cueca. Cada uno DEBE tener una línea de descripción, su stack y sus enlaces.

**Escenario: listado**
- Dado un visitante en la página de proyectos
- Entonces ve los 6 proyectos, cada uno con una línea, stack y enlaces.

### R3. Contacto
La página DEBE incluir los datos de contacto de Laura.

### R4. Volver a la sala
La página DEBE ofrecer "← Volver a la sala", que DEBE regresar a `/v2` retomando la experiencia donde se dejó (mismo nodo y respuestas dadas).

**Escenario: retomar**
- Dado un visitante que usó el atajo durante la Pregunta 2 con la Pregunta 1 ya respondida
- Cuando pulsa "← Volver a la sala"
- Entonces vuelve a la Pregunta 2 con la respuesta previa conservada.

**Escenario: sin progreso**
- Dado un visitante que llegó directo a la página de proyectos
- Cuando pulsa "← Volver a la sala"
- Entonces la experiencia empieza desde el principio.

### R5. Datos propios
Los datos de proyectos DEBEN vivir en `src/data/v2/` (duplicados de v1), con textos por idioma (ver `v2-i18n`).
