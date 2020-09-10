import { Layer } from './layer.js';

export class Editor {
  /**
   *
   * @type {ILayer[]}
   */
  layers = [];
  template = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  #LAYER_ID = 0;
  #EDITOR_TEMPLATE_ID = 'editor-template';

  get configuration() {
    return {
      layers: this.layers.map(layer => ({
        shapes: layer.shapes?.map(shape => ({ type: shape.type, config: shape.config })) ?? null
      }))
    };
  }

  constructor(config) {
    this.template.setAttribute('id', this.#EDITOR_TEMPLATE_ID);
    if (config) {
      this.setByConfig(config);
    }
    this.setListener();
  }

  add(toolType) {
    const layer = this.createLayer();
    layer.add(toolType);
    this.layers.push(layer);
    this.template.appendChild(layer.template);
  }

  createLayer(shapes) {
    this.#LAYER_ID++;
    return new Layer(this.#LAYER_ID, shapes, {
      x: this.template.clientWidth / 2,
      y: this.template.clientHeight / 2
    });
  }

  setListener() {
    document.addEventListener('click', e => this.clickListener(e));
  }

  clickListener(e) {
    const layer = this.layers.find(layer => e.target.parentElement.id === layer.layerId);

    if (e.target.id === this.#EDITOR_TEMPLATE_ID) {
      this.layers.forEach(layer => layer.shapes.forEach(shape => shape.deactive()));
    } else if (layer !== undefined) {
      for (const shape of layer.shapes) {
        if (shape.shapeId === e.target.id) {
          shape.active();
          return;
        }
      }
    }

    //TODO REMOVE
    document.getElementById('configJSON').innerText = JSON.stringify(this.configuration);
    console.log(e);
  }

  setByConfig(config) {
    this.layers = config.layers.map(layer => {
      layer = this.createLayer(layer.shapes);
      this.template.appendChild(layer.template);
      return layer;
    });
  }
}
