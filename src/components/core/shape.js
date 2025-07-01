import Prototype from './prototype.js';
import { SHAPES, SHAPES_ALIAS } from '../shapes/base.js';
import moveListener from '../helpers/move-listener.js';

/**
 * Класс фигуры (Shape), реализующий интерфейс IShape.
 * @implements {IShape}
 */
export class Shape extends Prototype {
  /**
   * Тип объекта (shape).
   * @type {string}
   */
  __type = 'shape';
  /**
   * Функция отрисовки фигуры.
   * @type {Function}
   */
  draw = (template, config) => {};
  /**
   * Функция изменения размера фигуры.
   * @type {Function}
   */
  resize = (shapeCtx, pointId, event) => {};
  /**
   * Функция настроек фигуры.
   * @type {Function}
   */
  setting = shapeCtx => {};
  /**
   * Функция линковки фигуры.
   * @type {Function}
   */
  linking = shapeCtx => {};
  /**
   * Ссылка на объект линка (соединения).
   * @type {Object|null}
   */
  link = null;
  /**
   * Связи фигуры (to — входящие, from — исходящие).
   * @type {{to: Array, from: Array}}
   */
  links = {
    to: [],
    from: []
  };
  /**
   * Тип фигуры (square, circle, ...).
   * @type {ShapesType|null}
   */
  type = null;
  /**
   * Объект слушателей для drag&drop фигуры.
   * @type {{start: Function, move: Function, end: Function}}
   */
  listener = moveListener(
    evt => {
      this.dragging = true;
      this.dragOffsetX = evt.offsetX - this.config.x;
      this.dragOffsetY = evt.offsetY - this.config.y;
      this.resizable?.hide();
      this.link?.hide();
    },
    evt => {
      if (this.active && this.dragging) {
        this.template.style.cursor = 'grabbing';
        const change = this.getPositionChanges(evt, {}, (evt.offsetX - this.dragOffsetX) - this.config.x, (evt.offsetY - this.dragOffsetY) - this.config.y);
        this.config.x += change.x;
        this.config.y += change.y;
        this.draw(this.template, this.config);
        globalThis.LINK.update.next(this);
      }
    },
    _ => {
      this.link?.updatePosition(this);
      this.draw(this.template, this.config);
      if (this.resizable) this.resizable.show(this.template, this.config, this.type);
      this.dragging = false;
      this.dragOffsetX = this.dragOffsetY = null;
    }
  );
  /**
   * Приватный метод: функция-обработчик для ресайза.
   * @type {Function}
   * @private
   */
  _updateFn = this.#updateFn.bind(this);
  /**
   * Конструктор Shape.
   * @param {Partial<IShape>} item Данные фигуры
   * @param {IShapeConfig} config Конфигурация фигуры
   * @param {number} order Порядок фигуры
   */
  constructor(item, config, order) {
    super(null);
    this.uniqueId = item.uniqueId ?? this.uniqueId;
    this.order = order;
    this.type = item?.type;
    this.config = config;
    [this.template, this.config, this.draw, this.resize, this.setting, this.linking] = this.#create(this.type, config);
    this.template.setAttribute('id', this.uniqueId);
    this.type === 'link' ? null : this.init(); 
  }
  /**
   * Инициализирует фигуру (отрисовка и слушатели).
   */
  init() {
    this.draw(this.template, this.config);
    this.#setListeners();
  }
  /**
   * Активирует фигуру (делает resizable, drag&drop и т.д.).
   */
  activate() {
    super.activate(this.setting ? this.setting(this) : null);
    this.setDraggable();
    this.setResizable(this.#updateFn);
  }
  /**
   * Деактивирует фигуру (отключает resizable, drag&drop и т.д.).
   */
  deactivate() {
    super.deactivate();
    this.removeDraggable();
    this.removeResizable();
    this.removeSettings();
  }
  /**
   * Удаляет фигуру из родителя и связей.
   */
  kill() {
    this.deactivate();
    globalThis.LINK.remove.next(this);
    if (this.link) {
      this.link.kill(this.parent.template);
      this.link = null;
    }
    this.parent.killChild(this);
  }
  /**
   * Устанавливает связь (линк) для фигуры.
   * @param {string} type Тип точки связи
   */
  setLink(type) {
    globalThis.LINK.set.next([type, this]);
  }
  /**
   * Приватный метод: обработчик ресайза и обновления.
   * @private
   * @param {Array} param0 Массив [pointId, event]
   */
  #updateFn([pointId, event]) {
    this.resize(this, pointId, event);
    this.draw(this.template, this.config);
    this.resizable.show(this.template, this.config, this.type);
    this.link?.updatePosition(this);
    this.link?.hide();
    globalThis.LINK.update.next(this);
  }
  /**
   * Приватный метод: инициализирует слушатели событий для фигуры.
   * @private
   */
  #setListeners() {
    this.template.addEventListener('click', e => {
      if (e.shiftKey) {
        this.active && this.deactivate();
        this.parent.activate();
      } else {
        this.active ? this.deactivate() : this.activate();
      }
    });
    this.template.addEventListener('mouseenter', e => {
      if (this.link) return this.link.show();
      if (this.linking) {
        this.link = this.linking(this);
        this.link.templates.forEach(t => this.parent.template.appendChild(t));
      }
    });
    this.template.addEventListener('mouseout', e => this.link?.hide());
  }
  /**
   * Приватный метод: создаёт шаблон и обработчики для фигуры по типу.
   * @private
   * @param {string} toolType Тип фигуры
   * @param {IShapeConfig} config Конфигурация фигуры
   * @returns {Array} Массив [template, config, draw, resize, setting, linking]
   */
  #create(toolType, config) {
    config = { width: 80, height: 80, ...config };
    if (!SHAPES[toolType]) {
      return new SHAPES[SHAPES_ALIAS.square](config);
    }
    return new SHAPES[toolType](config);
  }
  /**
   * Получает конфигурацию фигуры (для экспорта/сохранения).
   * @returns {Object} Конфигурация фигуры
   */
  getConfiguration() {
    return { uniqueId: this.uniqueId, order: this.order, type: this.type, config: this.config }
  }
}
