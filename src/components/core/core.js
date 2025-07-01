import Prototype from './prototype.js';
import { createTemplate } from '../helpers/shape-creator.js';
import compose from '../helpers/compose.js';
import between from '../helpers/between.js';

/**
 * Базовый класс Core для SVG-элементов редактора.
 * @implements {ICore}
 */
export class Core extends Prototype {
  /**
   * Тип объекта (core).
   * @type {string}
   */
  __type = 'core';
  /**
   * Массив дочерних элементов (фигур или слоёв).
   * @type {Array<Core>}
   */
  items = [];
  /**
   * Объект слушателей для drag&drop.
   * @type {{start: Function, move: Function, end: Function}}
   */
  listener = {
    start: evt => {
      this.dragging = true;
      this.dragOffsetX = evt.offsetX;
      this.dragOffsetY = evt.offsetY;
      document.addEventListener('mousemove', this.listener.move, true);
      document.addEventListener('mouseup', this.listener.end, true);
      this.resizable?.hide();
      if (this.isLayer) this.shapes.forEach(shape => shape.link?.kill(this.template));
    },
    move: evt => {
      console.log('layer move');
      evt.preventDefault();
      if (this.active && this.dragging) {
        this.template.style.cursor = 'grabbing';
        this.#replacePosition(evt);
      }
    },
    end: evt => {
      document.removeEventListener('mousemove', this.listener.move, true);
      document.removeEventListener('mouseup', this.listener.end, true);
      if (this.isLayer) {
        this.shapes.forEach(shape => {
          if (shape.link) {
            shape.link.updatePosition(shape)
            shape.link.templates.forEach(t => this.template.appendChild(t));
          }
        });
        this.#coreConfig = this.getCoreConfig();
        this.setResizable(null, this.coreConfig);
      };
      this.dragging = false;
      this.dragOffsetX = this.dragOffsetY = null;
    }
  };
  /**
   * Привязанные приватные методы для compose.
   * @private
   */
  #bindCreateChilds = this.#createChilds.bind(this);
  /** @private */
  #bindSet = this.#set.bind(this);
  /** @private */
  #bindSetToTemplate = this.#setToTemplate.bind(this);
  /** @private */
  #bindWithParent = this.#withParent.bind(this);
  /**
   * Композиция загрузки элементов (создание, добавление, рендер).
   * @returns {Function}
   */
  get load() {
    return compose(this.#bindCreateChilds, this.#bindSet, this.#bindSetToTemplate);
  }
  /**
   * Композиция добавления элемента (с родителем, добавлением, рендером, reorder).
   * @private
   * @returns {Function}
   */
  get #add() {
    return compose(this.#bindWithParent, this.#bindSet, this.#bindSetToTemplate, () => this.reorder?.());
  }
  /**
   * Приватное поле: кэш конфигурации core.
   * @type {Object|null}
   * @private
   */
  #coreConfig = null;
  /**
   * Геттер: возвращает кэш конфигурации core.
   * @returns {Object|null}
   */
  get coreConfig() {
    return this.#coreConfig;
  }
  /**
   * Геттер: последний элемент в items.
   * @returns {*}
   */
  get last() {
    return this.items[this.items.length - 1];
  }
  /**
   * Геттер: массив всех фигур (рекурсивно по слоям).
   * @returns {Array}
   */
  get shapes() {
    if (this.isShape) return [];
    return this.#getShapes(this.items);
  }
  /**
   * Конструктор Core.
   * @param {string} tagName Имя SVG-тега
   */
  constructor(tagName) {
    super(createTemplate(tagName));
  }
  /**
   * Создаёт новый элемент (фигуру или слой). Должен быть реализован в наследнике.
   * @param {*} item Данные для создания
   * @returns {*}
   */
  create(item) {}
  /**
   * Получает конфигурацию контейнера (для экспорта/сохранения).
   * @returns {*}
   */
  getConfiguration() {}
  /**
   * Добавляет новый элемент (фигуру или слой).
   * @param {ShapesType} type Тип фигуры
   * @param {IShapeConfig} [config={}] Конфигурация фигуры
   */
  add(type, config = {}) {
    const item = this.create({ type, config });
    if (type && item.isLayer) item.add(type, config);
    this.#add(item);
  }
  /**
   * Получает элемент по значению и ключу (рекурсивно по слоям).
   * @param {Array|string|number} values Значение или массив значений
   * @param {string} [key='uniqueId'] Ключ поиска
   * @returns {*} Найденный элемент или null
   */
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
  /**
   * Рекурсивно ищет элемент по значению и ключу.
   * @param {*} value Значение
   * @param {string} key Ключ поиска
   * @returns {*} Найденный элемент или null
   */
  find(value, key) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item[key] === value) return item;
      else if (item.isLayer) {
        const child = item.find(value, key);
        if (child) return child;
      }
    }
    return null;
  }
  /**
   * Меняет порядок элементов (drag&drop reorder).
   * @param {number} source Индекс источника
   * @param {number} target Индекс цели
   */
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
  /**
   * Пересчитывает порядок всех элементов (после удаления/добавления).
   */
  reorder() {
    this.items.forEach((x, i) => (x.order = i));
  }
  /**
   * Удаляет дочерний элемент по ключу.
   * @param {*} child Дочерний элемент
   * @param {string} [byKey='uniqueId'] Ключ для поиска
   */
  killChild(child, byKey = 'uniqueId') {
    if (!child || !byKey) return;
    this.template.removeChild(child.template);
    if (this.items.length <= 1 && !this.isEditor) this.kill();
    else {
      this.items = this.items.filter(x => x[byKey] !== child[byKey]);
    }
  }
  /**
   * Удаляет все дочерние элементы.
   */
  killAll() {
    this.items.forEach(x => (x.isShape ? x.kill() : x.killAll()));
    this.kill();
  }
  /**
   * Активирует контейнер (делает resizable, drag&drop и т.д.).
   */
  activate() {
    super.activate();
    this.#coreConfig = this.getCoreConfig();
    this.setResizable(null, this.coreConfig);
    this.setCoreDraggable();
  }
  /**
   * Деактивирует контейнер (отключает resizable, drag&drop и т.д.).
   */
  deactivate() {
    super.deactivate();
    this.removeResizable();
    this.removeCoreDraggable();
  }
  /**
   * Вычисляет общую конфигурацию контейнера (границы, размеры).
   * @returns {Object} Конфигурация {x, y, width, height}
   */
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
  /**
   * Делает все дочерние элементы перетаскиваемыми (drag&drop).
   * @param {Function} [cb=this.listener.start] Колбэк для drag
   */
  setCoreDraggable(cb = this.listener.start) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      item.isLayer ? item.setCoreDraggable(cb) : item.setDraggable(cb);
    }
  }
  /**
   * Удаляет drag&drop у всех дочерних элементов.
   * @param {Function} [cb=this.listener.start] Колбэк для drag
   */
  removeCoreDraggable(cb = this.listener.start) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      item.isLayer ? item.removeCoreDraggable(cb) : item.removeDraggable(cb);
    }
  }
  /**
   * Смещает все дочерние элементы на заданное значение.
   * @param {Object} change Объект с изменениями {x, y}
   */
  changeChildPosition(change) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.isShape) {
        item.config.x += change.x;
        item.config.y += change.y;
        item.draw(item.template, item.config);
        globalThis.LINK.update.next(item);
      } else {
        item.changeChildPosition(change);
      }
    }
  }
  /**
   * Приватный метод: обработка перемещения контейнера (drag&drop).
   * @private
   * @param {Event} evt Событие
   */
  #replacePosition(evt) {
    this.template.style.cursor = 'grabbing';
    const change = this.getPositionChanges(evt, {}, evt.offsetX - this.dragOffsetX, evt.offsetY - this.dragOffsetY);
    this.dragOffsetX = evt.offsetX;
    this.dragOffsetY = evt.offsetY;
    this.changeChildPosition(change);
    if (this.resizable) this.resizable.hide();
    if (this.isLayer) this.items.forEach(item => item.resizable?.hide())
  }
  /**
   * Приватный метод: создаёт дочерние элементы из массива.
   * @private
   * @param {Array} _items Массив данных
   * @returns {Array} Массив созданных элементов
   */
  #createChilds(_items) {
    return _items.map(x => {
      const created = this.create(x);
      created.active = x.active || created.active;
      return this.#withParent(created);
    });
  }
  /**
   * Приватный метод: устанавливает родителя для дочернего элемента.
   * @private
   * @param {*} child Дочерний элемент
   * @returns {*} Дочерний элемент с установленным parent
   */
  #withParent(child) {
    child.parent = this;
    return child;
  }
  /**
   * Приватный метод: добавляет элементы в items.
   * @private
   * @param {Array|*} _items Элементы для добавления
   * @returns {Array} Новый массив items
   */
  #set(_items) {
    _items = (Array.isArray(_items) ? _items : [_items]).filter(Boolean);
    if (!_items?.length) return [];
    this.items = [...this.items, ..._items];
    return this.items;
  }
  /**
   * Приватный метод: добавляет элементы в DOM.
   * @private
   * @param {Array} _items Элементы
   */
  #setToTemplate(_items) {
    _items.forEach(item => this.template.appendChild(item.template));
  }
  /**
   * Приватный метод: рекурсивно собирает все фигуры из items.
   * @private
   * @param {Array} items Массив элементов
   * @returns {Array} Массив фигур
   */
  #getShapes(items) {
    const res = [];
    for (let i = 0; i < items.length; i++) {
      const n = items[i];
      n.isLayer ? res.push(...this.#getShapes(n.items)) : res.push(n);
    }
    return res;
  }
}
