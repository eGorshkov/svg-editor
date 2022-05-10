import { Layer } from './layer.js';
import { Core } from './core.js';
import { RESIZABLE_CONTAINER_ID, RESIZABLE_POINT_ATTRIBUTE } from '../helpers/resizable/resizable.js';

export class Editor extends Core {
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

  constructor(config) {
    super('svg', config?.layers.sort((a, b) => a.order - b.order ? 1 : -1));
    this.template.setAttribute('id', this.#EDITOR_TEMPLATE_ID);
    this.setListener();
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

  setListener() {
    document.addEventListener(
      'click',
      evt => {
        if (evt.target.hasAttribute(RESIZABLE_POINT_ATTRIBUTE)) {
          return;
        }
        const resizableContainer = this.template.getElementById(RESIZABLE_CONTAINER_ID);
        if (resizableContainer) this.template.removeChild(resizableContainer);
      },
      true
    );
  }
}
