import { Resizable } from '../helpers/resizable/resizable.js';

/**
 * Базовый прототип для всех объектов редактора.
 * @implements {IPrototype}
 */
export default class Prototype {
  /**
   * Тип объекта (prototype, shape, layer, editor).
   * @type {string}
   */
  __type = 'prototype';
  /**
   * Уникальный идентификатор объекта.
   * @type {string}
   */
  uniqueId = Math.ceil(Math.random() * 10 ** 10).toString();
  /**
   * Имя объекта (опционально).
   * @type {string|null}
   */
  name = null;
  /**
   * Флаг: можно ли переносить объект.
   * @type {boolean}
   */
  dragging = false;
  /**
   * Смещение по X при drag&drop.
   * @type {number}
   */
  dragOffsetX = 0;
  /**
   * Смещение по Y при drag&drop.
   * @type {number}
   */
  dragOffsetY = 0;
  /**
   * Объект слушателей для drag&drop.
   * @type {{start: Function, move: Function, end: Function}}
   */
  listener = {
    start: () => {},
    move: () => {},
    end: () => {}
  };
  /**
   * Конфигурация объекта (фигуры/слоя).
   * @type {Object|null}
   */
  config = null;
  /**
   * Экземпляр Resizable для изменения размера.
   * @type {Resizable|null}
   */
  resizable = null;
  /**
   * Приватное поле: порядок объекта в родителе.
   * @type {number|null}
   * @private
   */
  #order = null;
  /**
   * Геттер: порядок объекта в родителе.
   * @returns {number|null}
   */
  get order() {
    return this.#order;
  }
  /**
   * Сеттер: устанавливает порядок объекта в родителе.
   * @param {number} o Новый порядок
   */
  set order(o) {
    this.#order = o;
  }
  /**
   * Приватное поле: родительский объект.
   * @type {Prototype|null}
   * @private
   */
  #parent = null;
  /**
   * Геттер: возвращает родителя.
   * @returns {Prototype|null}
   */
  get parent() {
    return this.#parent;
  }
  /**
   * Сеттер: устанавливает родителя.
   * @param {Prototype} p Родитель
   */
  set parent(p) {
    this.#parent = p;
  }
  /**
   * Геттер: полный путь порядка (например, '0-1-2').
   * @returns {string}
   */
  get fullOrder() {
    return this.orders.join('-');
  }
  /**
   * Геттер: уровень вложенности объекта.
   * @returns {number}
   */
  get level() {
    return this.orders.length;
  }
  /**
   * Геттер: массив порядков от корня до текущего объекта.
   * @returns {Array}
   */
  get orders() {
    return this.getFullPath();
  }
  /**
   * Приватное поле: активен ли объект.
   * @type {boolean}
   * @private
   */
  #active = false;
  /**
   * Геттер: активен ли объект.
   * @returns {boolean}
   */
  get active() {
    return this.#active;
  }
  /**
   * Сеттер: устанавливает активность объекта.
   * @param {boolean} a Активен ли
   */
  set active(a) {
    this.#active = a;
  }
  /**
   * Геттер: является ли объект редактором.
   * @returns {boolean}
   */
  get isEditor() {
    return this.__type === 'editor';
  }
  /**
   * Геттер: является ли объект слоем.
   * @returns {boolean}
   */
  get isLayer() {
    return this.__type === 'layer';
  }
  /**
   * Геттер: является ли объект фигурой.
   * @returns {boolean}
   */
  get isShape() {
    return this.__type === 'shape';
  }
  /**
   * SVG-элемент, связанный с объектом.
   * @type {SVGElement|null}
   */
  template = null;
  /**
   * Конструктор Prototype.
   * @param {SVGElement|null} template SVG-элемент
   */
  constructor(template) {
    this.template = template;
    this.template?.setAttribute('id', this.uniqueId);
  }
  /**
   * Активирует объект (делает активным, вызывает настройки).
   * @param {Array|undefined} settingsConfig Конфиг настроек
   */
  activate(settingsConfig) {
    this.active = true;
    this.setSettings(settingsConfig);
    globalThis.ACTIVE_ITEM_SUBJECT.next(this);
  }
  /**
   * Деактивирует объект (делает неактивным, сбрасывает drag&drop).
   */
  deactivate() {
    this.active = false;
    this.dragging = false;
    globalThis.ACTIVE_ITEM_SUBJECT.next();
  }
  /**
   * Устанавливает настройки для объекта.
   * @param {Array|null} config Конфиг настроек
   */
  setSettings(config) {
    globalThis.SETTINGS_TOOL_SUBJECT.next({ item: this, config });
  }
  /**
   * Удаляет настройки объекта.
   */
  removeSettings() {
    globalThis.SETTINGS_TOOL_SUBJECT.next();
  }
  /**
   * Делает объект перетаскиваемым.
   * @param {Function} [cb=this.listener.start] Колбэк для drag
   */
  setDraggable(cb = this.listener.start) {
    this.removeDraggable(cb);
    this.template.style.cursor = 'grab';
    this.template.addEventListener('mousedown', cb, true);
  }
  /**
   * Удаляет drag&drop у объекта.
   * @param {Function} [cb=this.listener.start] Колбэк для drag
   */
  removeDraggable(cb = this.listener.start) {
    this.template.style.cursor = 'default';
    this.template.removeEventListener('mousedown', cb, true);
  }
  /**
   * Делает объект изменяемым по размеру (Resizable).
   * @param {Function|null} subscribeFn Колбэк для ресайза
   * @param {Object} [config=this.config] Конфиг фигуры
   */
  setResizable(subscribeFn, config = this.config) {
    this.removeResizable();
    this.resizable = this.active ? new Resizable(this.template, config, this.type) : null;
    if (this.resizable !== null) {
      this.template.viewportElement.appendChild(this.resizable.template);
      subscribeFn && this.resizable._resize.subscribe(subscribeFn.bind(this));
    }
  }
  /**
   * Удаляет Resizable с объекта.
   */
  removeResizable() {
    if (this.resizable) {
      this.resizable.remove();
    }
    this.resizable = null;
  }
  /**
   * Удаляет объект (и из родителя, и из настроек).
   */
  kill() {
    this.deactivate();
    this.parent.killChild(this);
    this.parent.reorder();
    this.removeSettings();
  }
  /**
   * Возвращает редактор, к которому принадлежит объект.
   * @returns {Prototype} Редактор
   */
  getEditor() {
    let p = this.parent;
    while (!p.isEditor) {
      p = p.parent;
    }
    return p;
  }
  /**
   * Возвращает путь (массив) до объекта по заданному полю.
   * @param {string} [prop='order'] Ключ (обычно 'order' или 'uniqueId')
   * @returns {Array}
   */
  getFullPath(prop = 'order') {
    let parent = this.parent;
    let orders = [this[prop]];
    while (!parent.isEditor) {
      orders = [parent[prop], ...orders];
      parent = parent.parent;
    }
    return orders;
  }
  /**
   * Вычисляет смещение для drag&drop с учётом сетки.
   * @param {Event} event Событие
   * @param {Object} change Объект изменений
   * @param {number} changeX Смещение по X
   * @param {number} changeY Смещение по Y
   * @returns {Object} Объект изменений {x, y}
   */
  getPositionChanges(event, change, changeX, changeY) {
    const gridSize = globalThis.GRID?.config.size;
    change.x = changeX;
    change.y = changeY;
    if (event.shiftKey && gridSize) {
      change.x = change.x === 0 ? 0 : change.x > 0 ? gridSize : -gridSize;
      change.y = change.y === 0 ? 0 : change.y > 0 ? gridSize : -gridSize;
    }
    return change;
  }
}
