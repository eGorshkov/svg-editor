/**
 * Класс InputTool — компонент текстового/числового поля для панели настроек.
 */
export class InputTool {
  template = document.createElement('label');

  get #input() {
    return this.template.querySelector('input');
  }

  /**
   * Конструктор InputTool.
   * @param {ISetting} config Конфиг настройки
   */
  constructor(config) {
    this.template = this.#create(config);
    this.#input.value = config.currentValue ?? '';
    this.#input.addEventListener('input', x => config.cb(x));
  }

  /**
   * Приватный метод: создаёт шаблон input.
   * @private
   * @param {ISetting} config Конфиг настройки
   * @returns {HTMLElement} Элемент label
   */
  #create(config) {
    const label = document.createElement('label'),
      input = document.createElement('input');
    label.innerText = config.label ?? '';
    label.classList.add('tool__item--input', 'pointer');
    input.setAttribute('step', config.step ?? 1);

    label.appendChild(input);
    return label;
  }
}

/**
 * Класс InputNumberTool — компонент числового поля для панели настроек.
 * @extends InputTool
 */
export class InputNumberTool extends InputTool {
  get #input() {
    return this.template.querySelector('input');
  }

  /**
   * Конструктор InputNumberTool.
   * @param {ISetting} config Конфиг настройки
   */
  constructor(config) {
    super(config);
    this.#input.type = 'number';
  }
}
