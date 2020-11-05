import { Subject } from '../../helpers/subject.js';

export class SelectTool {
  tools = [];
  _select = new Subject('hand');
  #TOOL_NAME = 'tool';
  constructor(tools) {
    this.tools = tools ?? [
      { type: 'select', icon: 'select' },
      { type: 'hand', icon: 'hand' },
      { type: 'triangle', icon: 'triangle' },
      { type: 'square', icon: 'square' },
      { type: 'circle', icon: 'circle' },
      { type: 'line', icon: 'line' }
    ];
  }

  get template() {
    const template = document.createElement('aside');
    template.classList.add('editor__tools');
    this.tools.forEach(tool => {
      const toolTemplate = document.createElement('button');
      toolTemplate.setAttribute('id', `${tool.type}-${this.#TOOL_NAME}`);
      toolTemplate.innerText = tool.icon;
      template.appendChild(toolTemplate);
      toolTemplate.addEventListener('click', e => this.select(e, tool));
    });
    return template;
  }

  select(e, tool) {
    this._select.next(tool.type);
  }
}
