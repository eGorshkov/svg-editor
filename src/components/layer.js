import { Shape } from './shape.js';

export class Layer {
  #SHAPE_ID = 0;
  layerId = null;
  shapes = [];
  template = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  defaultShapeConfig = null;
  constructor(layerId, shapes, defaultShapeConfig) {
    this.layerId = `layer-${layerId}`;
    this.defaultShapeConfig = defaultShapeConfig;
    this.template.setAttribute('id', this.layerId);

    if (shapes) {
      this.setByConfig(shapes);
    }
  }

  add(toolType) {
    const shape = this.createShape(toolType);
    this.shapes.push(shape);
    this.template.appendChild(shape.template);
    return this;
  }

  createShape(toolType, config) {
    this.#SHAPE_ID++;
    return new Shape(toolType, this.#SHAPE_ID, this.layerId, { ...this.defaultShapeConfig, ...config });
  }

  setByConfig(shapes) {
    this.shapes = shapes.map(shape => {
      shape = this.createShape(shape.type, shape.config);
      this.template.appendChild(shape.template);
      return shape;
    });
  }
}
