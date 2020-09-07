import { ShapeCreator } from '../helpers/shape-creator.js';

export function triangleDraw(template, config) {
  template.style.transform = `translate(${config.x}px, ${config.y}px)`;
  template.setAttributeNS(null, 'points', `0,${config.height} ${config.width / 2},0 ${config.width},${config.height}`);
}

export function TriangleShape(config) {
  return ShapeCreator(
    'polygon',
    config,
    {
      width: 80,
      height: 80
    },
    triangleDraw
  );
}
