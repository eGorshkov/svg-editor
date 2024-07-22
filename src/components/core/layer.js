import { Shape } from './shape.js';
import { Core } from './core.js';

/**
 * @implements {ILayer}
 */
export class Layer extends Core {
  __type = 'layer';
  defaultShapeConfig = null;

  constructor(config, defaultShapeConfig) {
    super('g');

    this.name = config.name ?? null;
    this.order = config.order;
    this.uniqueId = config.uniqueId ?? this.uniqueId;
    this.defaultShapeConfig = defaultShapeConfig;

    if (config.items?.length) this.load(config.items);
  }

  /**
   *
   * @param item { IShape | ILayer }
   * @returns {Shape | Layer}
   */
  create(item) {
    if ('items' in item) {
      return new Layer(item, {
        x: this.template.clientWidth / 2,
        y: this.template.clientHeight / 2
      });
    }

    return new Shape(item, { ...this.defaultShapeConfig, ...item?.config }, item?.order || this.items.length);
  }

  getConfiguration() {
    return {
      order: this.order,
      name: this.name,
      items: [...this.items.map(shape => shape.getConfiguration())]
    };
  }
}
