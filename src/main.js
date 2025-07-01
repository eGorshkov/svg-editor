/**
 * Точка входа приложения SVG-редактора.
 * @module main
 */

import compose from './components/helpers/compose.js';
import { MOCK_DEFAULT_LAYERS } from './mock/mock-default-layers.js';
import { createCommon, createEditor, createTemplates, createUI } from './creator.js';

/**
 * Импортирует compose и функции инициализации редактора.
 * Запускает редактор с моковыми слоями.
 */
compose(createCommon, createEditor, createTemplates, createUI)(MOCK_DEFAULT_LAYERS);
