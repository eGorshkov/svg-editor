import { SHAPES_ALIAS } from '../components/shapes/base.js';

export const DEFAULT_SELECTS = [
  {
    alias: 'Сетка',
    el: 'input.checkbox',
    type: 'grid',
    check: () => globalThis.GRID.config.visible,
    settings: getGridSettings,
    separated: true
  },
  { alias: 'Селект', type: 'select', value: 'select', icon: 'select' },
  { alias: 'Хэнд', type: 'hand', value: 'hand', icon: 'hand' },
  { alias: 'Слои', type: 'layers-widget', icon: 'layers', separated: true },
  ...Object.values(SHAPES_ALIAS)
    .filter(alias => alias !== SHAPES_ALIAS.link)
    .map(value => ({ alias: value.toUpperCase(), type: 'shape', value, icon: value }))
];

/**
 * @returns {ISetting[]} config
 */
function getGridSettings() {
  return [
    { type: 'inputAsNumber', label: 'Grid size: ', currentValue: globalThis.GRID.config.size, cb: event => globalThis.GRID.updateGridTemplate(event.target.valueAsNumber) }
  ]
}