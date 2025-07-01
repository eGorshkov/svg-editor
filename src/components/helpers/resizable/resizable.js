import { ShapeCreator } from '../shape-creator.js';
import { circleDraw, CircleShape } from '../../shapes/circle-shape.js';
import { squareDraw, SquareShape } from '../../shapes/square-shape.js';
import { Subject } from '../custom-rx/subject.js';
import { ResizablePoints } from './resizable-points.js';

/**
 * Идентификатор SVG-контейнера для точек ресайза.
 * @type {string}
 */
export const RESIZABLE_CONTAINER_ID = 'resizable-container';

/**
 * Атрибут для SVG-точек ресайза.
 * @type {string}
 */
export const RESIZABLE_POINT_ATTRIBUTE = 'resizable-point';

/**
 * Класс Resizable — управление изменением размера SVG-фигуры.
 * Позволяет отображать, скрывать и удалять точки изменения размера, а также обрабатывать drag&drop для точек.
 */
export class Resizable {
  /**
   * Объект с координатами и именами точек ресайза.
   * @type {ResizablePoints|null}
   */
  points = null;
  /**
   * SVG-контейнер для точек ресайза.
   * @type {SVGGElement|null}
   */
  template = null;
  /**
   * Смещение по X при drag&drop точки.
   * @type {number|null}
   */
  dragOffsetX = null;
  /**
   * Смещение по Y при drag&drop точки.
   * @type {number|null}
   */
  dragOffsetY = null;
  /**
   * Флаг: активен ли drag&drop точки.
   * @type {boolean}
   */
  draggable = false;

  /**
   * Приватное поле: id активной точки.
   * @type {string|null}
   * @private
   */
  #activePointId = null;
  /**
   * Приватный геттер: возвращает активную SVG-точку.
   * @returns {SVGElement|null}
   */
  get #activePoint() {
    if (this.template === null) {
      return null;
    }
    return Array.from(this.template.children).find(x => this.#getPointIdentificator(x) === this.#activePointId);
  }

  /**
   * Subject для событий ресайза (Rx-подписка).
   * @type {Subject}
   */
  _resize = new Subject(null, false);

  /**
   * Объект слушателей событий для drag&drop точек.
   * @type {{start: Function, move: Function, end: Function}}
   */
  listener = {
    /**
     * Обработчик начала drag&drop.
     * @param {MouseEvent} evt
     */
    start: evt => {
      evt.preventDefault();
      this.draggable = true;
      this.#activePointId = this.#getPointIdentificator(evt.target);
      this.dragOffsetX = evt.offsetX - this.points[this.#activePointId].x;
      this.dragOffsetY = evt.offsetY - this.points[this.#activePointId].y;
      this.hide(this.#activePointId);
      document.addEventListener('mousemove', this.listener.move);
      document.addEventListener('mouseup', this.listener.end);
    },
    /**
     * Обработчик перемещения drag&drop.
     * @param {MouseEvent} evt
     */
    move: evt => {
      if (this.draggable) {
        this.points[this.#activePointId].x = evt.offsetX - this.dragOffsetX;
        this.points[this.#activePointId].y = evt.offsetY - this.dragOffsetY;
        this.draw(this.#activePoint);
        this._resize.next([this.#activePointId, evt]);
      }
    },
    /**
     * Обработчик завершения drag&drop.
     * @param {MouseEvent} evt
     */
    end: evt => {
      this.draggable = false;
      this.draw(this.#activePoint);
      this._resize.next([this.#activePointId, evt]);
      document.removeEventListener('mousemove', this.listener.move);
      document.removeEventListener('mouseup', this.listener.end);
      this.dragOffsetX = this.dragOffsetY = null;
      this.#activePointId = null;
    }
  };

  /**
   * Конструктор Resizable.
   * @param {SVGElement} template SVG-элемент фигуры
   * @param {Object} config Конфигурация фигуры
   * @param {string} type Тип фигуры
   */
  constructor(template, config, type) {
    [this.template] = ShapeCreator('g', { width: config.width, height: config.height });
    this.template.id = RESIZABLE_CONTAINER_ID;
    this.setPoints(template, this.getShapeCoords(template, config), type);
    this.createOverlay();
    this.create();
  }

  /**
   * Приватный метод: возвращает идентификатор точки по aria-label.
   * @private
   * @param {SVGElement} template
   * @returns {string}
   */
  #getPointIdentificator(template) {
    return template.ariaLabel;
  }

  /**
   * Отрисовывает точку по шаблону.
   * @param {SVGElement|null} pointTemplate
   */
  draw(pointTemplate) {
    if (pointTemplate === null) {
      return;
    }
    const id = this.#getPointIdentificator(pointTemplate);
    id === 'overlay' ? squareDraw(pointTemplate, this.points[id]) : circleDraw(pointTemplate, this.points[id]);
  }

  /**
   * Получает координаты фигуры для ресайза.
   * @param {SVGElement} template
   * @param {Object} shapeConfig
   * @returns {Object} Координаты
   */
  getShapeCoords(template, shapeConfig) {
    const coords = template.getBBox();
    coords.x = coords.x || shapeConfig.x;
    coords.y = coords.y || shapeConfig.y;
    return coords;
  }

  /**
   * Устанавливает точки ресайза.
   * @param {SVGElement} template
   * @param {Object} coords
   * @param {string} shapeType
   */
  setPoints(template, coords, shapeType) {
    this.points = new ResizablePoints(template, coords, shapeType);
  }

  /**
   * Создаёт все точки ресайза и добавляет их в template.
   */
  create() {
    this.points.circlesNames
      .reduce(this.createPoint(this.points), [])
      .forEach(point => this.template.appendChild(point));
  }

  /**
   * Создаёт overlay (контурную область) для ресайза.
   */
  createOverlay() {
    const [overlayTemplate, config, draw] = SquareShape(this.points.overlay);
    overlayTemplate.setAttribute('aria-label', 'overlay');
    overlayTemplate.setAttributeNS(null, 'stroke-dasharray', '3 3');
    draw(overlayTemplate, config);
    this.template.appendChild(overlayTemplate);
  }

  /**
   * Фабрика для создания SVG-точки.
   * @param {Object} points Объект точек
   * @returns {Function} Функция-редьюсер для создания точки
   */
  createPoint(points) {
    return (acc, pointKey) => {
      if (pointKey === 'overlay') {
        return acc;
      }
      const [pointTemplate, config, draw] = CircleShape(points[pointKey]);
      pointTemplate.setAttribute('aria-label', pointKey);
      pointTemplate.setAttribute(RESIZABLE_POINT_ATTRIBUTE, '');
      draw(pointTemplate, config);
      this.setDraggable(pointTemplate);
      return [...acc, pointTemplate];
    };
  }

  /**
   * Скрывает точки изменения размера.
   * @param {string} [exception] id точки, которую не скрывать
   */
  hide(exception) {
    Array.from(this.template.children).forEach(
      point => (point.style.visibility = this.#getPointIdentificator(point) === exception ? 'visible' : 'hidden')
    );
  }

  /**
   * Показывает точки изменения размера.
   * @param {SVGElement} template SVG-элемент
   * @param {Object} config Конфигурация фигуры
   * @param {string} type Тип фигуры
   */
  show(template, config, type) {
    if (this.draggable) {
      return;
    }
    this.setPoints(template, this.getShapeCoords(template, config), type);
    Array.from(this.template.children).forEach(point => {
      this.draw(point);
      point.style.visibility = 'visible';
    });
  }

  /**
   * Удаляет все элементы ресайза.
   */
  remove() {
    Array.from(this.template).forEach(point => this.removeDraggable(point));
    this.template.remove();
    this.template = null;
    this.points = null;
  }

  /**
   * Делает точку drag&drop-активной.
   * @param {SVGElement} pointTemplate
   */
  setDraggable(pointTemplate) {
    pointTemplate.addEventListener('mousedown', this.listener.start, true);
  }

  /**
   * Удаляет drag&drop с точки.
   * @param {SVGElement} pointTemplate
   */
  removeDraggable(pointTemplate) {
    pointTemplate.removeEventListener('mousedown', this.listener.start, true);
  }
}
