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
    let toolTemplate = null;
    const [tag, type] = (tool.el??"").split('.');
    const id = `${tool.type}-${this.#TOOL_NAME}`;
    switch(tag) {
      case "input":
        toolTemplate = this.#initInput(tool, toolTemplate, id, type);
        break;
      case "list":
        toolTemplate = this.#initList(tool, toolTemplate, id, type);
        break;
      default:
        toolTemplate = document.createElement("button");
        toolTemplate.innerText = tool.alias;
        toolTemplate.addEventListener('click', e => this.select(e, tool));
        break;
    }
    
    toolTemplate.id = id;

    if (tool.meta?.settings) {
      const settingsEl = document.createElement('button');
      settingsEl.innerText = '◯';
      settingsEl.addEventListener('click', e => {
        e.preventDefault();
        globalThis.SETTINGS_TOOL_SUBJECT.next({ item: tool, config: tool.meta.settings() });
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

  #initInput(tool, toolTemplate, id, type) {
        const inputEl = document.createElement("input");
        const inputId = id+'-input';

        toolTemplate = document.createElement("label");
        toolTemplate.setAttribute("for", inputId);
        toolTemplate.innerText = tool.alias

        inputEl.id = inputId;        
        inputEl.setAttribute("type", type ?? "text");

        if (type === "checkbox") {
          tool.meta.check() && inputEl.setAttribute("checked", "");
          inputEl.addEventListener('change', e => this.select(e, tool));
        } else toolTemplate.addEventListener('click', e => this.select(e, tool));

        toolTemplate.appendChild(inputEl);
        return toolTemplate
  }
  
  #initList(tool, toolTemplate, id, type) {
    const select = document.createElement('select');
    const nullOptionEl = document.createElement('option');
    nullOptionEl.value = '';
    nullOptionEl.innerText = tool.alias;
    nullOptionEl.selected = true;
    nullOptionEl.disabled = true;
    nullOptionEl.hidden = true;
    select.appendChild(nullOptionEl);
    tool.meta?.data?.forEach(option => {
      const optionEL = document.createElement('option');
      optionEL.value = optionEL.innerText = option;
      select.appendChild(optionEL);
    });


    select.addEventListener('change', x => {
        const value = x.target.value;
        x.target.value = "";
        this.select(null, { type: "shape", value })
    });

    return select;
  }
  
  select(e, tool) {
    this._select.next(tool);
  }
}
