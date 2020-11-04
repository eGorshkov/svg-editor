import { ShapeCreator } from '../shape-creator.js';
import { circleDraw, CircleShape } from '../../shapes/circle-shape.js';
import { squareDraw, SquareShape } from '../../shapes/square-shape.js';
import { Subject } from '../subject.js';
import { ResizablePoints } from './resizable-points.js';

export class Resizable {
  /**
   *
   * @type {IResizablePoints}
   */
  points = null;
  /**
   *
   * @type {SVGGElement}
   */
  template = null;
  dragOffsetX = null;
  dragOffsetY = null;
  draggable = false;

  #activePointId = null;
  get #activePoint() {
    if (this.template === null) {
      return null;
    }
    return Array.from(this.template.children).find(x => this.#getPointIdentificator(x) === this.#activePointId);
  }

  _resize = new Subject(null, false);

  listener = {
    start: evt => {
      evt.preventDefault();
      this.draggable = true;
      this.#activePointId = this.#getPointIdentificator(evt.target);
      this.dragOffsetX = evt.offsetX - this.points[this.#activePointId].x;
      this.dragOffsetY = evt.offsetY - this.points[this.#activePointId].y;
      this.hide(this.#activePointId);
      document.addEventListener('mousemove', this.listener.move);
      document.addEventListener('mouseup', this.listener.end);
    },
    move: evt => {
      console.log('resize move');
      if (this.draggable) {
        this.points[this.#activePointId].x = evt.offsetX - this.dragOffsetX;
        this.points[this.#activePointId].y = evt.offsetY - this.dragOffsetY;
        this.draw(this.#activePoint);
        this._resize.next([this.#activePointId, evt]);
      }
    },
    end: evt => {
      this.draggable = false;

      this.draw(this.#activePoint);
      this._resize.next([this.#activePointId, evt]);
      document.removeEventListener('mousemove', this.listener.move);
      document.removeEventListener('mouseup', this.listener.end);
      this.dragOffsetX = this.dragOffsetY = null;
      this.#activePointId = null;
    }
  };

  constructor(shapeTemplate, shapeConfig) {
    [this.template] = ShapeCreator('g', { width: shapeConfig.width, height: shapeConfig.height });
    this.setPoints(this.getShapeCoords(shapeTemplate, shapeConfig));
    this.createOverlay();
    this.create();
  }

  #getPointIdentificator(template) {
    return template.ariaLabel;
  }

  draw(pointTemplate) {
    if (pointTemplate === null) {
      return;
    }
    const id = this.#getPointIdentificator(pointTemplate);
    id === 'overlay' ? squareDraw(pointTemplate, this.points[id]) : circleDraw(pointTemplate, this.points[id]);
  }

  getShapeCoords(template, shapeConfig) {
    const coords = template.getBBox();
    coords.x = coords.x || shapeConfig.x;
    coords.y = coords.y || shapeConfig.y;
    return coords;
  }

  setPoints(coords) {
    this.points = new ResizablePoints(coords);
  }

  create() {
    this.points.circlesNames
      .reduce(this.createPoint(this.points), [])
      .forEach(point => this.template.appendChild(point));
  }

  createOverlay() {
    const [overlayTemplate, config, draw] = SquareShape(this.points.overlay);
    overlayTemplate.setAttribute('aria-label', 'overlay');
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
      pointTemplate.setAttribute('aria-label', pointKey);
      draw(pointTemplate, config);
      this.setDraggable(pointTemplate);
      return [...acc, pointTemplate];
    };
  }

  hide(exception) {
    Array.from(this.template.children).forEach(
      point => (point.style.visibility = this.#getPointIdentificator(point) === exception ? 'visible' : 'hidden')
    );
  }

  show(shapeTemplate, shapeConfig) {
    if (this.draggable) {
      return;
    }
    this.setPoints(this.getShapeCoords(shapeTemplate, shapeConfig));
    Array.from(this.template.children).forEach(point => {
      this.draw(point);
      point.style.visibility = 'visible';
    });
  }

  remove() {
    Array.from(this.template).forEach(point => this.removeDraggable(point));
    this.template.remove();
    this.template = null;
    this.points = null;
  }

  setDraggable(pointTemplate) {
    pointTemplate.addEventListener('mousedown', this.listener.start, true);
  }

  removeDraggable(pointTemplate) {
    pointTemplate.removeEventListener('mousedown', this.listener.start, true);
  }
}
