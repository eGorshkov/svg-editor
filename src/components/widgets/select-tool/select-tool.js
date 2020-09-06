export class SelectTool {
  tools = [];
  #TOOL_NAME = "tool";
  constructor(tools) {
    this.tools = tools ?? [
      { type: "select", icon: "select" },
      { type: "hand", icon: "hand" },
      { type: "triangle", icon: "triangle" },
      { type: "square", icon: "square" },
      { type: "circle", icon: "circle" },
    ];
  }

  get template() {
    const template = document.createElement("aside");
    template.classList.add("editor__tools");
    this.tools.forEach((tool) => {
      const toolTemplate = document.createElement("button");
      toolTemplate.setAttribute("id", `${tool.type}-${this.#TOOL_NAME}`);
      toolTemplate.innerText = tool.icon;
      template.appendChild(toolTemplate);
      toolTemplate.addEventListener("click", (e) => this.select(e, tool));
    });
    return template;
  }

  select(e, tool) {
    console.log("---", "#select", e, tool);
  }
}
