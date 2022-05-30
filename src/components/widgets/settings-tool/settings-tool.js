import LayerSettings from './items/layer.settings.js';
import PrototypeSettings from './items/prototype.settings.js';
import ShapeSettings from './items/shape.settings.js';

export class SettingsTool {
  /**
   *
   * @type {HTMLElement}
   */
  template = document.createElement('aside');
  _select = globalThis.SETTINGS_TOOL_SUBJECT;
  _calls = 0;
  settings = new PrototypeSettings();

  constructor() {
    this.template.classList.add('tool', 'editor__tool');
    this._select.subscribe(({ item, config } = {}) => this.changeTemplate(item, config));
  }

  /**
   * @param {IShape | isLayer} item
   * @param {ISetting[]} config
   */
  changeTemplate(item, config) {
    this._calls++;
    console.log('---', 'SettingsToll call:', this._calls);

    while (this.template.children.length) {
      this.template.removeChild(this.template.children[0]);
    }

    if (!item) return;

    const SettingsClass = item.isLayer ? LayerSettings : ShapeSettings;
    this.settings = new SettingsClass(item, config);

    [...this.settings.createInformationBlock(), this.settings.createParametersBlock()].forEach(t =>
      this.template.appendChild(t)
    );
  }
}
