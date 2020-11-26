import { createCustomTemplate } from './components/helpers/custom-elements/custom-template.js';
import { Editor } from './components/core/editor.js';
import { SelectTool } from './components/widgets/select-tool/select-tool.js';
import { SettingsTool } from './components/widgets/settings-tool/settings-tool.js';
import { Subject } from './components/helpers/custom-rx/subject.js';

//#region CREATORS

function createMain() {
  const main = document.getElementById('main');
  main.classList.add('editor');
  return main;
}

function createContainers(editor) {
  return [createHeader(editor), createContainer(editor)];
}

function createHeader(editor) {
  const headerContainer = document.createElement('div'),
    configurationButton = document.createElement('button');
  headerContainer.classList.add('editor__header');
  configurationButton.innerText = 'Copy configuration';
  configurationButton.addEventListener('click', e => navigator.clipboard.writeText(editor.configuration.toJson()));
  headerContainer.appendChild(configurationButton);
  return headerContainer;
}

function createContainer(editor) {
  const container = document.createElement('section'),
    customTemplate = createCustomTemplate();
  container.setAttribute('id', 'container');
  container.classList.add('editor__container');
  container.appendChild(editor.template);
  container.appendChild(customTemplate);
  return container;
}

function createTools(editor) {
  return [createSelectTool(editor), createSettingsTool(editor)];
}

function createSelectTool(editor) {
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

function createSettingsTool() {
  const settingsTool = new SettingsTool();
  settingsTool.template.classList.add('editor__tool--right');
  return settingsTool;
}

//#endregion

function createUI([main, containers, tools]) {
  containers.forEach(container => main.appendChild(container));
  tools.forEach(tool => main.appendChild(tool.template));
}

function createTemplates(editor) {
  globalThis.SETTINGS_TOOL_SUBJECT = new Subject(null, false);
  return [createMain(), createContainers(editor), createTools(editor)];
}

function createEditor(config) {
  return new Editor(config);
}

export { createEditor, createTemplates, createUI };
