import { Layer } from './layer.js';
import { Core } from './core.js';
import { RESIZABLE_POINT_ATTRIBUTE } from '../helpers/resizable/resizable.js';
import { Subject } from '../helpers/custom-rx/subject.js';
import Linker from './linker.js';

/**
 * @implements {IEditor}
 */
export class Editor extends Core {
  __type = 'editor';
  #EDITOR_TEMPLATE_ID = 'editor-template';
  #linker = null;

  onChange = new Subject(null, false);

  get configuration() {
    return {
      items: this.items,
      layers: this.items.map(layer => ({
        order: layer.order,
        items: layer.items.map(shape => ({ order: shape.order, type: shape.type, config: shape.config }))
      })),
      toJson() {
        return JSON.stringify(this.layers);
      }
    };
  }

  constructor(config) {
    super('svg');

    this.template.setAttribute('id', this.#EDITOR_TEMPLATE_ID);
    this.#setListener();
    this.#initObserver();
    if (config?.layers?.length) this.load(config?.layers.sort((a, b) => (a.order - b.order ? 1 : -1)));

    this.#linker = new Linker(this);
  }

  /**
   *
   * @param layer { ILayer }
   * @param toolType { ShapesType }
   * @returns {Layer}
   */
  create(layer) {
    return new Layer(
      layer?.items,
      {
        x: this.template.clientWidth / 2,
        y: this.template.clientHeight / 2
      },
      layer?.order || this.items.length
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
}
