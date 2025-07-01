import PrototypeSettings from './prototype.settings.js';

/**
 * Класс ToolSettings — настройки для инструментов.
 * @extends PrototypeSettings
 */
export default class ToolSettings extends PrototypeSettings {
  /**
   * Конструктор ToolSettings.
   * @param {Object} item Инструмент
   * @param {ISetting[]} config Массив настроек
   */
  constructor(item, config) {
    super(item, config);
  }

  /**
   * Создаёт информационный блок для инструмента.
   * @returns {Array} Массив элементов
   */
  createInformationBlock() {
    const containerTemplate = document.createElement('div');

    const label = document.createElement('p');
    label.innerText = `GRID SETTINGS`;
    containerTemplate.appendChild(label);

    let infoTemplate = this.getLabelElement();
    containerTemplate.appendChild(infoTemplate);

    return [containerTemplate];
  }

  /**
   * Получает элемент с подписью для инструмента.
   * @returns {HTMLElement} Элемент label
   */
  getLabelElement() {
    return super.getLabelElement('getLabelElement>GRID');
  }
}
