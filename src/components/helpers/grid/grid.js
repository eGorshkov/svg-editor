import { createTemplate } from '../shape-creator.js';

const GRID_TEMPLATE_ID = 'editor-grid-template';
const GRID_SETTINGS = 'grid-settings';

/**
 * Класс Grid для отображения и управления сеткой на редакторе.
 */
export default class Grid {
  /**
   * Конфигурация сетки.
   * @type {Object}
   */
  #config = localStorage.getItem(GRID_SETTINGS) ? JSON.parse(localStorage.getItem(GRID_SETTINGS)) : { visible: 'hidden', size: 8 };

  get config() {
    return this.#config;
  }

  /**
   * SVG-элемент сетки.
   * @type {SVGElement|null}
   */
  template = null;

  /**
   * Конструктор Grid.
   * @param {Object} config Конфигурация сетки
   */
  constructor() {
    this.template = createTemplate('svg');

    this.template.style = `
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
    `;

    this.template.id = GRID_TEMPLATE_ID;
    this.template.setAttribute('width', '100%');
    this.template.setAttribute('height', '100%');
    this.template.style.visibility = this.#config.visible;

    this.updateGridTemplate(this.config.size);
  }

  /**
   * Отрисовывает сетку.
   */
  updateGridTemplate(size = 8) {
    this.template.innerHTML = `
      <defs>
        <pattern id="smallGrid" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
          <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="gray" stroke-width="0.5"></path>
        </pattern>
        <pattern id="grid" width="${size * 10}" height="${size * 10}" patternUnits="userSpaceOnUse">
          <rect width="${size * 10}" height="${size * 10}" fill="url(#smallGrid)"></rect>
          <path d="M ${size * 10} 0 L 0 0 0 ${size * 10}" fill="none" stroke="gray" stroke-width="1"></path>
        </pattern>
      </defs>
          
      <rect width="100%" height="100%" fill="url(#grid)"></rect>
    `;

    this.updateSettings({size})
  }

  updateSettings(config) {
    this.#config = {
      ...this.#config,
      ...config
    };
    localStorage.setItem('grid-settings', JSON.stringify(this.#config));
  }
}