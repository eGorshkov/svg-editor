import { Shape } from './shape.js';
import { Core } from './core.js';

export class Layer extends Core {
  defaultShapeConfig = null;
  layerId = '';
  #order = 0;

  get order() {
    return this.#order;
  }

  constructor(layerId, shapes, defaultShapeConfig, order) {
    super('g', shapes);

    this.#order = order;
    this.layerId = `layer-${layerId}`;
    this.defaultShapeConfig = defaultShapeConfig;
    this.template.setAttribute('id', this.layerId);
  }

  /**
   *
   * @param shape { IShape }
   * @returns {Shape}
   */
  create(shape) {
    this.updateCoreId();
    return new Shape(shape?.type, this.coreId, this.layerId, { ...this.defaultShapeConfig, ...shape?.config });
  }

  updateOrder(newValue) {
    this.#order = newValue;
  }
}
