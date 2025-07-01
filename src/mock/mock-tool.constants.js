import { SHAPES_ALIAS } from '../components/shapes/base.js';

/**
 * Мок-константы для инструментов редактора.
 * @module mockToolConstants
 */

/**
 * Массив инструментов по умолчанию для панели выбора.
 * @type {Array}
 */
export const DEFAULT_SELECTS = [
  {
    alias: 'Сетка',
    el: 'input.checkbox',
    type: 'grid',
    meta: {
      check: () => globalThis.GRID.config.visible,
      settings: getGridSettings
    },
    separated: true
  },
  { alias: 'Слои', type: 'layers-widget', icon: 'layers', separated: true },
  {
    alias: 'Шейп',
    el: 'list',
    type: 'shape',
    meta: {
      data: Object.values(SHAPES_ALIAS).filter(alias => alias !== SHAPES_ALIAS.link)
    }
  }
];

/**
 * Возвращает настройки для сетки.
 * @returns {ISetting[]} config
 */
function getGridSettings() {
  return [
    { type: 'inputAsNumber', label: 'Grid size: ', currentValue: globalThis.GRID.config.size, cb: event => globalThis.GRID.updateGridTemplate(event.target.valueAsNumber) }
  ]
}
