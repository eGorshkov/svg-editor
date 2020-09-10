import { ShapeCreator } from './shape-creator.js';
import { circleDraw, CircleShape } from '../shapes/circle-shape.js';
import { squareDraw, SquareShape } from '../shapes/square-shape.js';

export class Resizable {
  points = null;
  /**
   *
   * @type {SVGGElement}
   */
  template = null;
  dragOffsetX = null;
  dragOffsetY = null;
  draggable = false;

  #defaultPointTemplate = {
    width: 15,
    height: 15,
    fill: 'rgb(41, 182, 242)',
    stroke: 'rgb(255, 255, 255)'
  };

  #activePointId = null;
  get #activePoint() {
    if (this.template === null) {
      return null;
    }
    return this.template.children.namedItem(this.#activePointId);
  }

  _resize = (width, height) => {};

  constructor(shapeTemplate, shapeConfig) {
    [this.template] = ShapeCreator('g', {
      width: shapeConfig.width,
      height: shapeConfig.height
    });
    this.setPoints(this.getShapeCoords(shapeTemplate, shapeConfig));
    this.createOverlay();
    this.create();
  }

  resize() {
    const width = this.points.ne.x - this.points.nw.x;
    const height = this.points.se.y - this.points.ne.y;
    this._resize(width, height);
  }

  draw(pointTemplate) {
    if (pointTemplate === null) {
      return;
    }
    pointTemplate.id === 'overlay'
      ? squareDraw(pointTemplate, this.points[pointTemplate.id])
      : circleDraw(pointTemplate, this.points[pointTemplate.id]);
  }

  getShapeCoords(template, shapeConfig) {
    const coords = template.getBBox();
    coords.x = coords.x || shapeConfig.x;
    coords.y = coords.y || shapeConfig.y;
    return coords;
  }

  setPoints(coords) {
    this.points = {
      overlay: {
        width: coords.width,
        height: coords.height,
        x: coords.x,
        y: coords.y,
        fill: 'none',
        stroke: 'rgb(41, 182, 242)'
      },
      nw: { ...this.#defaultPointTemplate, x: coords.x, y: coords.y, cursor: 'nw-resize' },
      n: { ...this.#defaultPointTemplate, x: coords.x + coords.width / 2, y: coords.y, cursor: 'n-resize' },
      ne: { ...this.#defaultPointTemplate, x: coords.x + coords.width, y: coords.y, cursor: 'ne-resize' },
      w: { ...this.#defaultPointTemplate, x: coords.x, y: coords.y + coords.height / 2, cursor: 'w-resize' },
      e: {
        ...this.#defaultPointTemplate,
        x: coords.x + coords.width,
        y: coords.y + coords.height / 2,
        cursor: 'e-resize'
      },
      sw: { ...this.#defaultPointTemplate, x: coords.x, y: coords.y + coords.height, cursor: 'sw-resize' },
      s: {
        ...this.#defaultPointTemplate,
        x: coords.x + coords.width / 2,
        y: coords.y + coords.height,
        cursor: 's-resize'
      },
      se: {
        ...this.#defaultPointTemplate,
        x: coords.x + coords.width,
        y: coords.y + coords.height,
        cursor: 'se-resize'
      }
    };
  }

  create() {
    Object.keys(this.points)
      .reduce(this.createPoint(this.points), [])
      .forEach(point => this.template.appendChild(point));
  }

  createOverlay() {
    const [overlayTemplate, config, draw] = SquareShape(this.points.overlay);
    overlayTemplate.setAttribute('id', 'overlay');
    overlayTemplate.setAttributeNS(null, 'stroke-dasharray', '3 3');
    draw(overlayTemplate, config);
    this.template.appendChild(overlayTemplate);
  }

  createPoint(points) {
    return (acc, pointKey) => {
      if (pointKey === 'overlay') {
        return acc;
      }

      const [pointTemplate, config, draw] = CircleShape(points[pointKey]);
      pointTemplate.setAttribute('id', pointKey);
      draw(pointTemplate, config);
      this.setDraggable(pointTemplate);
      return [...acc, pointTemplate];
    };
  }

  hide(exception) {
    Array.from(this.template.children).forEach(
      point => (point.style.visibility = point.id === exception ? 'visible' : 'hidden')
    );
  }

  show(shapeTemplate, shapeConfig) {
    this.setPoints(this.getShapeCoords(shapeTemplate, shapeConfig));
    Array.from(this.template.children).forEach(point => {
      point.setAttributeNS(null, point.tagName === 'circle' ? 'cx' : 'x', this.points[point.id].x);
      point.setAttributeNS(null, point.tagName === 'circle' ? 'cy' : 'y', this.points[point.id].y);
      point.style.visibility = 'visible';
    });
  }

  remove() {
    Array.from(this.template).forEach(point => this.removeDraggable(point));
    this.template.remove();
    this.template = null;
    this.points = null;
  }

  //#region DRAG AND DROP

  setDraggable(pointTemplate) {
    pointTemplate.addEventListener('mousedown', this.start.bind(this), true);
  }

  removeDraggable(pointTemplate) {
    pointTemplate.removeEventListener('mousedown', this.start, true);
  }

  start(evt) {
    this.draggable = true;
    this.#activePointId = evt.target.id;
    this.dragOffsetX = evt.offsetX - this.points[this.#activePointId].x;
    this.dragOffsetY = evt.offsetY - this.points[this.#activePointId].y;
    this.hide(this.#activePointId);
    document.addEventListener('mousemove', this.move.bind(this), true);
    document.addEventListener('mouseup', this.end.bind(this), true);
  }

  move(evt) {
    console.log('resizable move', evt);
    if (this.draggable) {
      this.points[this.#activePointId].x = evt.offsetX - this.dragOffsetX;
      this.points[this.#activePointId].y = evt.offsetY - this.dragOffsetY;
      this.draw(this.#activePoint);
      this.resize();
    }
  }

  end(evt) {
    evt.preventDefault();
    this.draw(this.#activePoint);
    this.resize();
    document.removeEventListener('mousemove', this.move, true);
    document.removeEventListener('mouseup', this.end, true);

    this.draggable = false;
    this.dragOffsetX = this.dragOffsetY = null;
    this.#activePointId = null;
  }

  //#endregion
}
