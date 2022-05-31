import { ShapeCreator } from '../helpers/shape-creator.js';
import Resizer from '../helpers/resizable/resizer.js';
import {
  defaultFillSetting,
  defaultStrokeSetting,
  InputAsNumberChange
} from '../helpers/settings-callback-functions.js';
import Linker from '../helpers/linker/linker.js';

export function circleDraw(template, config) {
  template.setAttributeNS(null, 'cx', config.x);
  template.setAttributeNS(null, 'cy', config.y);
  template.setAttributeNS(null, 'r', config.width / 2);
  template.setAttributeNS(null, 'width', config.width);
}

/**
 *
 * @param shapeCtx { IShape }
 * @param pointId { IResizablePointType }
 * @param event {Event}
 */
export function circleResize(shapeCtx, pointId, event) {
  Resizer.circleStrategy(shapeCtx.config, shapeCtx.template, shapeCtx.resizable.points[pointId], pointId);
}
/**
 *
 * @param shapeCtx { IShape }
 * @returns {ISetting[]}
 */
export function circleSetting(shapeCtx) {
  return [
    defaultStrokeSetting(shapeCtx),
    defaultFillSetting(shapeCtx),
    { type: 'inputAsNumber', label: 'Cx: ', currentValue: shapeCtx.config.x, cb: InputAsNumberChange(shapeCtx, 'x') },
    { type: 'inputAsNumber', label: 'Cy: ', currentValue: shapeCtx.config.y, cb: InputAsNumberChange(shapeCtx, 'y') },
    {
      type: 'inputAsNumber',
      label: 'Width: ',
      currentValue: shapeCtx.config.width,
      cb: InputAsNumberChange(shapeCtx, 'width')
    }
  ];
}

export function circleLinking(shapeCtx) {
  return Linker.defaultStrategy(shapeCtx, ['n', 'e', 's', 'w']);
}

export function CircleShape(config) {
  return ShapeCreator('circle', config, circleDraw, circleResize, circleSetting, circleLinking);
}
