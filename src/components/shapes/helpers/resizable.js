import { ShapeCreator } from "./shape-creator.js";
import { circleDraw, CircleShape } from "../circle-shape.js";
import { squareDraw, SquareShape } from "../square-shape.js";

export class Resizable {
  points = null;
  template = null;
  dragOffsetX = null;
  dragOffsetY = null;

  #defaultPointTemplate = {
    width: 15,
    height: 15,
    fill: 'rgb(41, 182, 242)',
    stroke: 'rgb(255, 255, 255)',
  }

  _resize = (width, height) => {};

  constructor(shapeTemplate, shapeConfig) {
    [this.template] = ShapeCreator("g", {
      width: shapeConfig.width,
      height: shapeConfig.height,
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
    pointTemplate.id === 'overlay'
     ? squareDraw(pointTemplate, this.points[pointTemplate.id])
     : circleDraw(pointTemplate, this.points[pointTemplate.id])
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
      nw: { ...this.#defaultPointTemplate, x: coords.x, y: coords.y, cursor: "nw-resize" },
      n: {...this.#defaultPointTemplate,  x: coords.x + coords.width / 2, y: coords.y, cursor: "n-resize" },
      ne: { ...this.#defaultPointTemplate, x: coords.x + coords.width, y: coords.y, cursor: "ne-resize" },
      w: { ...this.#defaultPointTemplate, x: coords.x, y: coords.y + coords.height / 2, cursor: "w-resize" },
      e: {
        ...this.#defaultPointTemplate, 
        x: coords.x + coords.width,
        y: coords.y + coords.height / 2,
        cursor: "e-resize",
      },
      sw: { ...this.#defaultPointTemplate, x: coords.x, y: coords.y + coords.height, cursor: "sw-resize" },
      s: {
        ...this.#defaultPointTemplate, 
        x: coords.x + coords.width / 2,
        y: coords.y + coords.height,
        cursor: "s-resize",
      },
      se: {
        ...this.#defaultPointTemplate, 
        x: coords.x + coords.width,
        y: coords.y + coords.height,
        cursor: "se-resize",
      },
    };
  }

  create() {
    Object.keys(this.points)
      .reduce(this.createPoint(this.points), [])
      .forEach((point) => this.template.appendChild(point));
  }

  createOverlay() {
      const [overlayTemplate, config, draw] = SquareShape(this.points.overlay);
      overlayTemplate.setAttribute("id", 'overlay');
      overlayTemplate.setAttributeNS(null, 'stroke-dasharray', '3 3');
      draw(overlayTemplate, config);
      this.template.appendChild(overlayTemplate);
  }

  createPoint(points) {
    return (acc, pointKey) => {
      if(pointKey === 'overlay') {
        return acc;
      }

      let pointTemplate, draw = null;

      [pointTemplate, points[pointKey], draw] = CircleShape(points[pointKey]);
      pointTemplate.setAttribute("id", pointKey);
      points[pointKey].draw = () => draw(pointTemplate, points[pointKey]);
      points[pointKey].draw();
      this.setDraggable(pointTemplate);
      return [...acc, pointTemplate];
    };
  }

  hide(exception) {
    Array.from(this.template.children).forEach(
      (point) => (point.style.visibility = point.id === exception ? 'visible' : 'hidden')
    );
  }

  show(shapeTemplate, shapeConfig) {
    debugger;
    this.setPoints(this.getShapeCoords(shapeTemplate, shapeConfig));
    Array.from(this.template.children).forEach((point) => {
      point.setAttributeNS(null, point.tagName === 'circle' ? "cx" : 'x', this.points[point.id].x);
      point.setAttributeNS(null, point.tagName === 'circle' ? "cy" : 'y', this.points[point.id].y);
      point.style.visibility = "visible";
    });
  }

  remove() {
    Array.from(this.template).forEach(point => this.removeDraggable(point));
    this.template = null;
    this.points = null;
  }

  //#region DRAG AND DROP

  setDraggable(pointTemplate) {
    pointTemplate.addEventListener("mousedown", (e) =>
      this.start(e, pointTemplate)
    );
    pointTemplate.addEventListener("mouseup", (e) =>
      this.end(e, pointTemplate)
    );
  }

  removeDraggable(pointTemplate) {
    pointTemplate.removeEventListener("mousedown", (e) =>
      this.start(e, pointTemplate)
    );
    pointTemplate.removeEventListener("mouseup", (e) =>
      this.end(e, pointTemplate)
    );
  }

  start(evt, pointTemplate) {
    this.dragOffsetX = evt.offsetX - this.points[pointTemplate.id].x;
    this.dragOffsetY = evt.offsetY - this.points[pointTemplate.id].y;
    pointTemplate.addEventListener("mousemove", (e) =>
      this.move(e, pointTemplate)
    );
    this.hide(pointTemplate.id);
  }

  move(evt, pointTemplate) {
      this.points[pointTemplate.id].x = evt.offsetX - this.dragOffsetX;
      this.points[pointTemplate.id].y = evt.offsetY - this.dragOffsetY;
      this.draw(pointTemplate);
      this.resize();
  }

  end(evt, pointTemplate) {
    pointTemplate.removeEventListener("mousemove", (e) => this.move(e, pointTemplate));
    this.dragOffsetX = this.dragOffsetY = null;
    this.draw(pointTemplate);
    this.resize();
  }

  //#endregion
}
