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
 * @param event {Event}
 * @param activePointId { IResizablePointType }
 */
export function squareResize(shapeCtx, event, activePointId) {
  if (!activePointId) return;
  switch (activePointId) {
    case 'w':
    case 'e':
      shapeCtx.config.width = event.x;
      break;
    case 's':
    case 'n':
      shapeCtx.config.height = event.y;
      break;
    default:
      shapeCtx.config.width = shapeCtx.config.height = event.x;
      break;
  }
}

export function SquareShape(config) {
  return ShapeCreator('rect', config, squareDraw, squareResize);
}
