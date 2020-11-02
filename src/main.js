import { Editor } from './components/core/editor.js';
import { SelectTool } from './components/widgets/select-tool/select-tool.js';
import {compose} from './components/helpers/compose.js'

(compose(setEditor, setContainers, setUI))({
  layers: [
    {
      shapes: [
        {
          type: 'circle',
          config: {
            x: 500,
            y: 200,
            width: 200,
            height: 200,
            stroke: '#3fa300'
          }
        }
      ]
    },
    {
      shapes: [
        {
          type: 'square',
          config: {
            x: 400,
            y: 400,
            width: 200,
            height: 200,
            stroke: 'red'
          }
        }
      ]
    },
    {
      shapes: [
        {
          type: 'triangle',
          config: {
            x: 250,
            y: 500,
            width: 100,
            height: 200,
            stroke: 'tomato'
          }
        }
      ]
    }
  ]
});

function setUI([main, editor, container, selectTool]) {
  //TODO remove
  const configTemplate = document.createElement('span');
  configTemplate.setAttribute('id', 'configJSON')
  main.appendChild(configTemplate);
  //TODO

  container.appendChild(editor.template);
  main.appendChild(container);
  main.appendChild(selectTool.template);
}

function setContainers(editor) {
  return [setMain(), editor, setContainer(), setSelectTool(editor)];
}

function setEditor(config) {
  return new Editor(config)
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
