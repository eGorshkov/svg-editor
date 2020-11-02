import { ShapeCreator } from '../helpers/shape-creator.js';

export function lineDraw(template, config) {
  template.setAttributeNS(null, 'stroke-width', '5px');
  template.setAttributeNS(null, 'x1', config.x);
  template.setAttributeNS(null, 'y1', config.y);
  template.setAttributeNS(null, 'x2', config.x + config.width);
  template.setAttributeNS(null, 'y2', config.y + config.height);
}

export function LineShape(config) {
  return ShapeCreator('line', config, lineDraw);
}
