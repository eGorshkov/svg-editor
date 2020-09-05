import { Shape } from "./shape.js";

export class Layer {
    #SHAPE_ID = 0;
    shapes = [];
    template = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    constructor(toolType, layerId) {
        this.add(toolType, layerId);
    }
    
    add(toolType, layerId) {
        this.#SHAPE_ID++;
        const shape = new Shape(toolType, this.#SHAPE_ID);
        this.shapes.push(shape);
        this.template.setAttribute('id', `layer-${layerId}`);
        this.template.appendChild(shape.template);
        return this;
    }
}

