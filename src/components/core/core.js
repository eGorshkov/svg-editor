import Prototype from './prototype.js';
import { createTemplate } from '../helpers/shape-creator.js';
import { compose } from '../helpers/compose.js';
import between from '../helpers/between.js';

export class Core extends Prototype {
  __type = 'core';
  items = [];
  #coreId = 0;
  get coreId() {
    return this.#coreId;
  }

  get load() {
    return compose(this.#createChild.bind(this), this.#setParent.bind(this), this.#set.bind(this), this.#setToTemplate.bind(this));
  }

  constructor(elementName) {
    super(createTemplate(elementName));
  }

  updateCoreId() {
    this.#coreId++;
  }

  create(item) {}

  killChild(child, byKey = 'uniqueId') {
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
    item.parent = this;
    if (item.add) item.add(type, config);
    this.items.push(item);
    this.template.appendChild(item.template);
  }

  get(values, key = 'uniqueId') {
    values = Array.isArray(values) ? values : [values];
    const [value, ...other] = values;
    const find = this.items.find(x => x[key] === value);
    
    if(!find) {
      console.error('Not find', value, 'by', key, 'in items');
      return null;
    }

    return other.length && find.get ? find.get(other, key) : find;
  }

  replaceOrder(source, target) {
    if (!Number.isInteger(source) || !Number.isInteger(target) || source === target || target >= this.items.length) return;

    const SOURCE_LAYER = this.get(source, 'order');
    const IS_SOURCE_MORE_THEN_TARGET = SOURCE_LAYER.order > target
    const [MIN, MAX] = [SOURCE_LAYER.order, target].sort();


    for (let i=0; i<this.items.length; i++) {
      const ITEM = this.items[i];
      if(between(ITEM.order, MIN, MAX)) ITEM.order = ITEM.order + (IS_SOURCE_MORE_THEN_TARGET ? 1 : -1);
    }

    SOURCE_LAYER.order = target;
    const TARGET_LAYER = this.get(target + 1, 'order');

    this.template.removeChild(SOURCE_LAYER.template);

    TARGET_LAYER
      ? this.template.insertBefore(SOURCE_LAYER.template, TARGET_LAYER.template)
      : this.template.appendChild(SOURCE_LAYER.template);
      
  }

  #createChild(_items) {
    return _items.map(x => {
      const created = this.create(x);
      created.uniqueId = x.uniqueId || created.uniqueId;
      return created;
    });
  }

  #setParent(_items) {
    for (let i = 0; i < _items.length; i++) {
      const element = _items[i];
      element.parent = this;
    }
    return _items;
  }

  #set(_items) {
    this.items = [...this.items, ..._items];
    return this.items;
  }

  #setToTemplate(_items) {
    _items.forEach(item => this.template.appendChild(item.template));
  }
}
