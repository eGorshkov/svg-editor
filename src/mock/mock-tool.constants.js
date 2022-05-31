import { SHAPES } from '../components/shapes/base.js';

export const DEFAULT_SELECTS = [
  { alias: 'Селект', type: 'select', value: 'select', icon: 'select' },
  { alias: 'Хэнд', type: 'hand', value: 'hand', icon: 'hand' },
  { alias: 'Слои', type: 'layers-widget', icon: 'layers', separated: true },
  ...Object.keys(SHAPES)
    .filter(key => key !== 'link')
    .map(value => ({ alias: value.toUpperCase(), type: value, value, icon: value }))
];
