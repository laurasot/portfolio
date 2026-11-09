import type { PoseId } from './types';
import base from '../assets/poses/base.png';
import pensando from '../assets/poses/pensando.png';
import cinta from '../assets/poses/cinta.png';
import duda from '../assets/poses/duda.png';
import miraCinta from '../assets/poses/mira-cinta.png';
import giro from '../assets/poses/giro.png';

/** 'crop' = PNG provisionales recortados por CSS; 'cutout' = recortes transparentes definitivos.
 * Cambiar la constante basta: Sala.module.css trae el bloque [data-render="cutout"]. */
export const RENDER: 'crop' | 'cutout' = 'crop';

export const POSES: Record<PoseId, ImageMetadata> = {
  base,
  pensando,
  cinta,
  duda,
  'mira-cinta': miraCinta,
  giro,
};
