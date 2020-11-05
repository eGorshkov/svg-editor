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
    return compose(this.set.bind(this), this.setToTemplate.bind(this));
  }

  constructor(elementName, items) {
    this.template = createTemplate(elementName);
    if (items?.length) {
      this.#load(items.map(item => this.create(item)));
    }
  }

  updateCoreId() {
    this.#coreId++;
  }

  create(item) {}

  /**
   *
   * @param type { ShapesType }
   */
  add(type) {
    const item = this.create({ type });
    if (item.add) item.add(type);
    this.items.push(item);
    this.template.appendChild(item.template);
  }

  set(_items) {
    this.items = [...this.items, ..._items];
    return this.items;
  }

  setToTemplate(_items) {
    _items.forEach(item => this.template.appendChild(item.template));
  }
}
