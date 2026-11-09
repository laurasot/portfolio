# Spec: v2-experiencia

Escenas, tiempos, comportamiento del texto y salidas. Delta: capacidad nueva en `/v2`.

## Requisitos

### R1. Cuatro escenas en orden
La experiencia DEBE recorrer cuatro escenas: (1) El encuentro, (2) La conversación, (3) Experimentos y cosas raras, (4) Final. Los errores son "cosas raras" ligeras dentro de la escena 3, sin escena propia.

**Escenario: recorrido completo**
- Dado un visitante que abre `/v2`
- Cuando avanza sin salir
- Entonces ve las escenas 1, 2, 3 y 4 en ese orden y llega al final.

### R2. Tiempos
- La espera "…" DEBE durar ~2 s.
- Las líneas consecutivas DEBEN separarse 1,2 s.
- Los fades DEBEN durar 600 ms.

**Escenario: dos líneas seguidas**
- Dado que aparece una línea
- Cuando le sigue otra en el mismo cuadro
- Entonces la segunda aparece 1,2 s después con un fade de 600 ms.

### R3. Una línea a la vez
El texto DEBE mostrarse una línea a la vez; al entrar la nueva, la anterior DEBE atenuarse al 35 % de opacidad. El texto NO DEBE aparecer antes de que la cámara termine su movimiento (ver `v2-estatua`).

**Escenario: línea nueva**
- Dado una línea visible
- Cuando aparece la siguiente
- Entonces la anterior queda al 35 % y la nueva a opacidad completa.

### R4. Texto solo sobre Laura
El texto NO DEBE definir un narrador; DEBE hablar de Laura en tercera persona. El tono es de humor seco con seguridad; NO DEBE ser pretencioso, solemne ni autocompasivo.

### R5. Atajo siempre visible
El atajo "Ir directo a proyectos →" DEBE estar visible desde ~1 s tras cargar y mantenerse durante toda la experiencia (excepto cuando el modo Elegancia lo quita, ver `v2-preguntas`). DEBE llevar a la página de proyectos (`v2-proyectos`). NO DEBE existir enlace "versión clásica" a v1.

**Escenario: atajo temprano**
- Dado `/v2` recién cargada
- Cuando pasa ~1 s
- Entonces el atajo es visible y activable.

### R6. Final y salidas
La escena 4 DEBE mostrar "Eso es lo que sé de ella. / El resto está en su GitHub." y tres salidas: Proyectos, Contacto, GitHub.

**Escenario: salidas finales**
- Dado que termina la escena 4
- Cuando se muestran las salidas
- Entonces Proyectos lleva a la página de proyectos, Contacto a los datos de contacto y GitHub al perfil de GitHub.

### R7. Guion como datos
Cada nodo del guion DEBE ser un dato tipado (`line`, `pose`, `sospecha`, efectos de UI) ejecutado por una máquina de estados determinista. NO DEBE haber LLM, endpoint ni servidor.
