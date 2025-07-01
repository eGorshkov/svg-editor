import between from '../between.js';
import { ShapeCreator } from '../shape-creator.js';

/**
 * Константа STEP — шаг для связи между фигурами.
 * @type {number}
 */
const STEP = 20;

/**
 * Константа CIRCLE_WIDTH — ширина круга для связи.
 * @type {number}
 */
const CIRCLE_WIDTH = 15;

/**
 * Объект COORDS_BY_TYPE — координаты для связи между фигурами.
 * @type {Object}
 */
const COORDS_BY_TYPE = {
  e: coords => ({
    x: coords.x + coords.width,
    y: coords.y + coords.height / 2
  }),
  w: coords => ({
    x: coords.x,
    y: coords.y + coords.height / 2
  }),
  s: coords => ({
    x: coords.x + coords.width / 2,
    y: coords.y + coords.height
  }),
  n: coords => ({
    x: coords.x + coords.width / 2,
    y: coords.y
  }),
  se: coords => ({
    x: coords.x + coords.width,
    y: coords.y + coords.height
  }),
  sw: coords => ({
    x: coords.x,
    y: coords.y + coords.height
  }),
  get(...args) {
    const [_, coords] = args;
    return {
      ...coords,
      ...getter.apply(this, args)
    };
  }
};

/**
 * Объект COORDS_BY_TYPE_WITH_STEP — координаты для связи между фигурами с шагом.
 * @type {Object}
 */
const COORDS_BY_TYPE_WITH_STEP = {
  e: coords => ({
    x: coords.x + coords.width + STEP,
    y: coords.y + coords.height / 2
  }),
  w: coords => ({
    x: coords.x - STEP,
    y: coords.y + coords.height / 2
  }),
  s: coords => ({
    x: coords.x + coords.width / 2,
    y: coords.y + coords.height + STEP
  }),
  n: coords => ({
    x: coords.x + coords.width / 2,
    y: coords.y - STEP
  }),
  ne: coords => ({
    x: coords.x + coords.width + STEP,
    y: coords.y
  }),
  nw: coords => ({
    x: coords.x,
    y: coords.y
  }),
  se: coords => ({
    x: coords.x + coords.width + STEP,
    y: coords.y + coords.height
  }),
  sw: coords => ({
    x: coords.x - STEP,
    y: coords.y + coords.height
  }),
  get(...args) {
    const [_, coords] = args;
    return {
      ...coords,
      ...getter.apply(this, args)
    };
  }
};

/**
 * Объект GET_POINT — координаты для связи между фигурами.
 * @type {Object}
 */
const GET_POINT = {
  vertical: {
    findAwayPoint(isLeft, isUpper) {
      return isUpper ? 's' : 'n';
    },
    near(start, end) {
      return [{ x: end.x, y: start.y }];
    },
    away(start, end, isLeft, isUpper) {
      const halfWidth = end.width / 2;
      const startWidth = start.width * (isLeft ? 1 : -1);

      if (between(start.x + startWidth, end.x - end.width, end.x + end.width)) {
        const x = isLeft ? end.x - halfWidth - STEP : end.x + halfWidth + STEP;
        return [
          { x, y: start.y },
          { x, y: end.y }
        ];
      }

      const x = start.x - (start.x - end.x) / 2;
      return [
        { x, y: start.y },
        { x, y: end.y }
      ];
    }
  },
  horizontal: {
    findAwayPoint(isLeft, isUpper) {
      return isLeft ? 'e' : 'w';
    },
    near(start, end) {
      return [{ x: start.x, y: end.y }];
    },
    away(start, end, isLeft, isUpper) {
      const halfHeight = end.height / 2;
      const startHeight = start.height * (isUpper ? 1 : -1);

      if (between(start.y + startHeight, end.y - end.height, end.y + end.height)) {
        const y = isUpper ? end.y - halfHeight - STEP : end.y + halfHeight + STEP;
        return [
          { x: start.x, y },
          { x: end.x, y }
        ];
      }

      const y = start.y - (start.y - end.y) / 2;
      return [
        { x: start.x, y },
        { x: end.x, y }
      ];
    }
  },
  get(startProp, endProp, start, end, isLeft, isUpper) {
    const strategy = isHorizontalType(startProp) ? this.horizontal : this.vertical;
    const fn = strategy.findAwayPoint(isLeft, isUpper).includes(endProp) ? strategy.away : strategy.near;
    return fn(start, end, isLeft, isUpper);
  }
};

/**
 * Функция проверяет, является ли тип горизонтальным.
 * @param {string} type Тип фигуры
 * @returns {boolean} true, если тип горизонтальный
 */
function isHorizontalType(type) {
  return ['w', 'sw', 'nw', 'e', 'se', 'sw'].includes(type);
}

/**
 * Функция получает координаты для связи между фигурами.
 * @param {string} type Тип фигуры
 * @param {Object} coords Координаты фигуры
 * @param {boolean} isCircle true, если фигура круглая
 * @returns {Object} Координаты для связи между фигурами
*/
function getter(type, coords, isCircle) {
  if (!this[type]) return { x: 0, y: 0 };
  coords = {
    ...coords,
    height: isCircle ? coords.width : coords.height
  };
  const config = this[type](coords);
  return isCircle
    ? {
        x: config.x - coords.width / 2,
        y: config.y - coords.width / 2
      }
    : config;
}

/**
 * Функция получает дополнительные точки для связи между фигурами.
 * @param {string} startProp Тип фигуры
 * @param {string} endProp Тип фигуры
 * @param {Object} start Координаты фигуры
 * @param {Object} end Координаты фигуры
 * @returns {Object} Дополнительные точки для связи между фигурами
*/
function getAdditionalPoints(startProp, endProp, start, end) {
  return GET_POINT.get(startProp, endProp, start, end, start.x < end.x, start.y < end.y);
}

/**
 * Функция получает координаты для связи между фигурами.
 * @param {string} type Тип фигуры
 * @param {Object} coords Координаты фигуры
 * @param {boolean} isCircle true, если фигура круглая
 * @returns {Object} Координаты для связи между фигурами
*/
function getCoords(type, coords, isCircle) {
  return [COORDS_BY_TYPE.get(...arguments), COORDS_BY_TYPE_WITH_STEP.get(...arguments)];
}

/**
 * Функция получает координаты для связи между фигурами.
 * @param {Object} shapeCtx Контекст фигуры
 * @param {Array} types Типы фигур
 * @returns {Object} Координаты для связи между фигурами
*/
function defaultStrategy(shapeCtx, types) {
  let points = {};
  const templates = Array(types.length)
    .fill()
    .map((_, i) => {
      const [template] = ShapeCreator('circle', {}),
        type = types[i],
        point = (points[type] = COORDS_BY_TYPE.get(type, shapeCtx.config, shapeCtx.type === 'circle'));

      template.setAttributeNS(null, 'cx', point.x);
      template.setAttributeNS(null, 'cy', point.y);
      template.setAttributeNS(null, 'r', CIRCLE_WIDTH / 2);
      template.setAttributeNS(null, 'width', CIRCLE_WIDTH);
      template.setAttribute('type', type);

      template.style.cursor = 'pointer';

      template.addEventListener('mouseenter', () => (template.style.visibility = 'visible'));
      template.addEventListener('mouseout', () => (template.style.visibility = 'hidden'));
      template.addEventListener('click', () => shapeCtx.setLink(type, point));

      return template;
    });

  return {
    points,
    templates,
    kill(template) {
      this.templates.forEach(t => template.removeChild(t));
    },
    updatePosition(shapeCtx) {
      this.templates.forEach(t => {
        const type = t.getAttribute('type'),
          point = COORDS_BY_TYPE.get(type, shapeCtx.config, shapeCtx.type === 'circle');
        this.points[type] = point;
        t.setAttributeNS(null, 'cx', point.x);
        t.setAttributeNS(null, 'cy', point.y);
      });
    },
    get(type) {
      return {
        points: this.points[type],
        template: this.templates.find(t => t.getAttribute('type', type) === type)
      };
    },
    show() {
      this.templates.forEach(x => (x.style.visibility = 'visible'));
    },
    hide() {
      this.templates.forEach(x => (x.style.visibility = 'hidden'));
    }
  };
}

/**
 * Объект Linker — управляет связями между фигурами.
 * @type {Object}
 */
const Linker = {
  getCoords,
  getAdditionalPoints,
  defaultStrategy
};

export default Linker;
