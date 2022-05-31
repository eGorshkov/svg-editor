export class ListTool {
  template = document.createElement('label');

  get #color() {
    return this.template.querySelector('input');
  }

  /**
   *
   * @param config {ISetting}
   */
  constructor(config) {
    this.template = this.#create(config);
    this.#color.value = config.currentValue ?? '#000000';
    this.#color.addEventListener('change', x => config.cb(x));
    this.#color.addEventListener('input', x => config.cb(x));
  }

  /**
   *
   * @param config {ISetting}
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
