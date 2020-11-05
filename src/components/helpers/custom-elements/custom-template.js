const TEMPLATE_ID = 'editor-template-custom';

/**
 *
 * @returns {HTMLDivElement}
 */
export function createCustomTemplate() {
  const element = document.createElement('div');
  element.id = TEMPLATE_ID;
  element.classList.add('editor__custom-template');
  return element;
}

export function getCustomTemplate() {
  return document.getElementById(TEMPLATE_ID);
}

export function restoreCustomTemplate() {
  const element = getCustomTemplate(),
    parent = element.parentElement;
  parent.removeChild(element);
  parent.appendChild(createCustomTemplate());
}
