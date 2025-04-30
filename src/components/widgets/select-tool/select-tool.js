import { Subject } from '../../helpers/custom-rx/subject.js';
import { DEFAULT_SELECTS } from '../../../mock/mock-tool.constants.js';

export class SelectTool {
  tools = [];
  _select = new Subject('hand');
  template = document.createElement('aside');
  #TOOL_NAME = 'tool';
  constructor(tools) {
    this.tools = tools ?? DEFAULT_SELECTS;
    this.createTools();
  }

  createTools() {
    this.template.classList.add('editor__tool');
    this.tools.forEach(tool => this.createToolElement(tool));
  }

  createToolElement(tool) {
    let toolTemplate;
    const [tag, type] = (tool.el??"").split('.');
    const id = `${tool.type}-${this.#TOOL_NAME}`;
    switch(tag) {
      case "input":
        const inputEl = document.createElement("input");
        const inputId = id+'-input';

        toolTemplate = document.createElement("label");
        toolTemplate.setAttribute("for", inputId);
        toolTemplate.innerText = tool.alias

        inputEl.id = inputId;        
        inputEl.setAttribute("type", type ?? "text");

        if (type === "checkbox") {
          tool.check() && inputEl.setAttribute("checked", "");
          inputEl.addEventListener('change', e => this.select(e, tool));
        } else toolTemplate.addEventListener('click', e => this.select(e, tool));

        toolTemplate.appendChild(inputEl);
        break;
      default:
        toolTemplate = document.createElement("button");
        toolTemplate.innerText = tool.alias;
        toolTemplate.addEventListener('click', e => this.select(e, tool));
        break;
    }
    
    toolTemplate.id = id;

    if (tool.settings) {
      const settingsEl = document.createElement('button');
      settingsEl.innerText = '◯';
      settingsEl.addEventListener('click', e => {
        e.preventDefault();
        globalThis.SETTINGS_TOOL_SUBJECT.next({ item: tool, config: tool.settings() });
      })
      toolTemplate.appendChild(settingsEl);
    }

    this.template.appendChild(toolTemplate);

    if (tool.separated) {
      const separateLine = document.createElement('hr');
      separateLine.style.width = '100%';
      this.template.appendChild(separateLine);
    }
  }

  select(e, tool) {
    this._select.next(tool);
  }
}
