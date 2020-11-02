import { ShapeCreator } from '../helpers/shape-creator.js';

/**
 *
 * @param template
 * @param config
 */
export function squareDraw(template, config) {
  template.setAttributeNS(null, 'x', config.x);
  template.setAttributeNS(null, 'y', config.y);
  template.setAttributeNS(null, 'width', config.width);
  template.setAttributeNS(null, 'height', config.height);
}

/**
 *
 * @param shapeCtx { IShape }
 * @param pointId { IResizablePointType }
 * @param event {Event}
 */
export function squareResize(shapeCtx, pointId, event) {
  if (!pointId) return;
  const point = shapeCtx.resizable.points[pointId];
  const _resizer = resizer(point, shapeCtx.template, ['width', 'height', 'x', 'y'])

  [shapeCtx.config.width, shapeCtx.config.height,  shapeCtx.config.x,  shapeCtx.config.y] = _resizer(pointId);

  // switch (pointId) {
  //   case 'e': set('x', 'width', true); break;
  //   case 'w': set('x', 'width'); break;
  //   case 's': set('y', 'height', true); break;
  //   case 'n': set('y', 'height'); break;
  //   case 'nw': set('x', 'width'); set('y', 'height'); break;
  //   case 'ne': set('x', 'width', true); set('y', 'height'); break;
  //   case 'se': set('x', 'width', true); set('y', 'height', true); break;
  //   case 'sw': set('x', 'width'); set('y', 'height', true); break;
  //   default: break;
  // }
}

export function SquareShape(config) {
  return ShapeCreator('rect', config, squareDraw, squareResize);
}
