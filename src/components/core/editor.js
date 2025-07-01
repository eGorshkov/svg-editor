import { Layer } from './layer.js';
import { Core } from './core.js';
import { RESIZABLE_POINT_ATTRIBUTE } from '../helpers/resizable/resizable.js';
import { Subject } from '../helpers/custom-rx/subject.js';

/**
 * Класс редактора (Editor), реализующий интерфейс IEditor.
 * @implements {IEditor}
 */
export class Editor extends Core {
  /**
   * Тип объекта (editor).
   * @type {string}
   */
  __type = 'editor';
  /**
   * Subject для отслеживания изменений редактора.
   * @type {Subject}
   */
  onChange = new Subject(null, false);
  /**
   * Приватный id SVG-элемента редактора.
   * @type {string}
   * @private
   */
  #EDITOR_TEMPLATE_ID = 'editor-template';
  /**
   * Приватная конфигурация редактора.
   * @type {Object|null}
   * @private
   */
  #config = null;
  /**
   * Приватный слой для связей.
   * @type {ILayer|undefined}
   * @private
   */
  #linksLayer;
  /**
   * Геттер: возвращает слой для связей (создаёт при необходимости).
   * @returns {ILayer}
   */
  get linksLayer() {
    if (this.#linksLayer && this.get(this.#linksLayer.uniqueId)) {
      return this.#linksLayer;
    }
    this.load([{name: "Линк", showable: false}]);
    this.reorder();
    this.#linksLayer = this.last;
    return this.#linksLayer;
  }
  /**
   * Геттер: возвращает текущую конфигурацию редактора (для экспорта/сохранения).
   * @returns {Object}
   */
  get configuration() {
    return {
      config: this.#config.config,
      items: this.items,
      layers: this.items.map(layer => layer.getConfiguration()),
      toJson() {
        return JSON.stringify({
                    config: this.config,
                    layers: this.layers
                });
      }
    };
  }
  /**
   * Конструктор Editor.
   * @param {Object} config Конфигурация редактора
   */
  constructor(config) {
    super('svg');
    this.template.setAttribute('id', this.#EDITOR_TEMPLATE_ID);
    this.#config = {config: {}, ...config};
  }
  /**
   * Инициализирует редактор: слушатели, стили, загрузка слоёв.
   */
  init() {
    this.#setListener();
    this.#initObserver();
    this.#initStyles();
    if (this.#config?.layers?.length) this.load(this.#config?.layers.sort((a, b) => (a.order - b.order ? 1 : -1)));
    this.shapes.filter(shape => shape.type === "link").forEach(link => globalThis.LINK.set.next([link.type, link]));
  }
  /**
   * Создаёт новый слой (Layer) для редактора.
   * @param {ILayer} layer Данные слоя
   * @param {ShapesType} toolType Тип фигуры (не используется)
   * @returns {Layer}
   */
  create(layer) {
    return new Layer(
      layer,
      {
        x: this.template.clientWidth / 2,
        y: this.template.clientHeight / 2
      }
    );
  }
  /**
   * Приватный метод: инициализирует слушатели событий редактора.
   * @private
   */
  #setListener() {
    this.template.addEventListener(
      'click',
      evt => {
        if (evt.target.hasAttribute(RESIZABLE_POINT_ATTRIBUTE)) {
          return;
        }
        const active = globalThis.ACTIVE_ITEM_SUBJECT.getValue();
        if (this.#isActiveLayer(active, evt.target) || this.#isActiveShape(active, evt.target)) {
          evt.preventDefault();
          evt.stopPropagation();
          return;
        }
        if (active) {
          active.deactivate();
          globalThis.SETTINGS_TOOL_SUBJECT.next();
        }
      },
      true
    );
    document.addEventListener(
        'mousewheel',
        (evt) => {
            if (!globalThis.ACTIVE_ITEM_SUBJECT.getValue() && evt.shiftKey) {
                this.#setStyle('zoom', evt.deltaY * -0.01, 1);
                this.#initStyles();
            }
        }
    )
    document.addEventListener(
      'keydown',
      evt => {
        const active = globalThis.ACTIVE_ITEM_SUBJECT.getValue();
        if (active) {
          switch (evt.key) {
            case 'Escape':
              active?.deactivate();
              break;
            case 'Delete':
              active?.isLayer ? active?.killAll() : active?.kill();
              break;
            default:
              break;
          }
        } else {
          switch (evt.key) {
            case 'ArrowUp':
                this.#setStyle('translateY', -10)
                this.#initStyles();
                break;
            case 'ArrowLeft':
                evt.shiftKey ? this.#setStyle('rotate', -.1) : this.#setStyle('translateX', -10);
                this.#initStyles();
                break;
            case 'ArrowDown':
                this.#setStyle('translateY', 10)
                this.#initStyles();
                break;
            case 'ArrowRight':
                evt.shiftKey ? this.#setStyle('rotate', .1) : this.#setStyle('translateX', 10);
                this.#initStyles();
                break;
            default:
              break;
            }
                }
      },
      true
    );
  }
  /**
   * Приватный метод: проверяет, активен ли слой.
   * @private
   * @param {*} active Активный элемент
   * @param {*} target Целевой элемент
   * @returns {boolean}
   */
  #isActiveLayer(active, target) {
    return active?.isLayer && target.id !== this.#EDITOR_TEMPLATE_ID && active.find(target.id, 'uniqueId');
  }
  /**
   * Приватный метод: проверяет, активна ли фигура.
   * @private
   * @param {*} active Активный элемент
   * @param {*} target Целевой элемент
   * @returns {boolean}
   */
  #isActiveShape(active, target) {
    return active?.isShape && target.id === active.id;
  }
  /**
   * Приватный метод: инициализирует MutationObserver для отслеживания изменений DOM.
   * @private
   */
  #initObserver() {
    const observer = new MutationObserver(entries => {
      let added = [];
      let removed = [];
      console.log(entries);
      entries.forEach(entry => {
        added = [...added, ...entry.addedNodes];
        removed = [...removed, ...entry.removedNodes];
      });
      if (added.length || removed.length) this.onChange.next({ added, removed });
    });
    observer.observe(this.template, { subtree: true, childList: true });
  }
  /**
   * Приватный метод: применяет стили трансформации и масштабирования к редактору.
   * @private
   */
  #initStyles() {
    let transform = "";
    let zoom = 1;
    Object.entries(this.#config.config).forEach(([key, value]) => {
      console.log(key, value)
      switch (key) {
        case 'zoom':
            zoom = value;
            break;
        case 'rotate':
          transform += value ? `${key}(calc(${value} * 3.142rad)) ` : ""
          break;
        case 'translateX':
        case 'translateY':
          transform += value ? `${key}(${value}px) ` : ""
        default:
          break;
      }
    })
    this.template.style.transform = transform.trim();
    this.template.style.zoom = zoom;
  }
  /**
   * Приватный метод: изменяет стиль (трансформацию/масштаб) редактора.
   * @private
   * @param {string} key Ключ стиля
   * @param {number} value Значение
   * @param {number} [def=0] Значение по умолчанию
   */
  #setStyle(key, value, def = 0) {
    this.#config.config[key] = (this.#config.config[key]??def) + value;
  }
}
