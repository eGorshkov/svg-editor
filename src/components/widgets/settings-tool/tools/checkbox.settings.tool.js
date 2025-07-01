/**
 * Класс CheckboxTool — компонент чекбокса для панели настроек.
 */
export class CheckboxTool {
  template = document.createElement('label');

  get #checkbox() {
    return this.template.querySelector('input');
  }

  /**
   * Конструктор CheckboxTool.
   * @param {ISetting} config Конфиг настройки
   */
  constructor(config) {
    this.template = this.#create(config);
    config.currentValue && this.#checkbox.setAttribute('checked', '');
    this.#checkbox.addEventListener('change', x => config.cb(x));
  }

  /**
   * Приватный метод: создаёт шаблон чекбокса.
   * @private
   * @param {ISetting} config Конфиг настройки
   * @returns {HTMLElement} Элемент label
   */
  #create(config) {
    const label = document.createElement('label'),
      checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    label.innerText = config.label ?? '';
    label.classList.add('tool__item--checkbox', 'pointer');
    label.appendChild(checkbox);
    return label;
  }
}
