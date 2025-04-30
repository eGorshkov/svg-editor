export class ListTool {
  template = document.createElement('label');

  get #select() {
    return this.template.querySelector('select');
  }

  /**
   *
   * @param config {ISetting}
   */
  constructor(config) {
    this.template = this.#create(config);
    this.#select.value = config.currentValue;
    this.#select.addEventListener('change', x => config.cb(x));
  }

  /**
   *
   * @param config {ISetting}
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
