import { createTemplate } from '../../helpers/shape-creator.js';

export class LayerTool {
  /**
   * @type {IEditor}
   */
  #editor = null;
  #isOpen = false;
  #TOOL_NAME = 'layer-tool';
  /**
   *
   * @type {HTMLElement}
   */
  template = document.createElement('aside');

  #bindedDragstart = this.#dragstartHandler.bind(this);
  #bindedDragover = this.#dragoverHandler.bind(this);
  #bindedDrop = this.#dropHandler.bind(this);

  constructor(editor) {
    this.#init();
    this.#editor = editor;
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
      this.#editor.items.forEach(item => mapper.set(item.order, this.#createItemTemplate(item)));
      [...mapper.entries()].sort().forEach(([_, t]) => this.template.appendChild(t));
    }
  }

  #dragstartHandler(ev) {
    ev.dataTransfer.dropEffect = 'copy';
    ev.dataTransfer.setData('text/plain', ev.target.getAttribute('order'));
  }

  #dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
  }

  #dropHandler(ev) {
    ev.preventDefault();
    const source = ev.dataTransfer.getData('text/plain');
    const target = ev.target.getAttribute('order');
    this.#editor.replaceOrder(+source, +target);
    this.draw();
  }

  #init() {
    this.template.classList.add('editor__tools');
    this.template.style.position = 'absolute';
    this.template.style.backgroundColor = '#fff';
    this.template.style.boxShadow = '0 0 2px rgb(0 0 0 / 30%)';
    this.template.style.width = '300px';
    this.template.style.top = '100%';
    this.template.style.left = '100%';
    this.template.style.transform = 'translate(-100%, -100%)';
    this.template.style.border = '1px dashed rgb(0 0 0 / 30%)';
    this.template.style.padding = '24px';
    this.template.style.visibility = 'hidden';
  }

  #createItemTemplate(item) {
    const itemTemplate = document.createElement('div');
    itemTemplate.innerText = item.layerId + ' order:' + item.order;
    itemTemplate.style.height = '50px';
    itemTemplate.style.border = '1px dashed';
    itemTemplate.setAttribute('draggable', 'true');
    itemTemplate.setAttribute('order', item.order);

    itemTemplate.addEventListener('dragstart', this.#bindedDragstart);
    itemTemplate.addEventListener('dragover', this.#bindedDragover);
    itemTemplate.addEventListener('drop', this.#bindedDrop);
    return itemTemplate;
  }

  #removeItemTemplate(child) {
    child.removeEventListener('dragstart', this.#bindedDragstart);
    child.removeEventListener('dragover', this.#bindedDragover);
    child.removeEventListener('drop', this.#bindedDrop);
    this.template.removeChild(child);
  }
}