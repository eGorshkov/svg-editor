import { Editor } from './components/core/editor.js';
import { SelectTool } from './components/widgets/select-tool/select-tool.js';
import { compose } from './components/helpers/compose.js';
import { createCustomTemplate } from './components/helpers/custom-elements/custom-template.js';
import { MOCK_DEFAULT_LAYERS } from './mock/mock-default-layers.js';

compose(setEditor, setContainers, setUI)(MOCK_DEFAULT_LAYERS);

function setUI([main, editor, customTemplate, container, selectTool]) {
  //TODO remove
  const configTemplate = document.createElement('span');
  configTemplate.setAttribute('id', 'configJSON');
  setInterval(() => (configTemplate.innerText = editor.configuration.json), 1000);
  configTemplate.innerText = editor.configuration.json;
  main.appendChild(configTemplate);
  //TODO

  container.appendChild(editor.template);
  container.appendChild(customTemplate);
  main.appendChild(container);
  main.appendChild(selectTool.template);
}

function setContainers(editor) {
  return [setMain(), editor, createCustomTemplate(), setContainer(), setSelectTool(editor)];
}

function setEditor(config) {
  return new Editor(config);
}

function setMain() {
  const main = document.getElementById('main');
  main.classList.add('editor');
  return main;
}

function setContainer() {
  const container = document.createElement('section');
  container.setAttribute('id', 'container');
  container.classList.add('editor__container');
  return container;
}

function setSelectTool(editor) {
  const selectTool = new SelectTool();
  selectTool._select.subscribe(toolType => {
    switch (toolType) {
      case 'hand':
      case 'select':
        break;
      default:
        editor.add(toolType);
        break;
    }
  });
  return selectTool;
}
