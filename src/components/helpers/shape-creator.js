/**
 * Создаёт SVG-элемент с заданным именем.
 * @param {string} elementName Имя SVG-элемента
 * @returns {Element} SVG-элемент
 */
export function createTemplate(elementName) {
  return document.createElementNS('http://www.w3.org/2000/svg', elementName);
}

/**
 * Фабрика для создания фигуры и её обработчиков.
 * @param {string} elementName Имя SVG-элемента
 * @param {*} config Конфигурация фигуры
 * @param {(template, config) => void} drawCallback Функция отрисовки
 * @param {(shapeCtx, pointId, event) => void} resizeCallback Функция изменения размера
 * @param {(shapeCtx) => ISetting[]} settingCallback Функция настроек
 * @param {() => any} linkingCallback Функция линковки
 * @returns {[HTMLElement, IShapeConfig, Function, Function, Function, Function]} Массив с обработчиками и шаблоном
 */
export function ShapeCreator(elementName, config, drawCallback, resizeCallback, settingCallback, linkingCallback) {
  const template = createTemplate(elementName);
  template.setAttributeNS(null, 'width', config.width ?? 80);
  template.setAttributeNS(null, 'height', config.height ?? 80);
  template.setAttributeNS(null, 'cursor', config.cursor ?? 'default');
  template.setAttributeNS(null, 'fill', config.fill ?? 'rgb(255, 255, 255)');
  template.setAttributeNS(null, 'stroke', config.stroke ?? 'rgb(0, 0, 0)');
  return [
    template,
    config,
    drawCallback || defaultDraw,
    resizeCallback || defaultResize,
    settingCallback || null,
    linkingCallback || null
  ];
}

/**
 * Стандартная функция изменения размера (заглушка).
 * @param {IShape} shapeCtx Контекст фигуры
 * @param {*} event Событие
 * @param {string} activePointId Активная точка
 */
function defaultResize(shapeCtx, event, activePointId) {}

/**
 * Стандартная функция отрисовки фигуры.
 * @param {HTMLElement} template Шаблон фигуры
 * @param {IShapeConfig} config Конфигурация фигуры
 */
export function defaultDraw(template, config) {
  template.setAttributeNS(null, 'x', config.x);
  template.setAttributeNS(null, 'y', config.y);
}
