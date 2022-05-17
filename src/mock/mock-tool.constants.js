import { SHAPES } from '../components/shapes/base.js';

export const DEFAULT_SELECTS = [
  { alias: 'Селект', type: 'select', value: 'select', icon: 'select' },
  { alias: 'Хэнд', type: 'hand', value: 'hand', icon: 'hand' },
  { alias: 'Слои', type: 'layers-widget', icon: 'layers' },
  ...Object.keys(SHAPES).map(value => ({ alias: value.toUpperCase(), type: value, value, icon: value }))
];
