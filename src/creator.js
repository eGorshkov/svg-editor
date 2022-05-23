import { createCustomTemplate } from './components/helpers/custom-elements/custom-template.js';
import { Editor } from './components/core/editor.js';
import { SelectTool } from './components/widgets/select-tool/select-tool.js';
import { SettingsTool } from './components/widgets/settings-tool/settings-tool.js';
import { LayerTool } from './components/widgets/layer-tool/layer-tool.js';
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

/**
 *
 * @param {Editor} editor
 * @returns
 */
function createHeader(editor) {
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('editor__header');

  [getCopyConfigurationButton(editor), getExportButton(editor), getLinkButton(editor)].forEach(template =>
    headerContainer.appendChild(template)
  );

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
  const layerTool = new LayerTool(editor);
  return [layerTool, createSettingsTool(editor), createSelectTool(editor, layerTool)];
}

/**
 *
 * @param {Editor} editor
 * @param {LayerTool} layerTool
 * @returns
 */
function createSelectTool(editor, layerTool) {
  const selectTool = new SelectTool();
  selectTool.template.classList.add('editor__tool--left');
  selectTool._select.subscribe(toolType => {
    switch (toolType) {
      case 'hand':
      case 'select':
        break;
      case 'layers-widget':
        layerTool.change();
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
  globalThis.EDITOR = editor;
  return [createMain(), createContainers(editor), createTools(editor)];
}

function createEditor(config) {
  globalThis.SETTINGS_TOOL_SUBJECT = new Subject(null, false);
  globalThis.ACTIVE_ITEM_SUBJECT = new Subject(null, false);
  globalThis.SET_TO_LINK = new Subject(null, false);
  globalThis.UPDATE_LINK = new Subject(null, false);
  return new Editor(config);
}

/**
 *
 * @param {Editor} editor
 * @returns {HTMLElement}
 */
function getCopyConfigurationButton(editor) {
  const configurationButton = document.createElement('button');

  configurationButton.innerText = 'Copy configuration';
  configurationButton.addEventListener('click', e => navigator.clipboard.writeText(editor.configuration.toJson()));

  return configurationButton;
}

/**
 *
 * @param {Editor} editor
 * @returns {HTMLElement}
 */
function getExportButton(editor) {
  const exportButton = document.createElement('button');

  exportButton.innerText = 'Export as svg';
  exportButton.addEventListener('click', handleExport(editor));

  return exportButton;
}

/**
 *
 * @param {Editor} editor
 * @returns {HTMLElement}
 */
function getLinkButton(editor) {
  const btn = document.createElement('button');

  btn.innerText = 'Link shapes';
  btn.addEventListener('click', () => {
    globalThis.SET_TO_LINK.next(['e', editor.items[0].items[0]]);
    globalThis.SET_TO_LINK.next(['e', editor.items[1].items[0]]);
  });

  return btn;
}

/**
 *
 * @param {Editor} editor
 * @returns {void}
 */
function handleExport(editor) {
  return () => {
    const data = editor.template.innerHTML;
    let _x, _y, _w, _h;
    _x = _y = Infinity;
    _w = _h = -Infinity;

    editor.items.forEach(item => {
      const { x, y, width, height } = item.template.getBoundingClientRect();
      _x = Math.min(_x, x);
      _y = Math.min(_y, y);
      _w = Math.max(_w, x + width);
      _h = Math.max(_h, y + height);
    });

    const blob = new Blob(
      [
        `<svg title="graph" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(_w)} ${Math.ceil(
          _h
        )}">`,
        `<style>.editor__text-element {white-space: pre; text-align: center;}</style>`,
        data,
        '</svg>'
      ],
      { type: 'image/svg+xml;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.document = 'exported.svg';
    link.href = url;
    link.target = '__blank';
    link.click();
  };
}

export { createEditor, createTemplates, createUI };
