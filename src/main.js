import compose from './components/helpers/compose.js';
import { MOCK_DEFAULT_LAYERS } from './mock/mock-default-layers.js';
import { createEditor, createTemplates, createUI } from './creator.js';

compose(createEditor, createTemplates, createUI)(MOCK_DEFAULT_LAYERS);
