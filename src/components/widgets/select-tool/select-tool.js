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
      this.template.appendChild(toolTemplate);
      toolTemplate.addEventListener('click', e => this.select(e, tool));
    });
  }

  select(e, tool) {
    this._select.next(tool.type);
  }
}
