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
    this.tools.forEach(tool => {
      const toolTemplate = document.createElement('button');
      toolTemplate.setAttribute('id', `${tool.type}-${this.#TOOL_NAME}`);
      toolTemplate.innerText = tool.alias;
      toolTemplate.addEventListener('click', e => this.select(e, tool));
      this.template.appendChild(toolTemplate);

      if (tool.separated) {
        const separateLine = document.createElement('hr');
        separateLine.style.width = '100%';
        this.template.appendChild(separateLine);
      }
    });
  }

  select(e, tool) {
    this._select.next(tool.type);
  }
}
