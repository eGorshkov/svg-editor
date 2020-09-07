import { ShapeCreator } from './helpers/shape-creator.js';

export function circleDraw(template, config) {
  template.setAttributeNS(null, 'cx', config.x);
  template.setAttributeNS(null, 'cy', config.y);
  template.setAttributeNS(null, 'r', Math.max(config.width, config.height) / 2);
}

export function CircleShape(config) {
  return ShapeCreator('circle', config, { width: 80, height: 80 }, circleDraw);
}
