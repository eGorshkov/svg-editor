import { ShapeCreator } from '../helpers/shape-creator.js';
import Resizer from '../helpers/resizable/resizer.js';
import { InputAsNumberChange, defaultStrokeSetting } from '../helpers/settings-callback-functions.js';

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
  Resizer.defaultStrategy(shapeCtx.config, shapeCtx.resizable.points[pointId], pointId);
}

/**
 *
 * @param shapeCtx { IShape }
 * @returns {ISetting[]}
 */
export function lineSetting(shapeCtx) {
  return [
    defaultStrokeSetting(shapeCtx),
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

export function LineShape(config) {
  return ShapeCreator('line', config, lineDraw, lineResize, lineSetting);
}
