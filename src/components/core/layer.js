import { Shape } from './shape.js';
import { Core } from './core.js';

/**
 * Класс слоя (Layer), реализующий интерфейс ILayer.
 * @implements {ILayer}
 */
export class Layer extends Core {
  /**
   * Тип объекта (layer).
   * @type {string}
   */
  __type = 'layer';
  /**
   * Конфигурация фигуры по умолчанию для новых фигур в слое.
   * @type {Object|null}
   */
  defaultShapeConfig = null;
  /**
   * Флаг, показывать ли слой в интерфейсе.
   * @type {boolean}
   */
  showable = true;
  /**
   * Имя слоя.
   * @type {string|null}
   */
  name = null;
  /**
   * Конструктор Layer.
   * @param {Object} config Конфигурация слоя
   * @param {Object} defaultShapeConfig Конфиг фигуры по умолчанию
   */
  constructor(config, defaultShapeConfig) {
    super('g');
    this.name = config.name ?? null;
    this.showable = config.showable ?? true;
    this.order = config.order;
    this.uniqueId = config.uniqueId ?? this.uniqueId;
    this.defaultShapeConfig = defaultShapeConfig;
    if (config.items?.length) this.load(config.items);
  }
  /**
   * Создаёт новый элемент (фигуру или слой) внутри слоя.
   * @param {IShape|ILayer} item Данные для создания
   * @returns {Shape|Layer}
   */
  create(item) {
    if ('items' in item) {
      return new Layer(item, {
        x: this.template.clientWidth / 2,
        y: this.template.clientHeight / 2
      });
    }
    return new Shape(item, { ...this.defaultShapeConfig, ...item?.config }, item?.order || this.items.length);
  }
  /**
   * Получает конфигурацию слоя (для экспорта/сохранения).
   * @returns {Object} Конфигурация слоя
   */
  getConfiguration() {
    return {
      order: this.order,
      name: this.name,
      showable: this.showable,
      items: [...this.items.map(shape => shape.getConfiguration())]
    };
  }
}
