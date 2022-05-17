import { SETTINGS_TOOLS } from './tools/base.js';

export class SettingsTool {
  /**
   *
   * @type {HTMLElement}
   */
  template = document.createElement('aside');
  _select = globalThis.SETTINGS_TOOL_SUBJECT;
  _calls = 0;

  constructor() {
    this.template.classList.add('tool', 'editor__tool');
    this._select.subscribe(({ shape, settingsConfig } = {}) => this.changeTemplate(shape, settingsConfig));
  }

  /**
   * @param {IShape} shape
   * @param {ISetting[]} config
   */
  changeTemplate(shape, config) {
    this._calls++;
    console.log('---', 'SettingsToll call:', this._calls);
    while (this.template.children.length) this.template.removeChild(this.template.children[0]);

    if (!config?.length) {
      return;
    }

    const label = document.createElement('p');
    label.innerText = 'SETTINGS';
    this.template.appendChild(label);

    this.#createDefaultShapeSettings(shape);

    config.forEach(tool => {
      const _a = this.#create(tool);
      _a.template.classList.add('tool__item');
      this.template.appendChild(_a.template);
    });
  }

  /**
   *
   * @param {IShape} shape
   */
  #createDefaultShapeSettings(shape) {
    const containerTemplate = document.createElement('div');
    containerTemplate.style.display = 'flex';
    containerTemplate.style.alignItems = 'center';

    const infoTemplate = document.createElement('p');
    infoTemplate.innerText = 'Layer: ' + shape.layer.layerId + ' | Layer Order: ' + shape.order;
    containerTemplate.appendChild(infoTemplate);

    const addOrderTemplate = document.createElement('button');
    addOrderTemplate.innerText = '+';
    addOrderTemplate.addEventListener('click', () => {
      shape.layer.replaceOrder(shape.order, shape.order + 1);
      infoTemplate.innerText = 'Layer: ' + shape.layer.layerId + ' | Layer Order: ' + shape.order;
    });
    containerTemplate.appendChild(addOrderTemplate);

    const removeOrderTemplate = document.createElement('button');
    removeOrderTemplate.innerText = '-';
    removeOrderTemplate.addEventListener('click', () => {
      shape.layer.replaceOrder(shape.order, shape.order - 1);
      infoTemplate.innerText = 'Layer: ' + shape.layer.layerId + ' | Layer  Order: ' + shape.order;
    });
    containerTemplate.appendChild(removeOrderTemplate);

    this.template.appendChild(containerTemplate);
  }

  /**
   *
   * @param config {ISetting}
   */
  #create(config) {
    return new SETTINGS_TOOLS[config.type](config);
  }
}
