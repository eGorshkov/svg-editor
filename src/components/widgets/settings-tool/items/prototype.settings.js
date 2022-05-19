import { SETTINGS_TOOLS } from '../tools/base.js';

export default class PrototypeSettings {
  #item = null;
  get item() {
    return this.#item;
  }

  #config = null;
  get config() {
    return this.#config;
  }

  constructor(item, config) {
    this.#item = item;
    this.#config = config || [];
  }

  createInformationBlock() {
    const containerTemplate = document.createElement('div');
    containerTemplate.style.display = 'flex';
    containerTemplate.style.alignItems = 'center';

    const infoTemplate = document.createElement('p');
    infoTemplate.innerText = this.getLabelElement();
    containerTemplate.appendChild(infoTemplate);

    const addOrderTemplate = document.createElement('button');
    addOrderTemplate.innerText = '+';
    addOrderTemplate.addEventListener('click', () => {
      this.item.parent.replaceOrder(this.item.order, this.item.order + 1);
      infoTemplate.innerText = this.getLabelElement();
    });
    containerTemplate.appendChild(addOrderTemplate);

    const removeOrderTemplate = document.createElement('button');
    removeOrderTemplate.innerText = '-';
    removeOrderTemplate.addEventListener('click', () => {
      this.item.parent.replaceOrder(this.item.order, this.item.order - 1);
      infoTemplate.innerText = this.getLabelElement();
    });
    containerTemplate.appendChild(removeOrderTemplate);

    return [containerTemplate];
  }

  createParametersBlock() {
    return this.config.map(tool => {
      const settingsTool = this.#create(tool);
      settingsTool.template.classList.add('tool__item');
      return settingsTool.template;
    });
  }

  getLabelElement() {
    return '';
  }

  /**
   *
   * @param config {ISetting}
   */
  #create(config) {
    return new SETTINGS_TOOLS[config.type](config);
  }
}