# Spec: v2-estatua

Estatua 2D por capas, poses, animación y cámara. Delta: capacidad nueva. Sin 3D.

## Requisitos

### R1. Seis poses
Debe haber 6 poses: `base`, `pensando`, `cinta`, `duda`, `mira-cinta`, `giro`. El guion DEBE indicar la pose de cada nodo. La pose `giro` (frontal) DEBE usarse solo en el giro final.

**Escenario: pose por nodo**
- Dado un nodo del guion con una pose
- Cuando se ejecuta
- Entonces la estatua muestra esa pose; `giro` no aparece antes del final.

### R2. Cambio de pose
El cambio de pose DEBE hacerse con crossfade de ~800 ms, con leve inclinación de cabeza o espejo.

**Escenario: cambio**
- Dado la pose `base`
- Cuando el guion pide `pensando`
- Entonces hay un crossfade de ~800 ms, sin corte.

### R3. Cinta
La grieta pequeña con cinta DEBE aparecer en "cosas raras" (escena 3) y DEBE permanecer visible hasta el final, también en el modo Elegancia.

**Escenario: la cinta se queda**
- Dado que la cinta ya apareció
- Cuando avanza cualquier escena posterior o corre la secuencia Elegancia
- Entonces la cinta sigue visible.

### R4. Post-its
Los post-its en el pedestal DEBEN aparecer con cortes secos (sin fade).

### R5. Halo y respiración
El halo cálido DEBE mostrarse solo cuando hay interés (según el guion). La estatua DEBE tener una respiración de ciclo de 6 s mientras no haya `prefers-reduced-motion`.

### R6. Giro final
El giro final DEBE ocurrir una sola vez: crossfade de 2 s a la pose `giro` con leve squash en scaleX.

**Escenario: una sola vez**
- Dado que el giro ya ocurrió
- Cuando el visitante permanece en el final o vuelve a la sala
- Entonces el giro no se repite.

### R7. Placa
La placa con solo el texto "Laura Soto" DEBE aparecer únicamente en el cuadro final.

**Escenario: placa**
- Dado cualquier cuadro anterior al final
- Entonces no hay placa; en el final la placa muestra "Laura Soto" y nada más.

### R8. Cámara
El encuadre por escena DEBE pasar de 100 % a 115 % y a 100–104 %, con 1,6 s de ease. La línea del suelo DEBE moverse la mitad que la cámara (parallax). El texto DEBE aparecer cuando la cámara termina. En tablet el zoom máximo DEBE ser 110 % y en móvil 106 %.

**Escenario: texto tras cámara**
- Dado un cambio de encuadre
- Cuando la cámara aún se mueve
- Entonces el texto de ese cuadro no ha aparecido; aparece al terminar los 1,6 s.

### R9. Rendimiento
Las animaciones DEBERÍAN usar solo `transform` y `opacity`.

### R10. Imágenes provisionales
Para la fase 1 se PUEDEN usar las imágenes actuales de baja resolución; sustituirlas por recortes transparentes de alta resolución NO DEBE requerir cambios de código (solo reemplazar assets).
