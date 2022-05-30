import compose from '../helpers/compose.js';
import Linker from '../helpers/linker/linker.js';
import { defaultStrokeSetting, InputAsNumberChange } from '../helpers/settings-callback-functions.js';
import { ShapeCreator } from '../helpers/shape-creator.js';

function getAdditionalPoints(startProp, endProp, [_, start], [end]) {
  return Linker.getAdditionalPoints(startProp, endProp, start, end);
}

function getPoints(from, to) {
  const { type: fromType, shape: fromShape } = from,
    { type: toType, shape: toShape } = to,
    start = getCoords(fromType, fromShape),
    end = getCoords(toType, toShape).reverse();

  return [...start, ...getAdditionalPoints(fromType, toType, start, end), ...end];
}

function getCoords(type, shape) {
  return Linker.getCoords(type, shape.config, shape.type === 'circle');
}

function getPath(points) {
  return points.map(i => `${i.x},${i.y}`).join(' ');
}

/**
 *
 * @param {SVGAElement} template
 * @param config
 */
export function linkDraw(template, config) {
  template.setAttribute('fill', 'none');

  template.style.fill = 'none';
  template.style.stroke = config.stroke;
  template.style.strokeWidth = config.strokeWidth;
  template.style.strokeDasharray = config.strokeDasharray;

  template.setAttribute('points', compose(getPoints, getPath).call(null, config.from, config.to));
  return template;
}

/**
 *
 * @param shapeCtx { IShape }
 * @returns {ISetting[]}
 */
export function squareSetting(shapeCtx) {
  return [
    defaultStrokeSetting(shapeCtx),
    {
      type: 'inputAsNumber',
      label: 'Stroke width: ',
      currentValue: shapeCtx.config.strokeWidth,
      cb: InputAsNumberChange(shapeCtx, 'strokeWidth')
    },
    {
      type: 'inputAsNumber',
      label: 'Stroke dash-array: ',
      currentValue: shapeCtx.config.strokeDasharray,
      cb: InputAsNumberChange(shapeCtx, 'strokeDasharray')
    }
  ];
}

export function LinkShape(config) {
  config.stroke = 'black';
  config.strokeWidth = 3;
  config.strokeDashArray = 0;
  return ShapeCreator('polyline', config, linkDraw, null, squareSetting, null);
}
