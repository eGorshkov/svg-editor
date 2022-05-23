import { Shape } from './shape.js';
import { Core } from './core.js';

/**
 * @implements {ILayer}
 */
export class Layer extends Core {
  __type = 'layer';
  defaultShapeConfig = null;

  constructor(shapes, defaultShapeConfig, order) {
    super('g');

    this.order = order;
    this.defaultShapeConfig = defaultShapeConfig;

    if (shapes?.length) this.load(shapes);
  }

  /**
   *
   * @param item { IShape | ILayer }
   * @returns {Shape | Layer}
   */
  create(item) {
    if ('items' in item) {
      return new Layer(
        item?.items,
        {
          x: this.template.clientWidth / 2,
          y: this.template.clientHeight / 2
        },
        item?.order || this.items.length
      );
    }

    return new Shape(item, { ...this.defaultShapeConfig, ...item?.config }, item?.order || this.items.length);
  }
}
