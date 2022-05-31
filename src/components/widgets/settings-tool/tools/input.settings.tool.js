export class InputTool {
  template = document.createElement('label');

  get #input() {
    return this.template.querySelector('input');
  }

  /**
   *
   * @param config {ISetting}
   */
  constructor(config) {
    this.template = this.#create(config);
    this.#input.value = config.currentValue ?? '';
    this.#input.addEventListener('input', x => config.cb(x));
  }

  /**
   *
   * @param config {ISetting}
   */
  #create(config) {
    const label = document.createElement('label'),
      input = document.createElement('input');
    label.innerText = config.label ?? '';
    label.classList.add('tool__item--input', 'pointer');
    label.appendChild(input);
    return label;
  }
}

export class InputNumberTool extends InputTool {
  get #input() {
    return this.template.querySelector('input');
  }

  constructor(config) {
    super(config);
    this.#input.type = 'number';
  }
}
