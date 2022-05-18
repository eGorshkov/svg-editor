import { Shape } from './shape.js';
import { Core } from './core.js';

export class Layer extends Core {
  __type = 'layer';
  defaultShapeConfig = null;

  /**
   * Ссылка на редактор
   * @param {IEditor} editor
   */
  #editor = null;

  get editor() {
    return this.#editor;
  }

  set editor(e) {
    return (this.#editor = e);
  }

  get shapes() {
    return this.items;
  }

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
    this.updateCoreId();

    if (this.#isShape(item)) {
      return new Shape(item, { ...this.defaultShapeConfig, ...item?.config }, item?.order || this.items.length);
    }

    return new Layer(
      item?.items,
      {
        x: this.template.clientWidth / 2,
        y: this.template.clientHeight / 2
      },
      item?.order || this.items.length
    );
  }

  #isShape(item) {
    return 'config' in item;
  }
}
