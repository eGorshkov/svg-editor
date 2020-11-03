export class ResizablePoints {
  #defaultPointTemplate = {
    width: 15,
    height: 15,
    fill: 'rgb(41, 182, 242)',
    stroke: 'rgb(255, 255, 255)'
  };

  constructor(coords) {
    this.overlay = {
      width: coords.width,
      height: coords.height,
      x: coords.x,
      y: coords.y,
      fill: 'none',
      stroke: 'rgb(41, 182, 242)'
    };
    this.nw = { ...this.#defaultPointTemplate, x: coords.x, y: coords.y, cursor: 'nw-resize' };
    this.n = { ...this.#defaultPointTemplate, x: coords.x + coords.width / 2, y: coords.y, cursor: 'n-resize' };
    this.ne = { ...this.#defaultPointTemplate, x: coords.x + coords.width, y: coords.y, cursor: 'ne-resize' };
    this.w = { ...this.#defaultPointTemplate, x: coords.x, y: coords.y + coords.height / 2, cursor: 'w-resize' };
    this.e = {
      ...this.#defaultPointTemplate,
      x: coords.x + coords.width,
      y: coords.y + coords.height / 2,
      cursor: 'e-resize'
    };
    this.sw = { ...this.#defaultPointTemplate, x: coords.x, y: coords.y + coords.height, cursor: 'sw-resize' };
    this.s = {
      ...this.#defaultPointTemplate,
      x: coords.x + coords.width / 2,
      y: coords.y + coords.height,
      cursor: 's-resize'
    };
    this.se = {
      ...this.#defaultPointTemplate,
      x: coords.x + coords.width,
      y: coords.y + coords.height,
      cursor: 'se-resize'
    };
  }

  get circlesNames() {
    return ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
  }
}
