import { ShapeCreator } from '../helpers/shape-creator.js';

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
  if (!pointId) return;
  const point = shapeCtx.resizable.points[pointId];

  switch (pointId) {
    case 'se':
    case 'ne':
    case 'e':
      shapeCtx.config.width = point.x - shapeCtx.template.cx.baseVal.value + shapeCtx.template.r.baseVal.value;
      break;
    case 'n':
      shapeCtx.config.width = shapeCtx.template.cy.baseVal.value + shapeCtx.template.r.baseVal.value - point.y;
      break;
    case 's':
      shapeCtx.config.width = point.y - shapeCtx.template.cy.baseVal.value + shapeCtx.template.r.baseVal.value;
      break;
    case 'nw':
    case 'sw':
    case 'w':
      shapeCtx.config.width = shapeCtx.template.cx.baseVal.value + shapeCtx.template.r.baseVal.value - point.x;
      break;
    default: break;
  }
}

export function CircleShape(config) {
  return ShapeCreator('circle', config, circleDraw, circleResize);
}
