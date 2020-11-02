import { Shape } from './shape.js';
import { Core } from './core.js';

export class Layer extends Core {
  /**
   *
   * @type {IShape[]}
   */
  items = [];
  defaultShapeConfig = null;

  constructor(layerId, shapes, defaultShapeConfig) {
    super('g', shapes);
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
}
