import Prototype from './prototype.js';
import { SHAPES } from '../shapes/base.js';
import { Resizable } from '../helpers/resizable/resizable.js';

export class Shape extends Prototype {
  __type = 'shape';
  /**
   *  Конфигурация фигуры
   * @type {IShapeConfig}
   */
  config = null;
  /**
   * Функция рисвоки шаблона
   * @param template - шаблон фигуры
   * @param config - конфигурация фигуры
   * @type {IShape.draw}
   */
  draw = (template, config) => {};
  /**
   *
   * @param shapeCtx
   * @param pointId
   * @param event
   */
  resize = (shapeCtx, pointId, event) => {};
  /**
   *
   * @param shapeCtx
   */
  setting = shapeCtx => {};
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
  /**
   * Класс изменения размера фигуры
   * @type {IResizable}
   */
  resizable = null;
  /**
   *  Тип фигуры
   * @type {ShapesType}
   */
  type = null;

  listener = {
    start: evt => {
      this.dragging = true;
      this.dragOffsetX = evt.offsetX - this.config.x;
      this.dragOffsetY = evt.offsetY - this.config.y;
      document.addEventListener('mousemove', this.listener.move, true);
      document.addEventListener('mouseup', this.listener.end, true);
    },
    move: evt => {
      console.log('shape move');
      evt.preventDefault();
      if (this.active && this.dragging) {
        this.template.style.cursor = 'grabbing';
        this.config.x = evt.offsetX - this.dragOffsetX;
        this.config.y = evt.offsetY - this.dragOffsetY;
        this.draw(this.template, this.config);
        if (this.resizable) {
          this.resizable.hide();
        }
        this.setSettings();
      }
    },
    end: evt => {
      this.draw(this.template, this.config);
      document.removeEventListener('mousemove', this.listener.move, true);
      document.removeEventListener('mouseup', this.listener.end, true);
      if (this.resizable) {
        this.resizable.show(this.template, this.config);
      }
      this.setSettings();

      this.dragging = false;
      this.active = false;
      this.dragOffsetX = this.dragOffsetY = null;
    }
  };

  /**
   * 
   * @param { Partial<IShape> } item 
   * @param { IShapeConfig } config 
   */
  constructor(item, config, order) {
    super(null);
    this.order = order;
    this.type = item?.type;
    this.config = config;

    [this.template, this.config, this.draw, this.resize, this.setting] = this.#create(this.type, config);
    this.template.setAttribute('id', this.uniqueId);
    this.draw(this.template, this.config);
    this.setListeners();
  }

  setListeners() {
    this.template.addEventListener('click', e => (this.active ? this.deactivate() : this.activate()));
  }

  /**
   * Функция активации фигуры
   * 1. Активируется resizable - возможность изменения размера фигуры
   * 2. Добавляется возможность переноса фигуры
   */
  activate() {
    this.active = true;
    this.setSettings();
    this.setDraggable();
    this.setResizable();
    globalThis.ACTIVE_ITEM_SUBJECT.next(this);
  }

  /**
   * Функция деактивации фигуры
   * 1. Отключает resizable - возможность изменения размера фигуры
   * 2. Убирает возможность переноса фигуры
   */
  deactivate() {
    this.active && globalThis.ACTIVE_ITEM_SUBJECT.next();
    this.active = false;
    this.dragging = false;
    this.removeDraggable();
    this.removeResizable();
  }

  kill() {
    this.deactivate();
    this.parent.killChild(this);
  }

  kill() {
    this.deactivate();
    this.layer.killChild(this, 'shapeId');
  }

  setDraggable() {
    this.removeDraggable();

    this.template.style.cursor = 'grab';
    this.template.addEventListener('mousedown', this.listener.start, true);
  }

  removeDraggable() {
    this.template.style.cursor = 'default';
    this.template.removeEventListener('mousedown', this.listener.start, true);
  }

  setResizable() {
    this.removeResizable();
    
    this.resizable = this.active ? new Resizable(this.template, this.config) : null;
    if (this.resizable !== null) {
      this.template.viewportElement.appendChild(this.resizable.template);
      this.resizable._resize.subscribe(([pointId, event]) => {
        this.resize(this, pointId, event);
        this.draw(this.template, this.config);
        this.resizable.show(this.template, this.config);
        this.setSettings();
      });
    }
  }

  removeResizable() {
    if (this.resizable) {
      this.resizable.remove();
    }
    this.resizable = null;
  }

  #create(toolType, config) {
    config = { width: 80, height: 80, ...config };
    if (!SHAPES[toolType]) {
      return new SHAPES.square(config);
    }
    return new SHAPES[toolType](config);
  }

  setSettings() {
    if (this.setting) {
      globalThis.SETTINGS_TOOL_SUBJECT.next({
        shape: this,
        settingsConfig: this.setting(this)
      });
    }
  }
}
