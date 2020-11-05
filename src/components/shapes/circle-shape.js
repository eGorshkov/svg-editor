import { ShapeCreator } from '../helpers/shape-creator.js';
import { Resizer } from '../helpers/resizable/resizer.js';

export function circleDraw(template, config) {
  template.setAttributeNS(null, 'cx', config.x);
  template.setAttributeNS(null, 'cy', config.y);
  template.setAttributeNS(null, 'r', config.width / 2);
  template.setAttributeNS(null, 'width', config.width);
  template.setAttributeNS(null, 'height', config.height);
}

/**
 *
 * @param shapeCtx { IShape }
 * @param pointId { IResizablePointType }
 * @param event {Event}
 */
export function circleResize(shapeCtx, pointId, event) {
  Resizer.circleStrategy(shapeCtx.config, shapeCtx.template, shapeCtx.resizable.points[pointId], pointId)
}

export function CircleShape(config) {
  return ShapeCreator('circle', config, circleDraw, circleResize);
}
