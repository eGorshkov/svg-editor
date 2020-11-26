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
    this._select.subscribe(setting => this.changeTemplate(setting));
  }

  /**
   *
   * @param config {ISetting[]}
   */
  changeTemplate(config) {
    this._calls++;
    console.log('---', 'SettingsToll call:', this._calls);
    while (this.template.children.length) this.template.removeChild(this.template.children[0]);

    if (!config?.length) {
      return;
    }

    const label = document.createElement('p');
    label.innerText = 'SETTINGS';
    this.template.appendChild(label);

    config.forEach(tool => {
      const _a = this.#create(tool);
      _a.template.classList.add('tool__item');
      this.template.appendChild(_a.template);
    });
  }

  /**
   *
   * @param config {ISetting}
   */
  #create(config) {
    return new SETTINGS_TOOLS[config.type](config);
  }
}
