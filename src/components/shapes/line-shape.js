import { ShapeCreator } from '../helpers/shape-creator.js';
import { Resizer } from '../helpers/resizable/resizer.js';

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
  Resizer.defaultStrategy(shapeCtx.config, shapeCtx.resizable.points[pointId], pointId)
}

export function LineShape(config) {
  return ShapeCreator('line', config, lineDraw, lineResize);
}
