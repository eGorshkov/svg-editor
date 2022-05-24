import Prototype from './prototype.js';
import { createTemplate } from '../helpers/shape-creator.js';
import compose from '../helpers/compose.js';
import between from '../helpers/between.js';

/**
 * @implements Base
 */
export class Core extends Prototype {
  __type = 'core';
  items = [];

  listener = {
    start: evt => {
      this.dragging = true;
      this.dragOffsetX = evt.offsetX;
      this.dragOffsetY = evt.offsetY;
      document.addEventListener('mousemove', this.listener.move, true);
      document.addEventListener('mouseup', this.listener.end, true);
    },
    move: evt => {
      console.log('layer move');
      evt.preventDefault();
      if (this.active && this.dragging) {
        this.template.style.cursor = 'grabbing';
        this.#replacePosition(evt);
        if (this.resizable) this.resizable.hide();
      }
    },
    end: evt => {
      document.removeEventListener('mousemove', this.listener.move, true);
      document.removeEventListener('mouseup', this.listener.end, true);
      if (this.resizable) this.resizable.show(this.template, this.coreConfig);

      this.dragging = false;
      this.dragOffsetX = this.dragOffsetY = null;
    }
  };

  #bindCreateChilds = this.#createChilds.bind(this);
  #bindSet = this.#set.bind(this);
  #bindSetToTemplate = this.#setToTemplate.bind(this);
  #bindWithParent = this.#withParent.bind(this);

  get load() {
    return compose(this.#bindCreateChilds, this.#bindSet, this.#bindSetToTemplate);
  }

  get #add() {
    return compose(this.#bindWithParent, this.#bindSet, this.#bindSetToTemplate);
  }

  #coreConfig = null;

  get coreConfig() {
    return this.#coreConfig;
  }

  get last() {
    return this.items[this.items.length - 1];
  }

  constructor(elementName) {
    super(createTemplate(elementName));
  }

  create(item) {}

  /**
   *
   * @param type { ShapesType }
   * @param config { IShapeConfig }
   */
  add(type, config = {}) {
    const item = this.create({ type, config });
    if (item.isLayer) item.add(type, config);
    this.#add(item);
  }

  get(values, key = 'uniqueId') {
    values = Array.isArray(values) ? values : [values];
    const [value, ...other] = values;
    const find = this.items.find(x => x[key] === value);

    if (!find) {
      console.error('Not find', value, 'by', key, 'in items');
      return null;
    }

    return other.length && find.isLayer ? find.get(other, key) : find;
  }

  find(value, key) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.isShape && item[key] === value) return item;
      else if (item.isLayer) {
        const child = item.find(value, key);
        if (child) return child;
      }
    }
    return null;
  }

  replaceOrder(source, target) {
    if (!Number.isInteger(source) || !Number.isInteger(target) || source === target || target >= this.items.length)
      return;

    const SOURCE_LAYER = this.get(source, 'order');
    const IS_SOURCE_MORE_THEN_TARGET = SOURCE_LAYER.order > target;
    const [MIN, MAX] = [SOURCE_LAYER.order, target].sort();

    for (let i = 0; i < this.items.length; i++) {
      const ITEM = this.items[i];
      if (between(ITEM.order, MIN, MAX)) ITEM.order += IS_SOURCE_MORE_THEN_TARGET ? 1 : -1;
    }

    SOURCE_LAYER.order = target;
    const TARGET_LAYER = this.get(target + 1, 'order');

    this.template.removeChild(SOURCE_LAYER.template);

    TARGET_LAYER
      ? this.template.insertBefore(SOURCE_LAYER.template, TARGET_LAYER.template)
      : this.template.appendChild(SOURCE_LAYER.template);
  }

  reorder() {
    this.items.forEach((x, i) => (x.order = i));
  }

  killChild(child, byKey = 'uniqueId') {
    if (!child || !byKey) return;

    this.template.removeChild(child.template);
    this.items = this.items.filter(x => x[byKey] !== child[byKey]);
  }

  killAll() {
    this.items.forEach(x => (x.isShape ? x.kill() : x.killAll()));
    this.kill();
  }

  activate() {
    super.activate();
    this.#coreConfig = this.getCoreConfig();
    this.setResizable(null, this.coreConfig);
    this.setCoreDraggable();
  }

  deactivate() {
    super.deactivate();
    this.removeResizable();
    this.removeCoreDraggable();
  }

  getCoreConfig() {
    const config = {
      x: Infinity,
      y: Infinity,
      width: -Infinity,
      height: -Infinity
    };

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const itemConfig = item.isShape ? item.config : item.getCoreConfig();
      config.x = Math.min(config.x, itemConfig.x);
      config.y = Math.min(config.y, itemConfig.y);
      config.width = Math.max(config.width, itemConfig.width);
      config.height = Math.max(config.height, itemConfig.height);
    }

    return config;
  }

  setCoreDraggable(cb = this.listener.start) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      item.isLayer ? item.setCoreDraggable(cb) : item.setDraggable(cb);
    }
  }

  removeCoreDraggable(cb = this.listener.start) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      item.isLayer ? item.removeCoreDraggable(cb) : item.removeDraggable(cb);
    }
  }

  changeChildPosition(change) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.isShape) {
        item.config.x += change.x;
        item.config.y += change.y;
        item.draw(item.template, item.config);
      } else {
        item.changeChildPosition(change);
      }
    }
  }

  #replacePosition(evt) {
    this.template.style.cursor = 'grabbing';

    const change = {};
    change.x = evt.offsetX - this.dragOffsetX;
    change.y = evt.offsetY - this.dragOffsetY;

    this.dragOffsetX = evt.offsetX;
    this.dragOffsetY = evt.offsetY;

    this.changeChildPosition(change);
    if (this.resizable) this.resizable.hide();
  }

  #createChilds(_items) {
    return _items.map(x => {
      const created = this.create(x);
      created.uniqueId = x.uniqueId || created.uniqueId;
      created.active = x.active || created.active;
      return this.#withParent(created);
    });
  }

  #withParent(child) {
    child.parent = this;
    return child;
  }

  #set(_items) {
    _items = (Array.isArray(_items) ? _items : [_items]).filter(Boolean);
    if (!_items?.length) return [];

    this.items = [...this.items, ..._items];
    return this.items;
  }

  #setToTemplate(_items) {
    _items.forEach(item => this.template.appendChild(item.template));
  }
}
