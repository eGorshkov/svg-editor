import { ShapeCreator } from '../helpers/shape-creator.js';
import { Resizer } from '../helpers/resizable/resizer.js';
import {
  defaultFillSetting,
  defaultStrokeSetting,
  InputAsNumberChange
} from '../helpers/settings-callback-functions.js';

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
  Resizer.defaultStrategy(shapeCtx.config, shapeCtx.resizable.points[pointId], pointId);
}
/**
 *
 * @param shapeCtx { IShape }
 * @returns {ISetting[]}
 */
export function triangleSetting(shapeCtx) {
  return [
    defaultStrokeSetting(shapeCtx),
    defaultFillSetting(shapeCtx),
    { type: 'inputAsNumber', label: 'X: ', currentValue: shapeCtx.config.x, cb: InputAsNumberChange(shapeCtx, 'x') },
    { type: 'inputAsNumber', label: 'Y: ', currentValue: shapeCtx.config.y, cb: InputAsNumberChange(shapeCtx, 'y') },
    {
      type: 'inputAsNumber',
      label: 'Width: ',
      currentValue: shapeCtx.config.width,
      cb: InputAsNumberChange(shapeCtx, 'width')
    },
    {
      type: 'inputAsNumber',
      label: 'Height: ',
      currentValue: shapeCtx.config.height,
      cb: InputAsNumberChange(shapeCtx, 'height')
    }
  ];
}

export function TriangleShape(config) {
  return ShapeCreator('polygon', config, triangleDraw, triangleResize, triangleSetting);
}
