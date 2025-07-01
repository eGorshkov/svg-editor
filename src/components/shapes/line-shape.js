import { ShapeCreator } from '../helpers/shape-creator.js';
import Resizer from '../helpers/resizable/resizer.js';
import { InputAsNumberChange, CheckboxChange, defaultStrokeSetting } from '../helpers/settings-callback-functions.js';

/**
 * Функция отрисовки линии.
 * @param {SVGElement} template SVG-элемент
 * @param {IShapeConfig} config Конфигурация фигуры
 */
export function lineDraw(template, config) {
  template.setAttributeNS(null, 'stroke-width', '5px');
  template.setAttributeNS(null, 'x1', config.x);
  template.setAttributeNS(null, 'y1', config.y);
  template.setAttributeNS(null, 'x2', config.x + config.width);
  template.setAttributeNS(null, 'y2', config.y + config.height);


  if (config.ruler) {
    console.log(arguments);
    // template.parentElement
  }
}

/**
 * Функция изменения размера линии.
 * @param {IShape} shapeCtx Контекст фигуры
 * @param {IResizablePointType} pointId Точка изменения
 * @param {Event} event Событие
 */
export function lineResize(shapeCtx, pointId, event) {
  Resizer.lineStrategy(shapeCtx.config, shapeCtx.template, shapeCtx.resizable.points[pointId], pointId);
}

/**
 * Функция настроек линии.
 * @param {IShape} shapeCtx Контекст фигуры
 * @returns {ISetting[]} Массив настроек
 */
export function lineSetting(shapeCtx) {
  return [
    defaultStrokeSetting(shapeCtx),
    { type: 'checkbox', label: 'Линейка: ', currentValue: shapeCtx.config.ruler, cb: CheckboxChange(shapeCtx, 'ruler') },
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
 * Конструктор фигуры "Линия".
 * @param {IShapeConfig} config Конфигурация фигуры
 * @returns {Array} Массив с шаблоном и обработчиками
 */
export function LineShape(config) {
  return ShapeCreator('line', config, lineDraw, lineResize, lineSetting);
}