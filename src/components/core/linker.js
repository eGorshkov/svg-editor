import { createTemplate } from '../helpers/shape-creator.js';

const STEP = 20;
const TYPES = ['w', 'e'].reverse();

const COORDS_BY_TYPE = {
  e: coords => ({
    x: coords.x + coords.width,
    y: coords.y + coords.height / 2
  }),
  w: coords => ({
    x: coords.x,
    y: coords.y + coords.height / 2
  }),
  s: coords => ({
    x: coords.x + coords.width / 2,
    y: coords.y
  }),
  n: coords => ({
    x: coords.x + coords.width / 2,
    y: coords.y + coords.height
  })
};

export default class Linker {
    set = globalThis.SET_TO_LINK;
    update = globalThis.UPDATE_LINK;
    #editor = null;
    active = false;
    shapes = [];
    links = [];
    /**
     * @type {SVGElement}
     */
    template = createTemplate('g')

    constructor(editor) {
        this.#editor = editor;
        this.template.id = 'links-container';
        this.#init();    
        this.#editor.template.appendChild(this.template);
    }

    #init() {
        this.set.subscribe(([type, id]) => {
            if (this.active) {
                console.log('linking');
                this.shapes.push({
                    id,
                    type: TYPES[1]
                });
                this.#link();
                this.active = false;
                this.shapes = [];
                this.#draw();
                console.log('end linking', this.links);
                return;
            } else {
                console.log('start linking');
                this.active = true;
                this.shapes.push({id, type: TYPES[0]});
            }
        });

        this.update.subscribe(shape => {
            console.log('update links', shape.uniqueId, this.links.filter(x => x.id.includes(shape.uniqueId)));
        });
    }

    #link() {
        const [from, to] = this.shapes.map(v => ({
            ...v,
            coords: this.#editor.find(v.id, 'uniqueId').template.getBBox(),
        }));
        this.#createLink(from, to);
    }

    #createLink(from, to) {
        this.links.push({
            from: from.id,
            to: to.id,
            get id() {
                return [this.from, this.to].join('-')
            },
            path: this.#createPath(from, to)
        })
    }

    #draw() {
        const childs = [...this.template.children].map(x => x.id); 
        this.links.forEach(child => {
            if (childs.includes(child.id)) {

            } else {
                debugger;
                const linkTemplate = createTemplate('polyline');
                linkTemplate.id = child.id;
                linkTemplate.setAttribute('points', this.#createPoints(child));

                linkTemplate.style.fill = 'none';
                linkTemplate.style.stroke = 'black';
                linkTemplate.style.strokeWidth = 3;

                this.template.appendChild(linkTemplate);
            }
        })

    }

    #createPoints(link) {
       return link.path.map(p => `${p.x},${p.y}`).join(' ')
    }

    #createPath(from, to) {
        let start = COORDS_BY_TYPE[from.type](from.coords),
            end = COORDS_BY_TYPE[to.type](to.coords);

        return [
            start,
            ...this.#getAdditionalPoints(from, start, to, end),
            end
        ]
    }

    #getAdditionalPoints(from, start, to, end) {
        const type = [from.type, to.type].join('-')

        const config = {
            from,
            start,
            to,
            end,
            type,
        }

        switch (type) {
            case 'e-e':
            case 'w-w':
                return this.#getCoordsBySameHorizontalTypes(config);
            case 'e-w':
            case 'w-e':
                return this.#getCoordsByNotSameHorizontalTypes(config);
            case 's-s':
            case 'n-n':
                return this.#getCoordsBySameVerticalTypes(config);
            default:
                return [];
        }
    }

    #getCoordsBySameHorizontalTypes(config) {
        const {start, end, type} = config
        const NEXT_STEP = STEP * (type === 'e-e' ? 1 : -1)
        const FN = type === 'e-e' ? Math.max : Math.min;
        const NEXT_X = FN(start.x, end.x) + NEXT_STEP;
        return [ {...start, x: NEXT_X}, {...end, x: NEXT_X} ];
    }

    #getCoordsByNotSameHorizontalTypes(config) {
        const {start, from, end, to, type} = config
        let sx, ex;

        let middleX = Math.abs(start.x - end.x) / 2;
        let isPositive = start.x - end.x > 0;
        let isNear = isPositive && type === 'w-e' || !isPositive && type === 'e-w';

        if (isNear) {
            sx = start.x + middleX * (type === 'w-e' ? -1 : 1);
            ex = end.x + middleX * (type === 'w-e' ? 1 : -1);
            return [ {...start, x: sx}, {...end, x: ex} ];
        } else {
            sx = start.x + STEP;
            ex = end.x - STEP;

            y = (middleY > 0 ? start.y : end.y) + (middleY > 0 ? from.coords.height : to.coords.height) / 2 + STEP; 

            return [
                {...start, x: sx},
                {x: sx, y},
                {x: ex, y},
                {...end, x: end.x - STEP}
            ]
        }
    }

    #getCoordsBySameVerticalTypes(config) {
        const {start, end, type} = config
        const NEXT_STEP = STEP * (type === 'n-n' ? 1 : -1)
        const FN = type === 'n-n' ? Math.max : Math.min;
        const NEXT_Y = FN(start.y, end.y) + NEXT_STEP;
        return [ {...start, y: NEXT_Y}, {...end, y: NEXT_Y} ];
    }
}