import { Shape } from './shape.js';
import { Core } from './core.js';

export class Layer extends Core {
  __type = 'layer';
  defaultShapeConfig = null;
  layerId = '';
  #order = 0;

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

  get order() {
    return this.#order;
  }

  set order(o) {
    this.#order = o;
  }

  get shapes() {
    return this.items;
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
    const _shape = new Shape(
      shape?.type,
      this.coreId,
      this.layerId,
      { ...this.defaultShapeConfig, ...shape?.config },
      shape?.order || this.shapes.length
    );
    _shape.layer = this;
    return _shape;
  }

  kill() {
    this.editor.killChild(this, 'layerId');
  }
}
