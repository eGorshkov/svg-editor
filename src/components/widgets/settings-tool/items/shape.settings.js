import PrototypeSettings from './prototype.settings.js';

export default class ShapeSettings extends PrototypeSettings {
  constructor(item, config) {
    super(item, config);
  }

  getLabelElement() {
    return (
      this.item.__type.toUpperCase() +
      ' ' +
      this.item.type +
      ' | Parent Layer: ' +
      this.item.parent.uniqueId +
      ' | Order: ' +
      this.item.order
    );
  }
}