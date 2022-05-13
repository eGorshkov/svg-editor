import { map } from '../../helpers/custom-rx/map.js';
import { RESIZABLE_CONTAINER_ID } from '../../helpers/resizable/resizable.js';

export class LayerTool {
  /**
   * @type {IEditor}
   */
  #editor = null;
  #isOpen = false;
  #TOOL_NAME = 'layer-tool';
  #mapperSelector = new Map();
  /**
   *
   * @type {HTMLElement}
   */
  template = document.createElement('aside');

  #bindedDragstart = this.#dragstartHandler.bind(this);
  #bindedDragleave = this.#dragleaveHandler.bind(this);
  #bindedDragover = this.#dragoverHandler.bind(this);
  #bindedDrop = this.#dropHandler.bind(this);
  #bindedDblClick = this.#dblClick.bind(this);

  constructor(editor) {
    this.#init();
    this.#editor = editor;
    this.#editor.onChange.subscribe((isChanged) => {
      isChanged && this.#isOpen && this.draw();
    });
  }

  change() {
    this.#isOpen = !this.#isOpen;
    this.draw();
  }

  draw() {
    this.template.style.visibility = this.#isOpen ? '' : 'hidden';

    while (this.template.children.length) {
      this.#removeItemTemplate(this.template.firstChild);
    }

    if (this.#isOpen) {
      const mapper = new Map();
      this.#editor.items.forEach(item => {
        const detailsEl = document.createElement('details');
        this.#mapperSelector.get(item.layerId) && detailsEl.setAttribute('open', '');
        const summaryEl = document.createElement('summary');
        summaryEl.style.listStyle = 'none';
        summaryEl.addEventListener('click', () =>
          this.#mapperSelector.set(item.layerId, !this.#mapperSelector.get(item.layerId))
        );

        summaryEl.appendChild(this.#createItemTemplate(item, 'layer'));
        detailsEl.appendChild(summaryEl);
        item.shapes
          ?.sort((a, b) => a.order - b.order)
          .forEach((shape, i) => detailsEl.appendChild(this.#createItemTemplate(shape, 'shape')));

        mapper.set(item.order, detailsEl);
        this.#mapperSelector.set(item.layerId, this.#mapperSelector.get(item.layerId) || false);
      });
      [...mapper.entries()].sort().forEach(([_, t]) => this.template.appendChild(t));
    }
  }

  /**
   *
   * @param {DragEvent} ev
   */
  #dragstartHandler(ev) {
    ev.dataTransfer.dropEffect = 'copy';
    const [layerOrder, shapeOrder] = this.#splitOrderFromTemplate(ev.target);
    ev.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        type: ev.target.getAttribute('type'),
        layerOrder,
        shapeOrder
      })
    );
  }

  /**
   *
   * @param {DragEvent} ev
   */
  #dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
    ev.target.style.border = '1px solid tomato';
  }

  /**
   *
   * @param {DragEvent} ev
   */
  #dragleaveHandler(ev) {
    ev.preventDefault();
    ev.target.style.border = '1px dashed rgb(0 0 0 / 30%)';
  }

  /**
   *
   * @param {DragEvent} ev
   */
  #dropHandler(ev) {
    ev.preventDefault();
    const [targetLayerOrder, targetShapeOrder] = this.#splitOrderFromTemplate(ev.target);

    const source = JSON.parse(ev.dataTransfer.getData('text/plain'));

    if (source.type === 'layer') this.#editor.replaceOrder(+source.layerOrder, +targetLayerOrder);
    else if (source.type === 'shape')
      this.#shapeToShape(+source.layerOrder, +source.shapeOrder, +targetLayerOrder, +targetShapeOrder);

    this.draw();
  }
  
  #dblClick(ev) {
    ev.preventDefault();
    const type = ev.target.getAttribute('type');
    const orders = this.#splitOrderFromTemplate(ev.target);

    switch (type) {
      case 'shape':
        const active = globalThis.ACTIVE_ITEM_SUBJECT.getValue();
        active?.deactivate();
        const shape = this.#editor.get(orders, 'order');
        shape?.active();
        break;  
      default:
        break;
    }
  }

  #shapeToShape(sourceLayerOrder, sourceShapeOrder, targetLayerOrder, targetShapeOrder) {
    if (sourceLayerOrder === targetLayerOrder) {
      const LAYER = this.#editor.get(sourceLayerOrder, 'order');
      LAYER.replaceOrder(sourceShapeOrder, targetShapeOrder);
    } else {
      const SOURCE_LAYER = this.#editor.get(sourceLayerOrder, 'order');
      const TARGET_LAYER = this.#editor.get(targetLayerOrder, 'order');

      const SOURCE_SHAPE = SOURCE_LAYER.get(sourceShapeOrder, 'order');
      const SOURCE_SHAPE_WAS_ACTIVE = SOURCE_SHAPE._active;

      TARGET_LAYER.add(SOURCE_SHAPE.type, SOURCE_SHAPE.config);
      Number.isInteger(targetShapeOrder) && TARGET_LAYER.replaceOrder(TARGET_LAYER.shapes.length - 1, targetShapeOrder);

      SOURCE_SHAPE.kill();

      if (!SOURCE_LAYER.shapes.length) {
        SOURCE_LAYER.kill();
        this.#mapperSelector.delete(SOURCE_LAYER.layerId);
      }

      if (SOURCE_SHAPE_WAS_ACTIVE) {
        const NEW_SHAPE = TARGET_LAYER.get(Number.isInteger(targetShapeOrder) ? targetShapeOrder : (TARGET_LAYER.shapes.length - 1), 'order');
        SOURCE_SHAPE_WAS_ACTIVE && NEW_SHAPE.active();
      }
    }
  }

  #init() {
    this.template.classList.add('editor__tools');
    this.template.style.position = 'absolute';
    this.template.style.backgroundColor = '#fff';
    this.template.style.boxShadow = '0 0 2px rgb(0 0 0 / 30%)';
    this.template.style.width = '200px';
    this.template.style.top = '100%';
    this.template.style.left = '0';
    this.template.style.transform = 'translate(-0, -100%)';
    this.template.style.border = '1px dashed rgb(0 0 0 / 30%)';
    this.template.style.padding = '24px';
    this.template.style.visibility = 'hidden';
    this.template.style.zIndex = 1;
  }

  /**
   *
   * @param {ILayer | IShape} item
   * @returns
   */
  #createItemTemplate(item) {
    const itemTemplate = document.createElement('div');
    itemTemplate.style.height = '50px';
    itemTemplate.style.border = '1px dashed';
    itemTemplate.setAttribute('draggable', 'true');
    itemTemplate.setAttribute('type', item.__type);

    itemTemplate.addEventListener('dragstart', this.#bindedDragstart);
    itemTemplate.addEventListener('dragover', this.#bindedDragover);
    itemTemplate.addEventListener('dragleave', this.#bindedDragleave);
    itemTemplate.addEventListener('drop', this.#bindedDrop);
    itemTemplate.addEventListener('dblclick', this.#bindedDblClick.bind(this));

    return item.__type === 'layer' ? this.#setLayer(item, itemTemplate) : this.#setShape(item, itemTemplate);
  }

  /**
   *
   * @param {ILayer} item
   * @param {HTMLElement} itemTemplate
   * @returns
   */
  #setLayer(item, itemTemplate) {
    itemTemplate.innerText = item.layerId + ' order:' + item.order;
    itemTemplate.setAttribute('order', item.order);
    
    if (item.shapes.some(x => x._active))
      itemTemplate.style.backgroundColor = 'lightgray';
    return itemTemplate;
  }

  /**
   *
   * @param {IShape} item
   * @param {HTMLElement} itemTemplate
   * @returns
   */
  #setShape(item, itemTemplate) {
    itemTemplate.style.width = '90%';
    itemTemplate.style.marginLeft = 'auto';
    if (item._active) itemTemplate.style.backgroundColor = 'lightgray';
    itemTemplate.innerText = item.shapeId + ' order:' + item.fullOrder;
    itemTemplate.setAttribute('order', item.fullOrder);

    return itemTemplate;
  }

  #removeItemTemplate(child) {
    child.removeEventListener('dragstart', this.#bindedDragstart);
    child.removeEventListener('dragover', this.#bindedDragover);
    child.removeEventListener('drop', this.#bindedDrop);
    child.removeEventListener('dblclick', this.#bindedDrop);
    this.template.removeChild(child);
  }

  #splitOrderFromTemplate(template) {
    return template.getAttribute('order').split('-').map(Number)
  }
}