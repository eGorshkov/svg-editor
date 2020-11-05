import { ShapeCreator } from '../helpers/shape-creator.js';
import { Resizer } from '../helpers/resizable/resizer.js';

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
  Resizer.defaultStrategy(shapeCtx.config, shapeCtx.resizable.points[pointId], pointId)
}

export function SquareShape(config) {
  return ShapeCreator('rect', config, squareDraw, squareResize);
}
