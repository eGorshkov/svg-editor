import { ShapeCreator } from './helpers/shape-creator.js';

export function squareDraw(template, config) {
  template.setAttributeNS(null, 'x', config.x);
  template.setAttributeNS(null, 'y', config.y);
}

export function SquareShape(config) {
  return ShapeCreator('rect', config, { width: 80, height: 80 }, squareDraw);
}
