/**
 * Коллбэки для обработки изменений настроек.
 * @module settingsCallbackFunctions
 */

/**
 * Генерирует настройку цвета обводки фигуры.
 * @param {IShape} shapeCtx Контекст фигуры
 * @returns {{type: string, label: string, currentValue: *, cb: Function}} Объект настройки цвета
 */
export function defaultStrokeSetting(shapeCtx) {
  return {
    type: 'color',
    label: 'Stroke: ',
    currentValue: shapeCtx.config.stroke,
    cb: ColorChange(shapeCtx, 'stroke')
  };
}

/**
 * Генерирует настройку заливки фигуры.
 * @param {IShape} shapeCtx Контекст фигуры
 * @returns {{type: string, label: string, currentValue: *, cb: Function}} Объект настройки заливки
 */
export function defaultFillSetting(shapeCtx) {
  return { type: 'color', label: 'Fill: ', currentValue: shapeCtx.config.fill, cb: ColorChange(shapeCtx, 'fill') };
}

/**
 * Генерирует настройку цвета текста фигуры.
 * @param {IShape} shapeCtx Контекст фигуры
 * @returns {{type: string, label: string, currentValue: *, cb: Function}} Объект настройки цвета текста
 */
export function defaultColorSetting(shapeCtx) {
  return {
    type: 'color',
    label: 'Text color: ',
    currentValue: shapeCtx.config.color,
    cb: ColorChange(shapeCtx, 'color')
  };
}

/**
 * Внутренний колбэк для изменения цвета SVG-элемента.
 * @param {IShape} shapeCtx Контекст фигуры
 * @param {string} key Ключ свойства (например, 'stroke', 'fill', 'color')
 * @returns {Function} Функция-обработчик события input
 */
function ColorChange(shapeCtx, key) {
  return ({ target }) => {
    shapeCtx.template.style[key] = shapeCtx.config[key] = target.value;
  };
}

/**
 * Колбэк для изменения числового значения через input.
 * @param {IShape} shapeCtx Контекст фигуры
 * @param {string} key Ключ свойства
 * @returns {Function} Функция-обработчик события input
 */
export function InputAsNumberChange(shapeCtx, key) {
  return ({ target }) => {
    shapeCtx.config[key] = target.valueAsNumber ?? 0;
    shapeCtx.draw(shapeCtx.template, shapeCtx.config);
  };
}

/**
 * Колбэк для изменения булевого значения через checkbox.
 * @param {IShape} shapeCtx Контекст фигуры
 * @param {string} key Ключ свойства
 * @returns {Function} Функция-обработчик события checkbox
 */
export function CheckboxChange(shapeCtx, key) {
    return () => {
        shapeCtx.config[key] = !shapeCtx.config[key];
        shapeCtx.draw(shapeCtx.template, shapeCtx.config);
    }
}

/**
 * Пример колбэка для обработки изменения цвета (заглушка).
 * @param {string} color Новый цвет
 */
export function onColorChange(color) {
  // ... реализация ...
}

/**
 * Пример колбэка для обработки изменения размера (заглушка).
 * @param {number} size Новый размер
 */
export function onSizeChange(size) {
  // ... реализация ...
}
