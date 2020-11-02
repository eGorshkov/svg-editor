import { ShapeCreator } from '../helpers/shape-creator.js';

export function circleDraw(template, config) {
  template.setAttributeNS(null, 'cx', config.x);
  template.setAttributeNS(null, 'cy', config.y);
  template.setAttributeNS(null, 'r', config.width / 2);
}

export function CircleShape(config) {
  return ShapeCreator('circle', config, circleDraw);
}
