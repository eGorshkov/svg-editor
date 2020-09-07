import { Layer } from './layer.js';

export class Editor {
  config = null;
  template = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  #LAYER_ID = 0;
  layers = [];

  constructor(config) {
    this.config = config ?? 'config';
    this.setListener();
  }

  add(toolType) {
    this.#LAYER_ID++;
    const layer = new Layer(toolType, this.#LAYER_ID, {
      x: this.template.clientWidth / 2,
      y: this.template.clientHeight / 2
    });
    this.layers.push(layer);
    this.template.appendChild(layer.template);
  }

  setListener() {
    document.addEventListener('click', e => this.clickListener(e));
  }

  clickListener(e) {
    // if(e.target.tagName === 'svg') {
    // this.layers.forEach(layer => layer.shapes.forEach(shape => shape.setActive(false)))
    // }
    console.log(e);
  }
}
