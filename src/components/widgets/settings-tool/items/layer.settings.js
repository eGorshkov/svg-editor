import PrototypeSettings from './prototype.settings.js';

export default class LayerSettings extends PrototypeSettings {
  constructor(item) {
    super(item);
  }

  createInformationBlock() {
    return [...super.createInformationBlock()];
  }

  getLabelElement() {
    const { parent, order } = this.item;
    return super.getLabelElement((parent.isLayer ? 'Parent Layer: ' : '') + `Order: ${order}`);
  }
}
