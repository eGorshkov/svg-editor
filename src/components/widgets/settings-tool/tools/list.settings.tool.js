/**
 * Класс ListTool — компонент выпадающего списка для панели настроек.
 */
export class ListTool {
  template = document.createElement('label');

  get #select() {
    return this.template.querySelector('select');
  }

  /**
   * Конструктор ListTool.
   * @param {ISetting} config Конфиг настройки
   */
  constructor(config) {
    this.template = this.#create(config);
    this.#select.value = config.currentValue;
    this.#select.addEventListener('change', x => config.cb(x));
  }

  /**
   * Приватный метод: создаёт шаблон select.
   * @private
   * @param {ISetting} config Конфиг настройки
   * @returns {HTMLElement} Элемент label
   */
  #create(config) {
    const label = document.createElement('label'),
      select = document.createElement('select');
    label.innerText = config.label ?? '';
    label.classList.add('tool__item--select', 'pointer');

    config.options?.forEach(option => {
      const optionEL = document.createElement('option');
      optionEL.value = optionEL.innerText = option;

      if (option === config.currentValue) optionEL.setAttribute('selected', '');

      select.appendChild(optionEL);
    });

    label.appendChild(select);
    return label;
  }
}
