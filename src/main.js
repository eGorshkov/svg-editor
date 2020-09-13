import { Editor } from './components/editor.js';
import { SelectTool } from './components/widgets/select-tool/select-tool.js';

((config) => {
  const [main, editor, container, selectTool] = setContainers(config);

  //TODO remove
  const configTemplate = document.createElement('span');
  configTemplate.setAttribute('id', 'configJSON');
  main.appendChild(configTemplate);

  container.appendChild(editor.template);
  main.appendChild(container);
  main.appendChild(selectTool.template);
})({
  layers: [
    {
      shapes: [
        {
          type: 'circle',
          config: {
            x: 100,
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
            y: 200,
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

function setContainers(config) {
  const editor = new Editor(config);
  return [setMain(), editor, setContainer(), setSelectTool(editor)];
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
  selectTool._select = toolType => {
    switch (toolType) {
      case 'hand':
      case 'select':
        break;
      default:
        editor.add(toolType);
        break;
    }
  };
  return selectTool;
}
