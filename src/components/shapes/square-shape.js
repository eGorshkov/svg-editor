import { ShapeCreator } from '../helpers/shape-creator.js';
import Resizer from '../helpers/resizable/resizer.js';
import Linker from '../helpers/linker/linker.js';
import {
  defaultStrokeSetting,
  defaultFillSetting,
  InputAsNumberChange
} from '../helpers/settings-callback-functions.js';

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
  Resizer.defaultStrategy(shapeCtx.config, shapeCtx.resizable.points[pointId], pointId);
}

export function squareLinking(shapeCtx) {
  return Linker.defaultStrategy(shapeCtx, ['n', 'e', 's', 'w']);
}

/**
 *
 * @param shapeCtx { IShape }
 * @returns {ISetting[]}
 */
export function squareSetting(shapeCtx) {
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

export function SquareShape(config) {
  return ShapeCreator('rect', config, squareDraw, squareResize, squareSetting, squareLinking);
}
