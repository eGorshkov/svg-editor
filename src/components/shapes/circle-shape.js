import { ShapeCreator } from '../helpers/shape-creator.js';
import Resizer from '../helpers/resizable/resizer.js';
import {
  defaultFillSetting,
  defaultStrokeSetting,
  InputAsNumberChange
} from '../helpers/settings-callback-functions.js';
import Linker from '../helpers/linker/linker.js';

/**
 * Функция отрисовки круга.
 * @param {SVGElement} template SVG-элемент
 * @param {IShapeConfig} config Конфигурация фигуры
 */
export function circleDraw(template, config) {
  template.setAttributeNS(null, 'cx', config.x);
  template.setAttributeNS(null, 'cy', config.y);
  template.setAttributeNS(null, 'r', config.width / 2);
  template.setAttributeNS(null, 'width', config.width);
}

/**
 * Функция изменения размера круга.
 * @param {IShape} shapeCtx Контекст фигуры
 * @param {IResizablePointType} pointId Точка изменения
 * @param {Event} event Событие
 */
export function circleResize(shapeCtx, pointId, event) {
  Resizer.circleStrategy(shapeCtx.config, shapeCtx.template, shapeCtx.resizable.points[pointId], pointId);
}

/**
 * Функция настроек круга.
 * @param {IShape} shapeCtx Контекст фигуры
 * @returns {ISetting[]} Массив настроек
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

/**
 * Функция линковки круга.
 * @param {IShape} shapeCtx Контекст фигуры
 * @returns {Object} Стратегия линковки
 */
export function circleLinking(shapeCtx) {
  return Linker.defaultStrategy(shapeCtx, ['n', 'e', 's', 'w']);
}

/**
 * Конструктор фигуры "Круг".
 * @param {IShapeConfig} config Конфигурация фигуры
 * @returns {Array} Массив с шаблоном и обработчиками
 */
export function CircleShape(config) {
  return ShapeCreator('circle', config, circleDraw, circleResize, circleSetting, circleLinking);
}
