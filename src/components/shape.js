import { SHAPES } from './widgets/shapes/index.js';

export class Shape {
    template = null;
    constructor(toolType, shapeId) {
        this.template = this.#getShape(toolType);
        this.template.setAttribute('id', `${toolType}-shape-${shapeId}`)
    }

    #getShape(toolType, config) {
        if(!SHAPES[toolType]) {
            return SHAPES.square(config);
        }
        return SHAPES[toolType](config)
    }
}