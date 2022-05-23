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
        globalThis.UPDATE_LINK.next(this)
        if (this.resizable) {
          this.resizable.hide();
        }
      }
    },
    _ => {
      this.draw(this.template, this.config);
      if (this.resizable) {
        this.resizable.show(this.template, this.config);
      }

      this.dragging = false;
      this.dragOffsetX = this.dragOffsetY = null;
    }
  );

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
    this.setResizable(this.#resizeSubscribeFn);
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
    this.parent.killChild(this);
  }

  #resizeSubscribeFn([pointId, event]) {
    this.resize(this, pointId, event);
    this.draw(this.template, this.config);
    this.resizable.show(this.template, this.config);
  }

  #setListeners() {
    this.template.addEventListener('click', e => (this.active ? this.deactivate() : this.activate()));
    this.template.addEventListener('mouseenter', e => {
      console.log(this.uniqueId, 'shape enter link');
      globalThis.SET_TO_LINK.next(['e', this.uniqueId]);
    });
    this.template.addEventListener('mouseout', e => {
      console.log(this.uniqueId, 'shape out link');
    })
  }

  #create(toolType, config) {
    config = { width: 80, height: 80, ...config };
    if (!SHAPES[toolType]) {
      return new SHAPES.square(config);
    }
    return new SHAPES[toolType](config);
  }
}
