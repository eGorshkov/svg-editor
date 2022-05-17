export default class Prototype {
  __type = 'prototype';
  uniqueId = Math.ceil(Math.random() * 10 ** 10).toString();

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
}