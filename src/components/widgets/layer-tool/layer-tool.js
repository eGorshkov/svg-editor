import LayerItem from './layer-item.js';

export class LayerTool {
  /**
   * @type {IEditor}
   */
  #editor = null;

  get editor() {
    return this.#editor;
  }

  #isOpen = false;
  #TOOL_NAME = 'layer-tool';
  #mapper = new Map();
  #mapperSelector = new Map();
  #prevMapperSelector = new Map();
  #items = new Map();
  /**
   *
   * @type {HTMLElement}
   */
  template = document.createElement('aside');

  constructor(editor) {
    this.#init();
    this.#editor = editor;
    this.editor.onChange.subscribe(changes => {
      changes && this.#isOpen && this.draw();
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

      this.editor.items.forEach(item => this.#createLayerList(item));
      [...this.#mapper.entries()].sort().forEach(([_, t]) => this.template.appendChild(t));
    }
  }

  #createLayerList(item) {
    const detailsEl = document.createElement('details');
    this.#prevMapperSelector.get(item.uniqueId) && detailsEl.setAttribute('open', '');
    const summaryEl = document.createElement('summary');
    summaryEl.style.listStyle = 'none';

    let timeout = null;
    const el = this.#createItemTemplate(item);
    el.addEventListener('click', ev => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (ev.detail === 1) {
          detailsEl.open = !this.#mapperSelector.get(item.uniqueId);
          this.#mapperSelector.set(item.uniqueId, !this.#mapperSelector.get(item.uniqueId));
        }
      }, 200);
    });

    summaryEl.appendChild(el);
    detailsEl.appendChild(summaryEl);

    item.items
      ?.sort((a, b) => a.order - b.order)
      .forEach(child => {
        const childEl = child.__type === 'layer' ? this.#createLayerList(child) : this.#createItemTemplate(child);
        detailsEl.appendChild(childEl);
      });

    if (item.level === 1) this.#mapper.set(item.order, detailsEl);
    this.#mapperSelector.set(item.uniqueId, this.#prevMapperSelector.get(item.uniqueId) || false);

    return detailsEl;
  }

  #init() {
    this.template.classList.add('editor__tool', 'layer-tool-container');
    this.template.style.visibility = 'hidden';
  }

  /**
   *
   * @param {ILayer | IShape} item
   * @returns
   */
  #createItemTemplate(item) {
    this.#items.set(item.uniqueId, new LayerItem(item, this));
    if (item.active) {
      this.#items.get(item.uniqueId)?.template.classList.add('layer-tool-item__active');
      let p = item.parent;

      while (!p.isEditor) {
        this.#items.get(p.uniqueId)?.template.classList.add('layer-tool-item__active-parent');
        p = p.parent;
      }
    }

    return this.#items.get(item.uniqueId)?.template;
  }

  #removeItemTemplate(item) {
    this.#items.get(item.uniqueId)?.kill();
    this.template.removeChild(item);
  }
}