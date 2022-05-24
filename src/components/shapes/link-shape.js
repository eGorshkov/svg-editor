import compose from '../helpers/compose.js';
import Linker from '../helpers/linker/linker.js';
import { ShapeCreator } from '../helpers/shape-creator.js';

function getAdditionalPoints(startProp, endProp, [_, start], [end]) {
  return Linker.getAdditionalPoints(startProp, endProp, start, end);
}

function getPoints(from, to) {
  const {type: fromType, shape: fromShape} = from,
    {type: toType, shape: toShape} = to,
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
  template.setAttribute('fill', 'none');

  template.style.fill = 'none';
  template.style.stroke = 'black';
  template.style.strokeWidth = 3;

  template.setAttribute('points', compose(getPoints, getPath)(config.from, config.to))
  return template;
}

export function LinkShape(config) {
  return ShapeCreator('polyline', config, linkDraw, null, null, null);
}
