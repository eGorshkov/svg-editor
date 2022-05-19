import { Resizable } from '../helpers/resizable/resizable.js';

export default class Prototype {
  __type = 'prototype';
  uniqueId = Math.ceil(Math.random() * 10 ** 10).toString();

  /**
   * Флаг того, что фигуру можно переносить
   * @type {boolean}
   */
  dragging = false;
  /**
   *
   * @type {number}
   */
  dragOffsetX = 0;
  /**
   *
   * @type {number}
   */
  dragOffsetY = 0;

  #order = null;

  get order() {
    return this.#order;
  }

  set order(o) {
    this.#order = o;
  }

  #parent = null;

  get parent() {
    return this.#parent;
  }

  set parent(p) {
    this.#parent = p;
  }

  get fullOrder() {
    return this.orders.join('-');
  }

  get level() {
    return this.orders.length;
  }

  get orders() {
    return this.#getOrders();
  }

  #active = false;

  get active() {
    return this.#active;
  }

  set active(a) {
    this.#active = a;
  }

  get isEditor() {
    return this.__type === 'editor';
  }

  get isLayer() {
    return this.__type === 'layer';
  }

  get isShape() {
    return this.__type === 'shape';
  }

  /**
   *
   * @type {SVGElement}
   */
  template = null;

  constructor(template) {
    this.template = template;
    this.template?.setAttribute('id', this.uniqueId);
  }

  #getOrders() {
    let parent = this.parent;
    let orders = [this.order];

    while (!parent.isEditor) {
      orders = [parent.order, ...orders];
      parent = parent.parent;
    }

    return orders;
  }

  activate(settingsConfig) {
    this.active = true;
    this.setSettings(settingsConfig);
    globalThis.ACTIVE_ITEM_SUBJECT.next(this);
  }

  deactivate() {
    this.active = false;
    this.dragging = false;
    globalThis.ACTIVE_ITEM_SUBJECT.next();
  }

  setSettings(config) {
    globalThis.SETTINGS_TOOL_SUBJECT.next({ item: this, config });
  }

  setDraggable(cb = this.listener.start) {
    this.removeDraggable(cb);

    this.template.style.cursor = 'grab';
    this.template.addEventListener('mousedown', cb, true);
  }

  removeDraggable(cb = this.listener.start) {
    this.template.style.cursor = 'default';
    this.template.removeEventListener('mousedown', cb, true);
  }

  setResizable(subscribeFn, config = this.config) {
    this.removeResizable();

    this.resizable = this.active ? new Resizable(this.template, config) : null;
    if (this.resizable !== null) {
      this.template.viewportElement.appendChild(this.resizable.template);
      subscribeFn && this.resizable._resize.subscribe(subscribeFn.bind(this));
    }
  }

  removeResizable() {
    if (this.resizable) {
      this.resizable.remove();
    }
    this.resizable = null;
  }

  kill() {
    this.parent.killChild(this);
    this.parent.reorder();
  }
}