import { Layer } from './layer.js';
import { Core } from './core.js';
import { RESIZABLE_POINT_ATTRIBUTE } from '../helpers/resizable/resizable.js';
import { Subject } from '../helpers/custom-rx/subject.js';

export class Editor extends Core {
  __type = 'editor';
  #EDITOR_TEMPLATE_ID = 'editor-template';

  get configuration() {
    return {
      items: this.items,
      layers: this.items.map(layer => ({
        items: layer.items.map(shape => ({ type: shape.type, config: shape.config }))
      })),
      toJson() {
        return JSON.stringify(this.layers);
      }
    };
  }

  onChange = new Subject(null, false);

  constructor(config) {
    super('svg', config?.layers.sort((a, b) => a.order - b.order ? 1 : -1));
    this.template.setAttribute('id', this.#EDITOR_TEMPLATE_ID);
    this.#setListener();
    this.#initObserver();
  }

  /**
   *
   * @param layer { ILayer }
   * @param toolType { ShapesType }
   * @returns {Layer}
   */
  create(layer) {
    this.updateCoreId();
    const _layer = new Layer(this.coreId, layer?.items, {
      x: this.template.clientWidth / 2,
      y: this.template.clientHeight / 2
    }, layer?.order || this.items.length);
    _layer.editor = this;
    return _layer;
  }

  #setListener() {
    document.addEventListener(
      'click',
      evt => {
        if (evt.target.hasAttribute(RESIZABLE_POINT_ATTRIBUTE)) {
          return;
        }
        const active = globalThis.ACTIVE_ITEM_SUBJECT.getValue();
        if (active && evt.target !== active?.template) {
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
              globalThis.SETTINGS_TOOL_SUBJECT.next();
              break;
            case 'Delete':
              active?.kill();
              if (!active?.layer.shapes.length) active?.layer?.kill();
              globalThis.SETTINGS_TOOL_SUBJECT.next();
              break;
            default:
              break;
          }
        };
      },
      true
    );
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

      if(added.length || removed.length) this.onChange.next({added, removed});
      
    });
    observer.observe(this.template, {subtree: true, childList: true});
  }
}
