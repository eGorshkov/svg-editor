/**
 * Класс ResizablePoints — вычисляет координаты точек изменения размера для разных фигур.
 */
export class ResizablePoints {
  #defaultPointTemplate = {
    width: 15,
    height: 15,
    fill: 'rgb(41, 182, 242)',
    stroke: 'rgb(255, 255, 255)'
  };

  #nw = coords => ({ ...this.#defaultPointTemplate, x: coords.x, y: coords.y, cursor: 'nw-resize' });
  #n = coords => ({ ...this.#defaultPointTemplate, x: coords.x + coords.width / 2, y: coords.y, cursor: 'n-resize' });
  #ne = coords => ({ ...this.#defaultPointTemplate, x: coords.x + coords.width, y: coords.y, cursor: 'ne-resize' });
  #w = coords => ({ ...this.#defaultPointTemplate, x: coords.x, y: coords.y + coords.height / 2, cursor: 'w-resize' });
  #e = coords => ({
    ...this.#defaultPointTemplate,
    x: coords.x + coords.width,
    y: coords.y + coords.height / 2,
    cursor: 'e-resize'
  });
  #sw = coords => ({ ...this.#defaultPointTemplate, x: coords.x, y: coords.y + coords.height, cursor: 'sw-resize' });
  #s = coords => ({
    ...this.#defaultPointTemplate,
    x: coords.x + coords.width / 2,
    y: coords.y + coords.height,
    cursor: 's-resize'
  });
  #se = coords => ({
    ...this.#defaultPointTemplate,
    x: coords.x + coords.width,
    y: coords.y + coords.height,
    cursor: 'se-resize'
  });

  /**
   * Массив точек.
   * @type {Array}
   */
  points = [];

  /**
   * Конструктор ResizablePoints.
   * @param {SVGElement} template SVG-элемент фигуры
   * @param {Object} config Конфигурация фигуры
   * @param {string} type Тип фигуры
   */
  constructor(template, config, type) {
    this.shapeType = type;
    switch (type) {
      case 'line':
        this.#lineStrategy(template, config);
        break;
      default:
        this.#defaultStrategy(template, config);
        break;
    }
  }

  #lineStrategy(template, coords) {
    this.overlay = {
      width: coords.width,
      height: coords.height,
      x: coords.x,
      y: coords.y,
      fill: 'none',
      stroke: 'none'
    };
    const isX2IsLowerThanX1 = +template.attributes.x2.value < +template.attributes.x1.value;
    const isY2IsBiggerThanY1 = +template.attributes.y2.value >= +template.attributes.y1.value;
    [this.l1, this.l2] = isX2IsLowerThanX1
      ? [(isY2IsBiggerThanY1 ? this.#ne : this.#se)(coords), (isY2IsBiggerThanY1 ? this.#sw : this.#nw)(coords)]
      : [(isY2IsBiggerThanY1 ? this.#nw : this.#sw)(coords), (isY2IsBiggerThanY1 ? this.#se : this.#ne)(coords)];
  }

  #defaultStrategy(template, coords) {
    this.overlay = {
      width: coords.width,
      height: coords.height,
      x: coords.x,
      y: coords.y,
      fill: 'none',
      stroke: 'rgb(41, 182, 242)'
    };
    this.nw = this.#nw(coords);
    this.n = this.#n(coords);
    this.ne = this.#ne(coords);
    this.w = this.#w(coords);
    this.e = this.#e(coords);
    this.sw = this.#sw(coords);
    this.s = this.#s(coords);
    this.se = this.#se(coords);
  }

  get circlesNames() {
    switch (this.shapeType) {
      case 'line':
        return ['l1', 'l2'];
      default:
        return ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
    }
  }
}
