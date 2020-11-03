import { SHAPES } from '../shapes/base.js';
import { Resizable } from '../helpers/resizable/resizable.js';

export class Shape {
  /**
   * Шаблон фигуры
   * @type {SVGElement}
   */
  template = null;
  /**
   *  Конфигурация фигуры
   * @type {IShapeConfig}
   */
  config = null;
  /**
   * Функция рисвоки шаблона
   * @param template - шаблон фигуры
   * @param config - конфигурация фигуры
   */
  draw = (template, config) => {};
  /**
   *
   * @param shapeCtx
   * @param event
   * @param activePoint
   */
  resize = (shapeCtx, pointId, event) => {};
  /**
   * Ид фигуры
   * @type {string}
   */
  shapeId = '';
  /**
   * Флаг того, что фигура активна:
   * 1. Активируется resizable - возможность изменения размера фигуры
   * 2. Добавляется возможность переноса фигуры
   * @type {boolean}
   */
  _active = false;
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
      if (this._active && this.dragging) {
        this.template.style.cursor = 'grabbing';
        this.config.x = evt.offsetX - this.dragOffsetX;
        this.config.y = evt.offsetY - this.dragOffsetY;
        this.draw(this.template, this.config);
        if (this.resizable) {
          this.resizable.hide();
        }
      }
    },
    end: evt => {
      this.draw(this.template, this.config);
      document.removeEventListener('mousemove', this.listener.move, true);
      document.removeEventListener('mouseup', this.listener.end, true);
      if (this.resizable) {
        this.resizable.show(this.template, this.config);
      }

      this.dragging = false;
      this._active = false;
      this.dragOffsetX = this.dragOffsetY = null;
    }
  };

  constructor(toolType, shapeId, layerId, config) {
    this.type = toolType;
    this.shapeId = `${layerId}-${this.type}-${shapeId}`;
    this.config = config;

    [this.template, this.config, this.draw, this.resize] = this.#create(this.type, config);
    this.template.setAttribute('id', this.shapeId);
    this.draw(this.template, this.config);
    this.setListeners();
  }

  setListeners() {
    this.template.addEventListener('click', e => (this._active ? this.deactive() : this.active()));
  }

  /**
   * Функция активации фигуры
   * 1. Активируется resizable - возможность изменения размера фигуры
   * 2. Добавляется возможность переноса фигуры
   */
  active() {
    this._active = true;
    this.setDraggable();
    this.setResizable();
  }

  /**
   * Функция деактивации фигуры
   * 1. Отключает resizable - возможность изменения размера фигуры
   * 2. Убирает возможность переноса фигуры
   */
  deactive() {
    this._active = false;
    this.dragging = false;
    this.removeDraggable();
    this.removeResizable();
  }

  setDraggable() {
    this.template.style.cursor = 'grab';
    this.template.addEventListener('mousedown', this.listener.start);
  }

  removeDraggable() {
    this.template.style.cursor = 'default';
    this.template.removeEventListener('mousedown', this.listener.start);
  }

  setResizable() {
    this.removeResizable();
    this.resizable = this._active ? new Resizable(this.template, this.config) : null;
    if (this.resizable !== null) {
      this.template.parentNode.appendChild(this.resizable.template);
      this.resizable._resize.subscribe(([pointId, event]) => {
        this.resize(this, pointId, event);
        this.draw(this.template, this.config);
        this.resizable.show(this.template, this.config);
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
      return SHAPES.square(config);
    }
    return SHAPES[toolType](config);
  }
}
