import { createCustomTemplate } from './components/helpers/custom-elements/custom-template.js';
import Grid from './components/helpers/grid/grid.js';
import { Editor } from './components/core/editor.js';
import { SelectTool } from './components/widgets/select-tool/select-tool.js';
import { SettingsTool } from './components/widgets/settings-tool/settings-tool.js';
import { LayerTool } from './components/widgets/layer-tool/layer-tool.js';
import { Subject } from './components/helpers/custom-rx/subject.js';
import LinkStore from './components/stores/link.store.js';

//#region CREATORS

/**
 * Создаёт основной элемент редактора.
 * @returns {HTMLElement} Главный элемент редактора
 */
function createMain() {
  const main = document.getElementById('main');
  main.classList.add('editor');
  return main;
}

/**
 * Создаёт контейнеры редактора (шапка и основная область).
 * @param {Editor} editor Экземпляр редактора
 * @returns {HTMLElement[]} Массив контейнеров
 */
function createContainers(editor) {
  return [createHeader(editor), createContainer(editor)];
}

/**
 * Создаёт шапку редактора с кнопками.
 * @param {Editor} editor Экземпляр редактора
 * @returns {HTMLElement} Элемент шапки
 */
function createHeader(editor) {
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('editor__header');

  [getCopyConfigurationButton(editor), getExportButton(editor)].forEach(template =>
    headerContainer.appendChild(template)
  );

  return headerContainer;
}

/**
 * Создаёт основной контейнер редактора.
 * @param {Editor} editor Экземпляр редактора
 * @returns {HTMLElement} Элемент контейнера
 */
function createContainer(editor) {
  const container = document.createElement('section'),
    customTemplate = createCustomTemplate();
  container.setAttribute('id', 'container');
  container.classList.add('editor__container');
  container.appendChild(editor.template);
  container.appendChild(customTemplate);
  container.appendChild(globalThis.GRID.template);
  return container;
}

/**
 * Создаёт инструменты редактора.
 * @param {Editor} editor Экземпляр редактора
 * @returns {Array} Массив инструментов
 */
function createTools(editor) {
  const layerTool = new LayerTool(editor);
  return [layerTool, createSettingsTool(editor), createSelectTool(editor, layerTool)];
}

/**
 * Создаёт инструмент выбора.
 * @param {Editor} editor Экземпляр редактора
 * @param {LayerTool} layerTool Инструмент слоёв
 * @returns {SelectTool} Инструмент выбора
 */
function createSelectTool(editor, layerTool) {
  const selectTool = new SelectTool();
  selectTool.template.classList.add('editor__tool--left');
  selectTool._select.subscribe(tool => {
    switch (tool.type) {
      case 'hand':
      case 'select':
        break;
      case "grid":
        const el = document.getElementById("editor-grid-template");
        const value = globalThis.GRID.config.visible === "hidden";
        el.style.visibility = value ? 'visible' : 'hidden';
        globalThis.GRID.updateSettings({visible: el.style.visibility})
        break;
      case 'layers-widget':
        layerTool.change();
        break;
      case 'shape':
        const active = globalThis.ACTIVE_ITEM_SUBJECT.getValue();
        if (active) {
          const activeShape = active.isShape ? active : active.shapes[0];
          (active.isShape ? active.parent : active).add(tool.value, {
            x: activeShape.config.x + activeShape.config.width / 2,
            y: activeShape.config.y + activeShape.config.height / 2 
          })
          return;
        }
        editor.add(tool.value);
        break;
      default:
        break;
    }
  });
  return selectTool;
}

/**
 * Создаёт инструмент настроек.
 * @returns {SettingsTool} Инструмент настроек
 */
function createSettingsTool() {
  const settingsTool = new SettingsTool();
  settingsTool.template.classList.add('editor__tool--right');
  return settingsTool;
}

//#endregion

/**
 * Добавляет контейнеры и инструменты в основной элемент.
 * @param {[HTMLElement, HTMLElement[], Array]} param0 Массив с главным элементом, контейнерами и инструментами
 */
function createUI([main, containers, tools]) {
  containers.forEach(container => main.appendChild(container));
  tools.forEach(tool => main.appendChild(tool.template));
}

/**
 * Инициализирует глобальные переменные и создаёт шаблоны редактора.
 * @param {Editor} editor Экземпляр редактора
 * @returns {Array} Массив с главным элементом, контейнерами и инструментами
 */
function createTemplates(editor) {
  globalThis.EDITOR = editor;
  globalThis.LINK_STORE = new LinkStore(editor);
  globalThis.LINK_STORE.init();

  globalThis.EDITOR.init();

  return [createMain(), createContainers(editor), createTools(editor)];
}

/**
 * Добавляет метод toCapitalizeCase к String и возвращает конфиг.
 * @param {Object} config Конфигурация
 * @returns {Object} Конфигурация
 */
function createCommon(config) {
  String.prototype.toCapitalizeCase = function() {
    const [first, ...other] = this;
    return first.toUpperCase() + other.join('').toLocaleLowerCase();
  }
  return config;
}

/**
 * Создаёт экземпляр редактора и глобальные Subject.
 * @param {Object} config Конфигурация редактора
 * @returns {Editor} Экземпляр редактора
 */
function createEditor(config) {
  globalThis.SETTINGS_TOOL_SUBJECT = new Subject(null, false);
  globalThis.ACTIVE_ITEM_SUBJECT = new Subject(null, false);

  globalThis.GRID = new Grid();

  return new Editor(config);
}

/**
 * Кнопка копирования конфигурации редактора.
 * @param {Editor} editor Экземпляр редактора
 * @returns {HTMLElement} Кнопка
 */
function getCopyConfigurationButton(editor) {
  const configurationButton = document.createElement('button');

  configurationButton.innerText = 'Copy configuration';
  configurationButton.addEventListener('click', e => navigator.clipboard.writeText(editor.configuration.toJson()));

  return configurationButton;
}

/**
 * Кнопка экспорта SVG.
 * @param {Editor} editor Экземпляр редактора
 * @returns {HTMLElement} Кнопка
 */
function getExportButton(editor) {
  const exportButton = document.createElement('button');

  exportButton.innerText = 'Export as svg';
  exportButton.addEventListener('click', handleExport(editor));

  return exportButton;
}

/**
 * Обработчик экспорта SVG.
 * @param {Editor} editor Экземпляр редактора
 * @returns {Function} Функция-обработчик
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

export { createCommon, createEditor, createTemplates, createUI };
