import { createTemplate, ShapeCreator } from '../helpers/shape-creator.js';
import { getCustomTemplate, restoreCustomTemplate } from '../helpers/custom-elements/custom-template.js';
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
  if (!pointId) return;
  shapeCtx.template.classList.toggle('editor__text-element--moved', event.type === 'mousemove');
  const point = shapeCtx.resizable.points[pointId];

  function set(pointKey, sizeKey, invert = false) {
    if (invert) {
      shapeCtx.config[sizeKey] = point[pointKey] - shapeCtx.config[pointKey];
    } else {
      shapeCtx.config[sizeKey] += shapeCtx.config[pointKey] - point[pointKey];
      shapeCtx.config[pointKey] -= shapeCtx.config[pointKey] - point[pointKey];
    }
  }

  switch (pointId) {
    case 'e':
      set('x', 'width', true);
      break;
    case 'w':
      set('x', 'width');
      break;
    case 's':
      set('y', 'height', true);
      break;
    case 'n':
      set('y', 'height');
      break;
    case 'nw':
      set('x', 'width');
      set('y', 'height');
      break;
    case 'ne':
      set('x', 'width', true);
      set('y', 'height');
      break;
    case 'se':
      set('x', 'width', true);
      set('y', 'height', true);
      break;
    case 'sw':
      set('x', 'width');
      set('y', 'height', true);
      break;
    default:
      break;
  }
}

function listenTextTemplate(template, config) {
  template.addEventListener('dblclick', () =>
    callContentValue(template, value => {
      config.value = value;
      textDraw(template, config);
    })
  );
}

function callContentValue(template, cb) {
  const custom = getCustomTemplate(),
    points = template.getBBox();
  custom.setAttribute('contenteditable', 'true');
  custom.classList.add('editor__text-element');
  custom.style.left = points.x + 'px';
  custom.style.top = points.y + 'px';
  custom.style.minWidth = points.width + 'px';
  custom.style.minHeight = points.height + 'px';
  custom.innerText = template.textContent;
  template.textContent = '';

  custom.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.ctrlKey) {
      cb(e.target.outerText);
      restoreCustomTemplate();
    }
  });

  setTimeout(() => custom.focus());
}

export function TextShape(config) {
  const [template] = ShapeCreator('foreignObject', config);
  listenTextTemplate(template, config);
  config.value = config.value ?? 'Text';
  template.classList.add('editor__text-element');
  return [template, config, textDraw, textResize];
}
