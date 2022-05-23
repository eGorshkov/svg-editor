import PrototypeSettings from './prototype.settings.js';

export default class LayerSettings extends PrototypeSettings {
  constructor(item) {
    super(item);
  }

  createInformationBlock() {
    return [...super.createInformationBlock()];
  }

  getLabelElement() {
    return (
      this.item.__type.toUpperCase() +
      (this.item.parent.isEditor ? '' : ' | Parent Layer: ' + this.item.parent.uniqueId) +
      ' | Order: ' +
      this.item.order
    );
  }
}