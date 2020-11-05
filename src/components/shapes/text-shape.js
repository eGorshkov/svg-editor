import { ShapeCreator } from '../helpers/shape-creator.js';
import { getCustomTemplate, restoreCustomTemplate } from '../helpers/custom-elements/custom-template.js';
import { Resizer } from '../helpers/resizable/resizer.js';
/**
 *
 * @param template
 * @param config
 */
function textDraw(template, config) {
  template.setAttributeNS(null, 'x', config.x);
  template.setAttributeNS(null, 'y', config.y);
  template.setAttributeNS(null, 'width', config.width);
  template.setAttributeNS(null, 'height', config.height);
  template.textContent = config.value;
}

/**
 *
 * @param shapeCtx { IShape }
 * @param pointId { IResizablePointType }
 * @param event {Event}
 */
function textResize(shapeCtx, pointId, event) {
  shapeCtx.template.classList.toggle('editor__text-element--moved', event.type === 'mousemove');
  Resizer.defaultStrategy(shapeCtx.config, shapeCtx.resizable.points[pointId], pointId)
}

function listenTextTemplate(template, config) {
  template.addEventListener('dblclick', (e) => {
    e.preventDefault();
    callContentValue(template, config, textDraw)
  });
}

function callContentValue(template, config, cb) {
  template.innerHTML = '';

  const customTemplate = getCustomTemplate();
  setAttributesToCustomTemplate(customTemplate, config, template.getBBox());

  function callBackListener(e) {
    if (e.type === 'blur' || e.key === 'Escape' || (e.key === 'Enter' && e.ctrlKey)) {
      config.value = e.target.outerText;
      cb(template, config);
      restoreCustomTemplate();
      customTemplate.removeEventListener('keydown', callBackListener)
      customTemplate.removeEventListener('blur', callBackListener)
    }
  }
  customTemplate.addEventListener('keydown', callBackListener);
  customTemplate.addEventListener('blur', callBackListener);

  setTimeout(() => customTemplate.focus());
}

function setAttributesToCustomTemplate(template, config, points) {
  template.setAttribute('contenteditable', 'true');
  template.classList.add('editor__text-element');
  template.style.left = points.x + 'px';
  template.style.top = points.y + 'px';
  template.style.minWidth = points.width + 'px';
  template.style.minHeight = points.height + 'px';
  template.innerText = config.value;
}

export function TextShape(config) {
  const [template] = ShapeCreator('foreignObject', config);
  listenTextTemplate(template, config);
  config.value = config.value ?? 'Text';
  template.classList.add('editor__text-element');
  return [template, config, textDraw, textResize];
}
