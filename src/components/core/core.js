import { createTemplate } from '../helpers/shape-creator.js';
import { compose } from '../helpers/compose.js';
import between from '../helpers/between.js';

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

  

  replaceOrder(source, target) {
    if (!Number.isInteger(source) || !Number.isInteger(target) || source === target) return;

    const sourceLayer = this.items.find(x => x.order === source);
    const targetLayer = this.items.find(x => x.order === target);

    if (!sourceLayer || !targetLayer) return;

    const IS_POSITIVE = sourceLayer.order > target
    const MIN = Math.min(sourceLayer.order, target);
    const MAX = Math.max(sourceLayer.order, target);
    for (let i=0; i<this.items.length; i++) {
      if(between(this.items[i].order, MIN, MAX)) {
        this.items[i].updateOrder(
          this.items[i].order + (IS_POSITIVE ? 1 : -1)
        )
      }
    }
    sourceLayer.updateOrder(target);

    this.template.removeChild(sourceLayer.template);

    sourceLayer.order === this.items.length - 1
      ? this.template.appendChild(sourceLayer.template)
      : this.template.insertBefore(sourceLayer.template, targetLayer.template)
  }
}
