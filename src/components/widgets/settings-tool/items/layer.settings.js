import PrototypeSettings from './prototype.settings.js';

/**
 * Класс LayerSettings — настройки для слоя.
 * @extends PrototypeSettings
 */
export default class LayerSettings extends PrototypeSettings {
  /**
   * Конструктор LayerSettings.
   * @param {ILayer} item Слой
   */
  constructor(item) {
    super(item);
  }

  /**
   * Создаёт информационный блок для слоя.
   * @returns {Array} Массив элементов
   */
  createInformationBlock() {
    return [...super.createInformationBlock()];
  }

  /**
   * Получает элемент с подписью для слоя.
   * @returns {HTMLElement} Элемент label
   */
  getLabelElement() {
    const { parent, order } = this.item;
    return super.getLabelElement((parent.isLayer ? 'Parent Layer: ' : '') + `Order: ${order}`);
  }
}
