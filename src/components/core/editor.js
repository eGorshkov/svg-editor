import { Layer } from './layer.js';
import { Core } from './core.js';

export class Editor extends Core {
  #EDITOR_TEMPLATE_ID = 'editor-template';

  get configuration() {
    return {
      layers: this.items.map(layer => ({
        shapes: layer.items.map(shape => ({ type: shape.type, config: shape.config }))
      })),
      get json() {
        return JSON.stringify(this.layers);
      }
    };
  }

  constructor(config) {
    super('svg', config?.layers);
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
    return new Layer(this.coreId, layer?.items, {
      x: this.template.clientWidth / 2,
      y: this.template.clientHeight / 2
    });
  }

  setListener() {}
}
