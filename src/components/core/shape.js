import Prototype from './prototype.js';
import { SHAPES } from '../shapes/base.js';
import moveListener from '../helpers/move-listener.js';

/**
 * @implements {IShape}
 */
export class Shape extends Prototype {
  __type = 'shape';
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
   *
   * @param shapeCtx
   */
  linking = shapeCtx => {};
  link = null;
  links = {
    to: [],
    from: []
  };
  /**
   *  Тип фигуры
   * @type {ShapesType}
   */
  type = null;

  listener = moveListener(
    evt => {
      this.dragging = true;
      this.dragOffsetX = evt.offsetX - this.config.x;
      this.dragOffsetY = evt.offsetY - this.config.y;
    },
    evt => {
      if (this.active && this.dragging) {
        this.template.style.cursor = 'grabbing';
        this.config.x = evt.offsetX - this.dragOffsetX;
        this.config.y = evt.offsetY - this.dragOffsetY;
        this.draw(this.template, this.config);
        globalThis.LINK.update.next(this);
        if (this.resizable) this.resizable.hide();
        if (this.link) {
          this.link.hide();
          this.link.updatePosition(this);
        }
      }
    },
    _ => {
      this.draw(this.template, this.config);
      if (this.resizable) this.resizable.show(this.template, this.config);
      this.dragging = false;
      this.dragOffsetX = this.dragOffsetY = null;
    }
  );

  _updateFn = this.#updateFn.bind(this);

  /**
   *
   * @param { Partial<IShape> } item
   * @param { IShapeConfig } config
   */
  constructor(item, config, order) {
    super(null);
    this.order = order;
    this.type = item?.type;
    this.uniqueId = config.uniqueId ?? this.uniqueId;
    this.config = config;

    [this.template, this.config, this.draw, this.resize, this.setting, this.linking] = this.#create(this.type, config);
    this.template.setAttribute('id', this.uniqueId);
    this.type === 'link' ? null : this.init(); 
  }

  init() {
    this.draw(this.template, this.config);
    this.#setListeners();
  }

  /**
   * Функция активации фигуры
   * 1. Активируется resizable - возможность изменения размера фигуры
   * 2. Добавляется возможность переноса фигуры
   */
  activate() {
    super.activate(this.setting ? this.setting(this) : null);
    this.setDraggable();
    this.setResizable(this.#updateFn);
  }

  /**
   * Функция деактивации фигуры
   * 1. Отключает resizable - возможность изменения размера фигуры
   * 2. Убирает возможность переноса фигуры
   */
  deactivate() {
    super.deactivate();
    this.removeDraggable();
    this.removeResizable();
    this.removeSettings();
  }

  kill() {
    this.deactivate();
    globalThis.LINK.remove.next(this);
    if (this.link) {
      this.link.kill(this.parent.template);
      this.link = null;
    }
    this.parent.killChild(this);
  }

  setLink(type) {
    globalThis.LINK.set.next([type, this]);
  }

  #updateFn([pointId, event]) {
    this.resize(this, pointId, event);
    this.draw(this.template, this.config);
    this.resizable.show(this.template, this.config);
    this.link?.updatePosition(this);
    this.link?.hide();
    globalThis.LINK.update.next(this);
  }

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

  #create(toolType, config) {
    config = { width: 80, height: 80, ...config };
    if (!SHAPES[toolType]) {
      return new SHAPES.square(config);
    }
    return new SHAPES[toolType](config);
  }
}
