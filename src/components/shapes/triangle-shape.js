import { ShapeCreator } from '../helpers/shape-creator.js';

export function triangleDraw(template, config) {
  template.style.transform = `translate(${config.x}px, ${config.y}px)`;
  template.setAttributeNS(null, 'points', `0,${config.height} ${config.width / 2},0 ${config.width},${config.height}`);
}

/**
 *
 * @param shapeCtx { IShape }
 * @param pointId { IResizablePointType }
 * @param event {Event}
 */
export function triangleResize(shapeCtx, pointId, event) {
  if (!pointId) return;
  const point = shapeCtx.resizable.points[pointId];
  console.log(shapeCtx);

  function set(pointKey, sizeKey, invert = false) {
    if (invert) {
      shapeCtx.config[sizeKey] = point[pointKey] - shapeCtx.config[pointKey];
    } else {
      shapeCtx.config[sizeKey] += shapeCtx.config[pointKey] - point[pointKey];
      shapeCtx.config[pointKey] -= shapeCtx.config[pointKey] - point[pointKey];
    }
  }

  switch (pointId) {
    case 'e':
      set('x', 'width', true);
      break;
    case 'w':
      set('x', 'width');
      break;
    case 's':
      set('y', 'height', true);
      break;
    case 'n':
      set('y', 'height');
      break;
    case 'nw':
      set('x', 'width');
      set('y', 'height');
      break;
    case 'ne':
      set('x', 'width', true);
      set('y', 'height');
      break;
    case 'se':
      set('x', 'width', true);
      set('y', 'height', true);
      break;
    case 'sw':
      set('x', 'width');
      set('y', 'height', true);
      break;
    default:
      break;
  }
}

export function TriangleShape(config) {
  return ShapeCreator('polygon', config, triangleDraw, triangleResize);
}
