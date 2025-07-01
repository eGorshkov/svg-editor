/**
 * Стратегия изменения размера для прямоугольных фигур.
 * @param {Object} config Конфигурация фигуры
 * @param {Object} point Координаты точки
 * @returns {Function} Функция для изменения размера
 */
function defaultStrategyCalculate(config, point) {
  const calculate = {
    e: () => {
      config.width = point.x - config.x;
    },
    w: () => {
      config.width += config.x - point.x;
      config.x -= config.x - point.x;
    },
    s: () => {
      config.height = point.y - config.y;
    },
    n: () => {
      config.height += config.y - point.y;
      config.y -= config.y - point.y;
    },
  };
  return pointId => calculate[pointId]();
}

/**
 * Стратегия изменения размера для прямоугольных фигур.
 * @param {Object} shapeConfig Конфигурация фигуры
 * @param {Object} point Координаты точки
 * @param {string} pointId Идентификатор точки
 */
function defaultStrategy(shapeConfig, point, pointId) {
  if (!pointId) {
    return;
  }
  pointId.match(/[\w]/gi).forEach(defaultStrategyCalculate(shapeConfig, point));
}

//#region Стратегия ресайза круга
/**
 * Стратегия изменения размера для круга.
 * @param {Object} shapeConfig Конфигурация фигуры
 * @param {SVGElement} shapeTemplate SVG шаблон фигуры
 * @param {Object} point Координаты точки
 * @param {string} pointId Идентификатор точки
 */
function circleStrategy(shapeConfig, shapeTemplate, point, pointId) {
  switch (pointId) {
    case 'se':
    case 'ne':
    case 'e':
      shapeConfig.width = point.x - shapeTemplate.cx.baseVal.value + shapeTemplate.r.baseVal.value;
      break;
    case 'n':
      shapeConfig.width = shapeTemplate.cy.baseVal.value + shapeTemplate.r.baseVal.value - point.y;
      break;
    case 's':
      shapeConfig.width = point.y - shapeTemplate.cy.baseVal.value + shapeTemplate.r.baseVal.value;
      break;
    case 'nw':
    case 'sw':
    case 'w':
      shapeConfig.width = shapeTemplate.cx.baseVal.value + shapeTemplate.r.baseVal.value - point.x;
      break;
    default:
      break;
  }
}
//#endregion

//#region Стратегия ресайза линии
/**
 * Стратегия изменения размера для линии.
 * @param {Object} shapeConfig Конфигурация фигуры
 * @param {SVGElement} shapeTemplate SVG шаблон фигуры
 * @param {Object} point Координаты точки
 * @param {string} pointId Идентификатор точки
 */
function lineStrategy(shapeConfig, shapeTemplate, point, pointId) {
  switch (pointId) {
    case 'l1':      
      shapeConfig.height += shapeConfig.y - point.y;
      shapeConfig.y -= shapeConfig.y - point.y;

      shapeConfig.width += shapeConfig.x - point.x;
      shapeConfig.x -= shapeConfig.x - point.x;
      break;
    case 'l2':
      shapeConfig.width = point.x - shapeConfig.x;
      shapeConfig.height = point.y - shapeConfig.y;
      break;
    default:
      break;
  }
}
//#endregion

/**
 * Объект Resizer — содержит стратегии изменения размера для разных фигур.
 */
const Resizer = {
  defaultStrategy,
  circleStrategy,
  lineStrategy
};

export default Resizer;
