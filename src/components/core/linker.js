import { createTemplate } from '../helpers/shape-creator.js';

const STEP = 20;
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
    y: coords.y + coords.height
  }),
  n: coords => ({
    x: coords.x + coords.width / 2,
    y: coords.y
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
  template = createTemplate('g');

  constructor(editor) {
    this.#editor = editor;
    this.template.id = 'links-container';
    this.#init();
    this.#editor.template.appendChild(this.template);
  }

  #init() {
    this.set.subscribe(([type, shape]) => {
      if (this.active) {
        console.log('linking');
        this.shapes.push({ shape, type });
        this.#link();
        this.active = false;
        this.shapes = [];
        this.#draw();
        console.log('end linking', this.links);
      } else {
        console.log('start linking');
        this.active = true;
        this.shapes.push({ shape, type });
      }
    });

    this.update.subscribe(shape => {
      for (let i = 0; i < this.links.length; i++) {
        const link = this.links[i];
        if (link.id.includes(shape.uniqueId)) {
          document.getElementById(link.id)?.setAttribute('points', this.#createPoints(link));
        }
      }
    });
  }

  #link() {
    this.#createLink(this.shapes);
  }

  #createLink([from, to]) {
    this.links.push({
      from: from,
      to: to,
      get id() {
        return [this.from.shape.uniqueId, this.to.shape.uniqueId].join('-');
      },
      path: () => this.#createPath(from, to)
    });
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
    });
  }

  #createPoints(link) {
    return link
      .path()
      .map(p => `${p.x},${p.y}`)
      .join(' ');
  }

  #createPath(from, to) {
    let start = COORDS_BY_TYPE[from.type](from.shape.template.getBBox()),
      end = COORDS_BY_TYPE[to.type](to.shape.template.getBBox());

    return [start, ...this.#getAdditionalPoints(from, start, to, end), end];
  }

  #getAdditionalPoints(from, start, to, end) {
    const type = [from.type, to.type].join('-');

    const config = {
      start,
      end,
      type
    };

    switch (type) {
      case 'e-e':
      case 'w-w':
        return this.#getCoordsBySameTypes(config, 'x', 'e-e');
      case 'e-w':
      case 'w-e':
        return this.#getCoordsByNotSameTypes(config, 'x', 'e-w');
      case 's-s':
      case 'n-n':
        return this.#getCoordsBySameTypes(config, 'y', 's-s');
      case 's-n':
      case 'n-s':
        return this.#getCoordsByNotSameTypes(config, 'y', 's-n');
      default:
        return [];
    }
  }

  /**
   *
   * @param config
   * @param prop {'x' | 'y'}
   * @param positiveType {'s-s' | 'e-e'}
   */
  #getCoordsBySameTypes(config, prop, positiveType) {
    const { start, end, type } = config;
    const NEXT_STEP = STEP * (type === positiveType ? 1 : -1);
    const FN = type === positiveType ? Math.max : Math.min;
    const NEXT = FN(start[prop], end[prop]) + NEXT_STEP;
    return [
      { ...start, [prop]: NEXT },
      { ...end, [prop]: NEXT }
    ];
  }

  /**
   *
   * @param config
   * @param prop {'x' | 'y'}
   * @param positiveType {'s-n' | 'e-w'}
   */
  #getCoordsByNotSameTypes(config, prop, positiveType) {
    const { start, end, type } = config;

    let aProp = prop === 'x' ? 'y' : 'x',
      aPositiveType = positiveType.split('-').reverse().join('-'),
      middleDiff = (start[prop] - end[prop]) / 2,
      middleAbs = Math.abs(middleDiff),
      aMiddleDiff = (start[aProp] - end[aProp]) / 2,
      aMiddleAbs = Math.abs(aMiddleDiff),
      isPositiveDiff = middleDiff > 0,
      aIsPositiveDiff = aMiddleDiff > 0;

    const isNear = (!isPositiveDiff && type === positiveType) || (isPositiveDiff && type === aPositiveType);

    return isNear
      ? this.#getNearCoords(start, end, prop, middleAbs, isPositiveDiff)
      : this.#getDiffCoords(start, end, prop, aProp, aMiddleAbs, isPositiveDiff, aIsPositiveDiff);
  }

  #getNearCoords(start, end, prop, middleAbs, isPositiveDiff) {
    const startV = start[prop] + middleAbs * (isPositiveDiff ? -1 : 1),
      endV = end[prop] + middleAbs * (isPositiveDiff ? 1 : -1);
    return [
      { ...start, [prop]: startV },
      { ...end, [prop]: endV }
    ];
  }

  #getDiffCoords(start, end, prop, aProp, aMiddleAbs, isPositiveDiff, aIsPositiveDiff) {
    const startV = start[prop] + STEP * (isPositiveDiff ? 1 : -1),
      endV = end[prop] + STEP * (isPositiveDiff ? -1 : 1);

    const aStartV = start[aProp] + aMiddleAbs * (aIsPositiveDiff ? -1 : 1),
      aEndV = end[aProp] + aMiddleAbs * (aIsPositiveDiff ? 1 : -1);

    return [
      { ...start, [prop]: startV },
      { [aProp]: aStartV, [prop]: startV },
      { [aProp]: aEndV, [prop]: endV },
      { ...end, [prop]: endV }
    ];
  }
}
