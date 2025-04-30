import { Layer } from './layer.js';
import { Core } from './core.js';
import { RESIZABLE_POINT_ATTRIBUTE } from '../helpers/resizable/resizable.js';
import { Subject } from '../helpers/custom-rx/subject.js';

/**
 * @implements {IEditor}
 */
export class Editor extends Core {
  __type = 'editor';
  onChange = new Subject(null, false);

  #EDITOR_TEMPLATE_ID = 'editor-template';
  #config = null;

  /**
   * @type {ILayer}
   */
  #linksLayer;
  get linksLayer() {
    if (this.#linksLayer && this.get(this.#linksLayer.uniqueId)) {
      return this.#linksLayer;
    }
    this.load([{name: "Линк", showable: false}]);
    this.reorder();
    this.#linksLayer = this.last;
    return this.#linksLayer;
  }

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

  constructor(config) {
    super('svg');
    this.template.setAttribute('id', this.#EDITOR_TEMPLATE_ID);
    this.#config = {config: {}, ...config};
  }

  init() {
    this.#setListener();
    this.#initObserver();
    this.#initStyles();
    if (this.#config?.layers?.length) this.load(this.#config?.layers.sort((a, b) => (a.order - b.order ? 1 : -1)));

    this.shapes.filter(shape => shape.type === "link").forEach(link => globalThis.LINK.set.next([link.type, link]));
  }

  /**
   *
   * @param layer { ILayer }
   * @param toolType { ShapesType }
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
            if (!globalThis.ACTIVE_ITEM_SUBJECT.getValue()) {
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

  #isActiveLayer(active, target) {
    return active?.isLayer && target.id !== this.#EDITOR_TEMPLATE_ID && active.find(target.id, 'uniqueId');
  }

  #isActiveShape(active, target) {
    return active?.isShape && target.id === active.id;
  }

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

  #setStyle(key, value, def = 0) {
    this.#config.config[key] = (this.#config.config[key]??def) + value;
  }
}
