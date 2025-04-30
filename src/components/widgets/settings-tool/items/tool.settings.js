import PrototypeSettings from './prototype.settings.js';

export default class ToolSettings extends PrototypeSettings {
  constructor(item, config) {
    super(item, config);
  }

  createInformationBlock() {
    const containerTemplate = document.createElement('div');

    const label = document.createElement('p');
    label.innerText = `GRID SETTINGS`;
    containerTemplate.appendChild(label);

    let infoTemplate = this.getLabelElement();
    containerTemplate.appendChild(infoTemplate);

    return [containerTemplate];
  }

  getLabelElement() {
    return super.getLabelElement('getLabelElement>GRID');
  }
}
