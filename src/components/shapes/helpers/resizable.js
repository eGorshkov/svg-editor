import { ShapeCreator } from "./shape-creator.js";
import { CircleShape } from "../circle-shape.js";

export class Resizable {
  points = null;
  template = null;
  constructor(shapeTemplate, shapeConfig) {
    [this.template] = ShapeCreator("g", {
      width: shapeConfig.width,
      height: shapeConfig.height,
    });
    this.setPoints(shapeTemplate, shapeConfig);
    this.create(shapeTemplate);
  }

  setPoints(template, shapeConfig) {
    const coords = template.getBBox();
    coords.x = coords.x || shapeConfig.x;
    coords.y = coords.y || shapeConfig.y;

    this.points = {
      nw: { x: coords.x, y: coords.y, cursor: "nw-resize" },
      n: { x: coords.x + coords.width / 2, y: coords.y, cursor: "n-resize" },
      ne: { x: coords.x + coords.width, y: coords.y, cursor: "ne-resize" },
      w: { x: coords.x, y: coords.y + coords.height / 2, cursor: "w-resize" },
      e: {
        x: coords.x + coords.width,
        y: coords.y + coords.height / 2,
        cursor: "e-resize",
      },
      sw: { x: coords.x, y: coords.y + coords.height, cursor: "sw-resize" },
      s: {
        x: coords.x + coords.width / 2,
        y: coords.y + coords.height,
        cursor: "s-resize",
      },
      se: {
        x: coords.x + coords.width,
        y: coords.y + coords.height,
        cursor: "se-resize",
      },
    };
  }

  create(template) {
    Object.keys(this.points)
      .reduce(this.createPoint(this.points), [])
      .forEach((point) => this.template.appendChild(point));
  }

  createPoint(points) {
    return (acc, pointKey) => {
      const dragging = false,
        active = true,
        dragOffsetX = null,
        dragOffsetY = null;
      const [pointTemplate, config, draw] = CircleShape({
        width: 15,
        height: 15,
        ...points[pointKey],
      });
      pointTemplate.setAttribute("id", pointKey);
      draw(pointTemplate, config);
      this.setDraggable(pointTemplate);
      return [...acc, pointTemplate];
    };
  }

  hide() {
    Array.from(this.template.children).forEach(
      (point) => (point.style.visibility = "hidden")
    );
  }

  show(shapeTemplate, shapeConfig) {
    debugger;
    this.setPoints(shapeTemplate, shapeConfig);
    Array.from(this.template.children).forEach((point) => {
      point.setAttributeNS(null, "cx", this.points[point.id].x);
      point.setAttributeNS(null, "cy", this.points[point.id].y);
      point.style.visibility = "visible";
    });
  }

  //#region DRAG AND DROP

  draggable(value) {
    value ? this.setDraggable() : this.removeDraggable();
  }

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
    this.dragOffsetX = evt.offsetX - this.config.x;
    this.dragOffsetY = evt.offsetY - this.config.y;
    this.template.addEventListener("mousemove", (e) =>
      this.move(e, pointTemplate)
    );
  }

  move(evt, pointTemplate) {
    if (this.draging) {
      this.config.x = evt.offsetX - this.dragOffsetX;
      this.config.y = evt.offsetY - this.dragOffsetY;
      this.draw(this.template, this.config);
    }
  }

  end(evt) {
    this.draw(this.template, this.config);
    this.template.removeEventListener("mousemove", (e) => this.move(e, ctx));
    this.dragOffsetX = this.dragOffsetY = null;
    this.draging = false;
  }

  //#endregion
}
