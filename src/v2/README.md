# Portfolio v2

Experiencia "Sala": una estatua que conversa con quien visita. Astro estático, TypeScript y CSS Modules, sin dependencias nuevas. Aislada de v1: todo vive en `src/v2/` y las páginas `v2`.

## Rutas

- `/v2` y `/en/v2`: la Sala.
- `/v2/proyectos` y `/en/v2/projects`: proyectos y contacto (también es el atajo y el contenido de `<noscript>`).

## Contenido pendiente

Los huecos están marcados como `[[TODO: ...]]` en `src/v2/data/` (`es.ts`, `en.ts`, `projects.es.ts`, `projects.en.ts`). El build avisa de cuántos quedan. Para listarlos en el HTML generado: `grep -r "\[\[TODO" dist`.

## Build estricto (falla si quedan TODOs)

```bash
V2_STRICT=1 npm run build
```

```powershell
$env:V2_STRICT=1; npm run build
```

## Imagen de la estatua

`RENDER` en `src/v2/data/poses.ts`: `'crop'` (recorte CSS de las poses) o `'cutout'` (recortes ya sin fondo).

## Sonido y movimiento

Sonido opt-in (`sessionStorage('v2.sound')`); `TRACK` en `sound.ts` espera la licencia de la música. Con `prefers-reduced-motion` todo son cortes secos.
