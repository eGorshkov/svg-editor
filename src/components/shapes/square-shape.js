import { ShapeCreator } from '../helpers/shape-creator.js';
import Resizer from '../helpers/resizable/resizer.js';
import Linker from '../helpers/linker/linker.js';
import {
  defaultStrokeSetting,
  defaultFillSetting,
  InputAsNumberChange
} from '../helpers/settings-callback-functions.js';

/**
 * Функция отрисовки квадрата.
 * @param {SVGElement} template SVG-элемент
 * @param {IShapeConfig} config Конфигурация фигуры
 */
export function squareDraw(template, config) {
  template.setAttributeNS(null, 'x', config.x);
  template.setAttributeNS(null, 'y', config.y);
  template.setAttributeNS(null, 'width', config.width);
  template.setAttributeNS(null, 'height', config.height);
  template.setAttributeNS(null, 'stroke-width', config.strokeWidth ?? 1);
}

/**
 * Функция изменения размера квадрата.
 * @param {IShape} shapeCtx Контекст фигуры
 * @param {IResizablePointType} pointId Точка изменения
 * @param {Event} event Событие
 */
export function squareResize(shapeCtx, pointId, event) {
  Resizer.defaultStrategy(shapeCtx.config, shapeCtx.resizable.points[pointId], pointId);
}

/**
 * Функция линковки квадрата.
 * @param {IShape} shapeCtx Контекст фигуры
 * @returns {Object} Стратегия линковки
 */
export function squareLinking(shapeCtx) {
  return Linker.defaultStrategy(shapeCtx, ['n', 'e', 's', 'w']);
}

/**
 * Функция настроек квадрата.
 * @param {IShape} shapeCtx Контекст фигуры
 * @returns {ISetting[]} Массив настроек
 */
export function squareSetting(shapeCtx) {
  return [
    defaultStrokeSetting(shapeCtx),
    { type: 'inputAsNumber', label: 'Ширина контура: ', currentValue: shapeCtx.config.strokeWidth ?? 1, step: .1, cb: InputAsNumberChange(shapeCtx, 'strokeWidth') },
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

/**
 * Конструктор фигуры "Квадрат".
 * @param {IShapeConfig} config Конфигурация фигуры
 * @returns {Array} Массив с шаблоном и обработчиками
 */
export function SquareShape(config) {
  return ShapeCreator('rect', config, squareDraw, squareResize, squareSetting, squareLinking);
}
