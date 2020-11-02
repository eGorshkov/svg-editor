import { createTemplate } from '../helpers/shape-creator.js';
import { compose } from '../helpers/compose.js';

export class Core {
  /**
   *
   * @type {SVGElement}
   */
  template = null;
  items = [];
  #coreId = 0;
  get coreId() {
    return this.#coreId;
  }

  get #load() {
    return compose(this.setToTemplate.bind(this), this.set.bind(this));
  }

  constructor(elementName, items) {
    this.template = createTemplate(elementName);
    if (items?.length) {
      this.#coreId = items.length;
      this.#load(items.map(this.create.bind(this)));
    }
  }

  updateCoreId() {
    this.#coreId++;
  }

  /**
   * @type { ILayer | IShape }
   * @returns Base
   */
  create(item) {}

  /**
   *
   * @param type { ShapesType }
   */
  add(type) {
    const item = this.create({ type });
    if (item.add) item.add(type);
    this.setToTemplate(item);
    this.set(item);
  }

  set(newItems) {
    newItems = Array.isArray(newItems) ? newItems : [newItems];
    if (newItems.length) {
      newItems.forEach(this.items.push.bind(this));
    }
    return this.items;
  }

  setToTemplate(newItems) {
    newItems = Array.isArray(newItems) ? newItems : [newItems];
    if (newItems.length) {
      newItems.forEach(item => this.template.appendChild(item.template));
    }
    return this.items;
  }
}
