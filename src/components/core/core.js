import { createTemplate } from '../helpers/shape-creator.js';
import { compose } from '../helpers/compose.js';
import between from '../helpers/between.js';

export class Core {
  __type = 'core';
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

  killChild(child, byKey) {
    if(!child || !byKey) return;

    this.template.removeChild(child.template);
    this.items = this.items.filter(x => x[byKey] !== child[byKey]);
  }

  /**
   *
   * @param type { ShapesType }
   * @param config { * }
   */
  add(type, config = {}) {
    const item = this.create({ type, config });
    if (item.add) item.add(type, config);
    this.items.push(item);
    this.template.appendChild(item.template);
  }

  get(values, key) {
    values = Array.isArray(values) ? values : [values];
    const [value, ...other] = values;
    const find = this.items.find(x => x[key] === value);
    
    if(!find) {
      console.error('Not find', value, 'by', key, 'in items');
      return null;
    }

    return other.length && find.get ? find.get(other, key) : find;
  }

  set(_items) {
    this.items = [...this.items, ..._items];
    return this.items;
  }

  setToTemplate(_items) {
    _items.forEach(item => this.template.appendChild(item.template));
  }

  

  replaceOrder(source, target) {
    if (!Number.isInteger(source) || !Number.isInteger(target) || source === target || target >= this.items.length) return;

    const sourceLayer = this.items.find(x => x.order === source);

    const IS_POSITIVE = sourceLayer.order > target
    const MIN = Math.min(sourceLayer.order, target);
    const MAX = Math.max(sourceLayer.order, target);
    for (let i=0; i<this.items.length; i++) {
      const ITEM = this.items[i];
      if(between(ITEM.order, MIN, MAX)) {
        ITEM.order = ITEM.order + (IS_POSITIVE ? 1 : -1)
      }
    }
    sourceLayer.order = target;

    this.template.removeChild(sourceLayer.template);

    const targetLayer = this.items.find(x => x.order === target + 1);
    targetLayer
      ? this.template.insertBefore(sourceLayer.template, targetLayer.template)
      : this.template.appendChild(sourceLayer.template);
      
  }
}
