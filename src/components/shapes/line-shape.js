import { ShapeCreator } from '../helpers/shape-creator.js';

export function lineDraw(template, config) {
  template.setAttributeNS(null, 'stroke-width', '5px');
  template.setAttributeNS(null, 'x1', config.x);
  template.setAttributeNS(null, 'y1', config.y);
  template.setAttributeNS(null, 'x2', config.x + config.width);
  template.setAttributeNS(null, 'y2', config.y + config.height);
}

/**
 *
 * @param shapeCtx { IShape }
 * @param pointId { IResizablePointType }
 * @param event {Event}
 */
export function lineResize(shapeCtx, pointId, event) {
  if (!pointId) return;
  const point = shapeCtx.resizable.points[pointId];

  function set(pointKey, sizeKey, invert = false) {
    if (invert) {
      shapeCtx.config[sizeKey] = point[pointKey] - shapeCtx.config[pointKey];
    } else {
      shapeCtx.config[sizeKey] += (shapeCtx.config[pointKey] - point[pointKey]);
      shapeCtx.config[pointKey] -= (shapeCtx.config[pointKey] - point[pointKey]);
    }
  }

  switch (pointId) {
    case 'e': set('x', 'width', true); break;
    case 'w': set('x', 'width'); break;
    case 's': set('y', 'height', true); break;
    case 'n': set('y', 'height'); break;
    case 'nw': set('x', 'width'); set('y', 'height'); break;
    case 'ne': set('x', 'width', true); set('y', 'height'); break;
    case 'se': set('x', 'width', true); set('y', 'height', true); break;
    case 'sw': set('x', 'width'); set('y', 'height', true); break;
    default: break;
  }
}


export function LineShape(config) {
  return ShapeCreator('line', config, lineDraw, lineResize);
}
