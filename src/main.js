import { Editor } from './components/core/editor.js';
import { SelectTool } from './components/widgets/select-tool/select-tool.js';
import { compose } from './components/helpers/compose.js';
import { createCustomTemplate } from './components/helpers/custom-elements/custom-template.js';
import { MOCK_DEFAULT_LAYERS } from './mock/mock-default-layers.js';

compose(setEditor, setContainers, setUI)(MOCK_DEFAULT_LAYERS);

function setUI([main, editor, customTemplate, container, tools]) {
  //TODO remove
  const configTemplate = document.createElement('div');
  configTemplate.classList.add('editor__header');
  configTemplate.setAttribute('id', 'configJSON');
  setInterval(() => (configTemplate.innerText = editor.configuration.toJson()), 1000);
  configTemplate.innerText = editor.configuration.toJson();
  main.appendChild(configTemplate);
  //TODO

  container.appendChild(editor.template);
  container.appendChild(customTemplate);
  main.appendChild(container);
  tools.forEach(tool => main.appendChild(tool.template));
}

function setContainers(editor) {
  return [setMain(), editor, createCustomTemplate(), setContainer(), getTools(editor)];
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

function getTools(editor) {
  return [
    setSelectTool(editor),
    setSettingsTool(editor),
  ]
}

function setSelectTool(editor) {
  const selectTool = new SelectTool();
  selectTool.template.classList.add('editor__tool--left');
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

function setSettingsTool() {
  const template = document.createElement('aside');
  template.classList.add('editor__tool');
  template.classList.add('editor__tool--right');
  return {template};
}
