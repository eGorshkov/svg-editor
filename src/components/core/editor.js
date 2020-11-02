import { Layer } from './layer.js';
import { Core } from './core.js';

export class Editor extends Core {
  #EDITOR_TEMPLATE_ID = 'editor-template';

  get configuration() {
    return {
      layers: this.items.map(layer => ({
        shapes: layer.items?.map(shape => ({ type: shape.type, config: shape.config })) ?? null
      }))
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
    return new Layer(this.coreId, layer?.shapes, {
      x: this.template.clientWidth / 2,
      y: this.template.clientHeight / 2
    });
  }

  setListener() {
    // document.addEventListener('click', e => this.clickListener(e));
  }

  clickListener(e) {
    const layer = this.layers.find(layer => e.target.parentElement.id === layer.layerId);

    if (e.target.id === this.#EDITOR_TEMPLATE_ID) {
      this.layers.forEach(layer => layer.shapes.forEach(shape => shape.deactive()));
    } else if (layer !== undefined) {
      this.setActiveShape(layer, e.target.id);
    }

    //TODO REMOVE
    document.getElementById('configJSON').innerText = JSON.stringify(this.configuration);
    console.log(e);
  }

  setActiveShape(layer, id) {
    for (const shape of layer.shapes) {
      if (shape.shapeId === id) {
        shape.active();
        return;
      }
    }
  }
}
