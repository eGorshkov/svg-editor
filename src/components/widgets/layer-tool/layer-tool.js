import { map } from '../../helpers/custom-rx/map.js';
import { RESIZABLE_CONTAINER_ID } from '../../helpers/resizable/resizable.js';

export class LayerTool {
  /**
   * @type {IEditor}
   */
  #editor = null;
  #isOpen = false;
  #TOOL_NAME = 'layer-tool';
  #mapper = new Map();
  #mapperSelector = new Map(); 
  #prevMapperSelector = new Map(); 
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
      this.#prevMapperSelector = new Map([...this.#mapperSelector.entries()]);
      this.#mapperSelector.clear();
      this.#mapper.clear();

      this.#editor.items.forEach(item => this.#createLayerList(item));
      [...this.#mapper.entries()].sort().forEach(([_, t]) => this.template.appendChild(t));
    }
  }

  #createLayerList(item) {
    const detailsEl = document.createElement('details');
    this.#prevMapperSelector.get(item.uniqueId) && detailsEl.setAttribute('open', '');
    const summaryEl = document.createElement('summary');
    summaryEl.style.listStyle = 'none';

    summaryEl.appendChild(this.#createItemTemplate(item));
    summaryEl.addEventListener('click', () => this.#mapperSelector.set(item.uniqueId, !this.#mapperSelector.get(item.uniqueId)));
    detailsEl.appendChild(summaryEl);

    item.items
      ?.sort((a, b) => a.order - b.order)
      .forEach(child =>  {
        const childEl = child.__type === 'layer' ? this.#createLayerList(child) : this.#createItemTemplate(child);
        detailsEl.appendChild(childEl);
      });


    if (item.level === 1) this.#mapper.set(item.order, detailsEl);
    this.#mapperSelector.set(item.uniqueId, this.#prevMapperSelector.get(item.uniqueId) || false);
    
    return detailsEl;
  }

  /**
   *
   * @param {DragEvent} ev
   */
  #dragstartHandler(ev) {
    ev.dataTransfer.dropEffect = 'copy';
    const orders = this.#splitOrderFromTemplate(ev.target);
    ev.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        type: ev.target.getAttribute('type'),
        orders
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
    const targetOrders = this.#splitOrderFromTemplate(ev.target);

    const source = JSON.parse(ev.dataTransfer.getData('text/plain'));
    this.#replaceItems(source.orders, targetOrders);

    this.draw();
  }

  #dblClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    console.log(ev);
    const type = ev.target.getAttribute('type');
    const orders = this.#splitOrderFromTemplate(ev.target);

    switch (type) {
      case 'shape':
        const active = globalThis.ACTIVE_ITEM_SUBJECT.getValue();
        active?.deactivate();
        const shape = this.#editor.get(orders, 'order');
        shape?.activate();
        break;  
      default:
        break;
    }
  }

  #replaceItems(sourceOrders, targetOrders) {
    const SOURCE = this.#editor.get(sourceOrders, 'order');
    const TARGET = this.#editor.get(targetOrders, 'order');

    if(!SOURCE || !TARGET) {
      conosle.error('Not found source or target item', {SOURCE, TARGET});
      return;
    }

    const IS_ORDERS_IN_SAME_LAYER = sourceOrders.splice(0, sourceOrders.length - 1).toString() === targetOrders.splice(0, targetOrders.length - 1).toString()

    if (IS_ORDERS_IN_SAME_LAYER) {
      TARGET.parent.replaceOrder.call(TARGET.parent, ...sourceOrders, ...targetOrders);
    } else {
      const SOURCE_IS_ACTIVE = SOURCE.isShape && SOURCE.active
      const TARGET_LAST_ORDER = targetOrders[targetOrders.length - 1];
      const LAYER = TARGET.__type === 'layer' ? TARGET : TARGET.parent;

      SOURCE.kill();
      SOURCE.order = LAYER.items.length;

      LAYER.load([SOURCE]);
      LAYER.items.length > 1 && LAYER.replaceOrder(LAYER.items.length - 1, IS_ORDERS_IN_SAME_LAYER ? 0 : TARGET_LAST_ORDER);

      SOURCE_IS_ACTIVE && LAYER.get(SOURCE.uniqueId).activate();
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
    itemTemplate.style.height = '30px';
    itemTemplate.style.border = '1px dashed';
    itemTemplate.style.width = 'calc(' + (100 - item.level * 5) + '% - 20px)';
    itemTemplate.style.marginLeft = 'auto';
    itemTemplate.style.padding ='10px';
    itemTemplate.setAttribute('draggable', 'true');
    itemTemplate.setAttribute('type', item.__type);
    itemTemplate.setAttribute('order', item.fullOrder);

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
    itemTemplate.innerText = '↳ Layer ' + item.uniqueId + ' order:' + item.fullOrder;
    if (this.#editor.activeUniqueIds.includes(item.uniqueId))
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
    if (item.active) itemTemplate.style.backgroundColor = 'lightgray';
    itemTemplate.innerText = 'Shape ' + item.uniqueId + ' order:' + item.fullOrder;

    return itemTemplate;
  }

  #removeItemTemplate(child) {
    child.removeEventListener('dragstart', this.#bindedDragstart);
    child.removeEventListener('dragover', this.#bindedDragover);
    child.removeEventListener('drop', this.#bindedDrop);
    child.removeEventListener('dblclick', this.#bindedDblClick);
    this.template.removeChild(child);
  }

  #splitOrderFromTemplate(template) {
    return template.getAttribute('order').split('-').map(Number)
  }
}