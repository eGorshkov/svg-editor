import { createCustomTemplate } from './components/helpers/custom-elements/custom-template.js';
import { Editor } from './components/core/editor.js';
import { SelectTool } from './components/widgets/select-tool/select-tool.js';
import { SettingsTool } from './components/widgets/settings-tool/settings-tool.js';
import { LayerTool } from './components/widgets/layer-tool/layer-tool.js';
import { Subject } from './components/helpers/custom-rx/subject.js';
import LinkStore from './components/stores/link.store.js';

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

  [getCopyConfigurationButton(editor), getExportButton(editor), getLinkForm(editor)].forEach(template =>
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

  globalThis.LINK_STORE = new LinkStore(editor);
  globalThis.LINK_STORE.init();

  return [createMain(), createContainers(editor), createTools(editor)];
}

function createEditor(config) {
  globalThis.SETTINGS_TOOL_SUBJECT = new Subject(null, false);
  globalThis.ACTIVE_ITEM_SUBJECT = new Subject(null, false);

  globalThis.LINK = {
    set: new Subject(null, false),
    update: new Subject(null, false),
    remove: new Subject(null, false),
  }

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
function getLinkForm(editor) {

  const form = document.createElement('form'),
    btn = document.createElement('button'),
    clearBtn = document.createElement('button'),
    input = document.createElement('input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startPoint = e.target.children.start.value;

    for (const layer of editor.items) {
      layer.items.forEach(shape => {
        shape.link = shape.linking(shape);
        shape.link.templates.forEach(t => shape.parent.template.appendChild(t));
      })
    }

    const rootShape = editor.items[0].items[0];

    for (let i = 1; i < editor.items.length; i++) {
      const nextShape = editor.items[i].items[0];
      ['w', 'e', 's', 'n'].forEach(next => {
        rootShape.setLink(startPoint);
        nextShape.setLink(next);
      })
    }
  })

  btn.innerText = 'Link';
  btn.type = 'submit';

  clearBtn.innerText = 'Clear';
  clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ids = editor.linker.links.map(x => x.id);
    ids.forEach(id => editor.linker.killLinkById(id));
  })

  input.setAttribute('name', 'start');
  input.value = 'e';

  form.appendChild(input);
  form.appendChild(btn);
  form.appendChild(clearBtn);

  return form;
}

/**
 *
 * @param {Editor} editor
 * @returns {void}
 */
function handleExport(editor) {
  function changeValue(el, x, y) {
    // [...el.children].forEach(child => {
    //   child.hasAttribute('x') && child.setAttribute('x', +child.getAttribute('x') - x);
    //   child.hasAttribute('y') && child.setAttribute('y', +child.getAttribute('y') - y);
    //   if (child.children.length) changeValue(child, x, y);
    // })
    return el;
  }

  function createBlob(clone, _w, _h) {
    return new Blob(
      [
        `<svg title="graph" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(_w)} ${Math.ceil(_h)}">`,
        `<style>.editor__text-element {white-space: pre; text-align: center;}</style>`,
        clone.innerHTML,
        '</svg>'
      ],
      { type: 'image/svg+xml;charset=utf-8' }
    );
  }

  return () => {
    const clone = editor.template.cloneNode(true);
    let _x, _y, _w, _h;
    _x = _y = Infinity;
    _w = _h = -Infinity;

    editor.items.forEach(item => {
      const { x, y, width, height } = item.template.getBBox();
      _x = Math.min(_x, x);
      _y = Math.min(_y, y);
      _w = Math.max(_w, x + width);
      _h = Math.max(_h, y + height);
    });

    changeValue(clone, _x - 50, _y - 50);

    const blob = createBlob(clone, _w, _h), url = URL.createObjectURL(blob), link = document.createElement('a');

    link.document = 'exported.svg';
    link.href = url;
    link.target = '__blank';
    link.click();
  };
}

export { createEditor, createTemplates, createUI };
