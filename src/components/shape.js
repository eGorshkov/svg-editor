import { SHAPES } from './shapes/index.js';
import { Resizable } from './helpers/resizable.js';

export class Shape {
  shapeId = 0;
  template = null;
  active = false;
  dragging = false;
  config = null;
  dragOffsetX = null;
  dragOffsetY = null;
  resizable = null;
  type = null;

  constructor(toolType, shapeId, config) {
    this.type = toolType;
    this.shapeId = `${this.type}-shape-${shapeId}`;
    this.config = config;

    [this.template, this.config, this.draw] = this.#create(this.type, config);
    this.template.setAttribute('id', this.shapeId);
    this.draw(this.template, this.config);
    this.setListeners();
  }

  setListeners() {
    this.template.addEventListener('dblclick', () => this.setActive(true));
  }

  draw() {}

  setActive(value) {
    this.active = value;
    this.draggable(value);
    this.setResizable(value);
  }

  //#region DRAG AND DROP

  draggable(value) {
    value ? this.setDraggable() : this.removeDraggable();
  }

  setDraggable() {
    this.template.style.cursor = 'grab';
    this.template.addEventListener('mousedown', e => this.start(e));
    this.template.addEventListener('mouseup', e => this.end(e));
  }

  removeDraggable() {
    this.template.style.cursor = 'default';
    this.template.removeEventListener('mousedown', e => this.start(e));
    this.template.removeEventListener('mouseup', e => this.end(e));
  }

  start(evt) {
    this.dragging = true;
    this.dragOffsetX = evt.offsetX - this.config.x;
    this.dragOffsetY = evt.offsetY - this.config.y;
    this.template.addEventListener('mousemove', e => this.move(e));
  }

  move(evt) {
    if (this.active && this.dragging) {
      this.template.style.cursor = 'grabbing';
      this.config.x = evt.offsetX - this.dragOffsetX;
      this.config.y = evt.offsetY - this.dragOffsetY;
      this.draw(this.template, this.config);
      if (this.resizable) {
        this.resizable.hide();
      }
    }
  }

  end(evt) {
    this.draw(this.template, this.config);
    this.template.removeEventListener('mousemove', e => this.move(e, ctx));
    this.dragOffsetX = this.dragOffsetY = null;
    this.dragging = false;
    if (this.resizable) {
      this.resizable.show(this.template, this.config);
    }
  }

  //#endregion

  setResizable(value) {
    if (this.resizable) {
      this.resizable.remove();
    }

    this.resizable = value ? new Resizable(this.template, this.config) : null;

    if (this.resizable !== null) {
      this.template.parentNode.appendChild(this.resizable.template);
      this.resizable._resize = (width, height) => {
        debugger;
        this.config.width = width;
        this.config.height = height;
        this.draw(this.template, this.config);
        this.resizable.show(this.template, this.config);
      };
    }
  }

  #create(toolType, config) {
    if (!SHAPES[toolType]) {
      return SHAPES.square(config);
    }
    return SHAPES[toolType](config);
  }
}
