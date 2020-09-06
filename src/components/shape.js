import { SHAPES } from './widgets/shapes/index.js';

export class Shape {
    template = null;
    active = false;
    draging = false;
    config = null;
    dragOffsetX = null;
    dragOffsetY = null;

    constructor(toolType, shapeId, config) {
        [this.template, this.config, this.draw] = this.#getShape(toolType, config);
        this.template.setAttribute('id', `${toolType}-shape-${shapeId}`);
        this.draw(this.template, this.config);
        this.setListeners();
    }

    setListeners() {
        this.template.addEventListener('dblclick', () => this.setActive(true));
    }

    draw() {}

    startDrag(evt) {
        this.draging = true;
        this.dragOffsetX = evt.offsetX - this.config.x;
        this.dragOffsetY = evt.offsetY - this.config.y;
        this.template.addEventListener('mousemove', (e) => this.move(e));
    }

    move(evt) {
        if(this.active && this.draging) {
            this.config.x = evt.offsetX - this.dragOffsetX;
            this.config.y = evt.offsetY - this.dragOffsetY;
            this.draw(this.template, this.config);
        }
    }

    endDrag(evt) {
        this.draw(this.template, this.config);
        this.template.removeEventListener('mousemove', (e) => this.move(e));
        this.dragOffsetX = this.dragOffsetY = null;
        this.draging = false;
    }

    setActive(value) {
        this.active = value;
        if(value) {
            this.template.setAttribute('draggable', 'true');
            this.listen()
         } else {
            this.template.removeAttribute('draggable');
            this.unlisten();
         }
    }

    listen() {
        this.template.addEventListener('mousedown', (e) => this.startDrag(e));
        this.template.addEventListener('mouseup', (e) => this.endDrag(e));
    }

    unlisten() {
        this.template.removeEventListener('mousedown', (e) => this.startDrag(e));
        this.template.removeEventListener('mouseup', (e) => this.endDrag(e));
    }

    #getShape(toolType, config) {
        debugger;
        if(!SHAPES[toolType]) {
            return SHAPES.square(config);
        }
        return SHAPES[toolType](config)
    }
}