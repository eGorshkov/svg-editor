import { ColorTool } from './color.settings.tool.js';
import { InputTool, InputNumberTool } from './input.settings.tool.js';
import { ListTool } from './list.settings.tool.js';
import { CheckboxTool } from './checkbox.settings.tool.js';

/**
 * Словарь инструментов настроек.
 * @type {Object}
 */
export const SETTINGS_TOOLS = {
  color: ColorTool,
  input: InputTool,
  inputAsNumber: InputNumberTool,
  list: ListTool,
  checkbox: CheckboxTool
};
