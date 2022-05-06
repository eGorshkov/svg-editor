import { Layer } from './layer.js';
import { Core } from './core.js';
import { RESIZABLE_CONTAINER_ID, RESIZABLE_POINT_ATTRIBUTE } from '../helpers/resizable/resizable.js';
import between from '../helpers/between.js'

export class Editor extends Core {
  #EDITOR_TEMPLATE_ID = 'editor-template';

  get configuration() {
    return {
      items: this.items,
      layers: this.items.map(layer => ({
        shapes: layer.items.map(shape => ({ type: shape.type, config: shape.config }))
      })),
      get json() {
        return JSON.stringify(this.layers);
      }
    };
  }

  constructor(config) {
    super('svg', config?.layers.sort((a, b) => a.order - b.order ? 1 : -1));
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
    }, layer?.order || this.items.length);
  }

  replaceOrder(source, target) {
    if (source === target) return;

    const sourceLayer = this.items.find(x => x.order === source);
    const targetLayer = this.items.find(x => x.order === target);

    const IS_POSITIVE = sourceLayer.order > target
    const MIN = Math.min(sourceLayer.order, target);
    const MAX = Math.max(sourceLayer.order, target);
    for (let i=0; i<this.items.length; i++) {
      if(between(this.items[i].order, MIN, MAX)) {
        this.items[i].updateOrder(
          this.items[i].order + (IS_POSITIVE ? 1 : -1)
        )
      }
    }
    sourceLayer.updateOrder(target);

    this.template.removeChild(sourceLayer.template);
    this.template.insertBefore(
      sourceLayer.template,
      targetLayer.template
    )
  }

  setListener() {
    this.template.addEventListener(
      'click',
      (evt) => {
        if (evt.target.hasAttribute(RESIZABLE_POINT_ATTRIBUTE)) {
          return;
        }
        const resizableContainer = this.template.getElementById(RESIZABLE_CONTAINER_ID)
        if (resizableContainer) this.template.removeChild(resizableContainer);
      },
      true
    )
  }
}
