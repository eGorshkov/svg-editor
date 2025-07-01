const TEMPLATE_ID = 'editor-template-custom';

/**
 * Создаёт кастомный HTML шаблон для редактора.
 * @returns {HTMLDivElement} Элемент шаблона
 */
export function createCustomTemplate() {
  const element = document.createElement('div');
  element.id = TEMPLATE_ID;
  element.classList.add('editor__custom-template');
  return element;
}

/**
 * Получает кастомный шаблон по id.
 * @returns {HTMLElement|null} Элемент шаблона или null
 */
export function getCustomTemplate() {
  return document.getElementById(TEMPLATE_ID);
}

/**
 * Восстанавливает кастомный шаблон в родительском элементе.
 */
export function restoreCustomTemplate() {
  const element = getCustomTemplate(),
    parent = element.parentElement;
  parent.removeChild(element);
  parent.appendChild(createCustomTemplate());
}

/**
 * Создаёт SVG-элемент с заданными атрибутами.
 * @param {string} tagName Имя SVG-тега
 * @param {Object} [attrs={}] Атрибуты для установки
 * @returns {SVGElement} Созданный SVG-элемент
 */
export function customTemplate(tagName, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}
