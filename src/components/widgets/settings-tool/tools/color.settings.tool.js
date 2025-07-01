/**
 * Класс ColorTool — компонент выбора цвета для панели настроек.
 */
export class ColorTool {
  template = document.createElement('label');

  get #color() {
    return this.template.querySelector('input');
  }

  /**
   * Конструктор ColorTool.
   * @param {ISetting} config Конфиг настройки
   */
  constructor(config) {
    this.template = this.#create(config);
    this.#color.value = config.currentValue ?? '#000000';
    this.#color.addEventListener('change', x => config.cb(x));
    this.#color.addEventListener('input', x => config.cb(x));
  }

  /**
   * Приватный метод: создаёт шаблон выбора цвета.
   * @private
   * @param {ISetting} config Конфиг настройки
   * @returns {HTMLElement} Элемент label
   */
  #create(config) {
    const label = document.createElement('label'),
      color = document.createElement('input');
    color.type = 'color';
    label.innerText = config.label ?? '';
    label.classList.add('tool__item--color', 'pointer');
    label.appendChild(color);
    return label;
  }
}
