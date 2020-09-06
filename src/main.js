import { Editor } from "./components/editor.js";
import { SelectTool } from "./components/widgets/select-tool/select-tool.js";

(() => {
  const [main, editor, container, selectTool] = setContainers();
  container.appendChild(editor.template);
  main.appendChild(container);
  main.appendChild(selectTool.template);
})();

function setContainers() {
  const editor = new Editor();
  return [setMain(), editor, setContainer(), setSelectTool(editor)];
}

function setMain() {
  const main = document.getElementById("main");
  main.classList.add("editor");
  return main;
}

function setContainer() {
  const container = document.createElement("section");
  container.setAttribute("id", "container");
  container.classList.add("editor__container");
  return container;
}

function setSelectTool(editor) {
  const selectTool = new SelectTool();
  selectTool.select = (e, tool) => {
    switch (tool.type) {
      case "hand":
      case "select":
        break;
      default:
        editor.add(tool.type);
        break;
    }
  };
  return selectTool;
}
