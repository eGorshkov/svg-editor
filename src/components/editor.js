import { Layer } from "./layer.js";

export class Editor {
    config = null;
    template = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    #LAYER_ID = 0;
    layers = [];

    constructor(config) {
        this.config = config ?? 'config';
    }

    add(toolType) {
        debugger;
        this.#LAYER_ID++;
        const layer = new Layer(toolType, this.#LAYER_ID);
        this.layers.push(layer);
        this.template.appendChild(layer.template);
    }
}