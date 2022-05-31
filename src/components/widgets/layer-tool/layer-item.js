export default class LayerItem {
  template = null;
  /**
   * @type {ILayer | IShape}
   */
  #item = null;
  /**
   * @type {IEditor}
   */
  editor = null;
  #widget = null;

  #bindedDragstart = this.#dragstartHandler.bind(this);
  #bindedDragleave = this.#dragleaveHandler.bind(this);
  #bindedDragover = this.#dragoverHandler.bind(this);
  #bindedDrop = this.#dropHandler.bind(this);
  #bindedDblClick = this.dblClick.bind(this);

  draw = null;
  template = null;

  constructor(item, widget) {
    this.#item = item;
    this.#widget = widget;
    this.#init();
  }

  kill() {
    this.template.removeEventListener('dragstart', this.#bindedDragstart);
    this.template.removeEventListener('dragover', this.#bindedDragover);
    this.template.removeEventListener('drop', this.#bindedDrop);
    this.template.removeEventListener('dblclick', this.#bindedDblClick);
  }

  #init() {
    this.template = document.createElement('button');
    this.template.classList.add('layer-tool-item');

    this.template.setAttribute('draggable', 'true');
    this.template.setAttribute('type', this.#item.__type);
    this.template.setAttribute('order', this.#item.fullOrder);

    this.template.addEventListener('dragstart', this.#bindedDragstart);
    this.template.addEventListener('dragover', this.#bindedDragover);
    this.template.addEventListener('dragleave', this.#bindedDragleave);
    this.template.addEventListener('drop', this.#bindedDrop);
    this.template.addEventListener('dblclick', this.#bindedDblClick);

    this.#item.__type === 'layer' ? this.#setLayer() : this.#setShape();
    this.template.appendChild(this.#createKillButton());

    return this.template;
  }

  /**
   * @returns
   */
  #setLayer() {
    this.template.appendChild(
      this.#createTextElement('↳ Layer \norder:' + this.#item.fullOrder + '\nid: ' + this.#item.uniqueId)
    );
  }

  /**
   * @returns
   */
  #setShape() {
    this.template.appendChild(
      this.#createTextElement('Shape \norder: ' + this.#item.fullOrder + '\nid: ' + this.#item.uniqueId)
    );
  }

  #createTextElement(text) {
    const textEl = document.createElement('p');
    textEl.style.flex = '1';
    textEl.style.margin = '0';
    textEl.innerText = text;
    return textEl;
  }

  #createKillButton() {
    const killButton = document.createElement('button');
    killButton.classList.add('layer-tool-kill-button');
    killButton.innerText = '🗑';
    killButton.addEventListener('click', () => {
      this.#item.isShape ? this.#item.kill() : this.#item.killAll();
      this.#widget.draw();
    });
    return killButton;
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
        type: this.#getType(ev.target),
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
  }

  dblClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const type = this.#getType(ev.target);
    const orders = this.#splitOrderFromTemplate(ev.target);

    switch (type) {
      case 'shape':
      case 'layer':
        globalThis.ACTIVE_ITEM_SUBJECT.getValue()?.deactivate();
        this.#widget.editor.get(orders, 'order')?.activate();
        break;
      default:
        break;
    }
  }

  #replaceItems(sourceOrders, targetOrders) {
    const SOURCE = this.#widget.editor.get(sourceOrders, 'order');
    const TARGET = this.#widget.editor.get(targetOrders, 'order');

    if (!SOURCE || !TARGET) {
      console.error('Not found source or target item', { SOURCE, TARGET });
      return;
    }

    if (this.#isInSameLayer(sourceOrders, targetOrders)) {
      TARGET.parent.replaceOrder.call(TARGET.parent, ...sourceOrders, ...targetOrders);
    } else {
      const IS_SOURCE_SHAPE_WAS_ACTIVE = SOURCE.isShape && SOURCE.active;
      const PARENT_LAYER = TARGET.parent.isEditor ? TARGET : TARGET.parent;
      this.#changePosition(SOURCE, PARENT_LAYER, targetOrders[targetOrders.length - 1]);
      this.#reactivateShape(SOURCE, PARENT_LAYER, IS_SOURCE_SHAPE_WAS_ACTIVE);
    }
  }

  #isInSameLayer(sourceOrders, targetOrders) {
    return (
      sourceOrders.slice(0, sourceOrders.length - 1).toString() ===
      targetOrders.slice(0, targetOrders.length - 1).toString()
    );
  }

  #changePosition(source, parentLayer, targetLastOrder) {
    source.kill();
    source.order = parentLayer.items.length;

    parentLayer.load([source]);
    parentLayer.replaceOrder(parentLayer.items.length - 1, targetLastOrder);
  }

  #reactivateShape(source, parentLayer, isSourceShapeWasActive) {
    if (source.isLayer) {
      const ACTIVE_SHAPE = parentLayer.get(source.uniqueId)?.find(true, 'active');
      if (ACTIVE_SHAPE) {
        globalThis.ACTIVE_ITEM_SUBJECT.getValue()?.deactivate();
        ACTIVE_SHAPE.activate();
      }
    } else if (isSourceShapeWasActive) {
      parentLayer.get(source.uniqueId).activate();
    }
  }

  #getType(template) {
    if (!template.getAttribute('type')) return this.#getType(template.parentElement);
    return template.getAttribute('type');
  }

  #splitOrderFromTemplate(template) {
    if (!template.getAttribute('order')) return this.#splitOrderFromTemplate(template.parentElement);
    return template.getAttribute('order').split('-').map(Number);
  }
}
