import compose from '../helpers/compose.js';
import { defaultStrokeSetting, InputAsNumberChange } from '../helpers/settings-callback-functions.js';
import { ShapeCreator } from '../helpers/shape-creator.js';

function getPath(points) {
  return points.map(i => `${i.x},${i.y}`).join(' ');
}

/**
 *
 * @param {SVGAElement} template
 * @param config
 */
export function doorDraw(template, config) {
  template.setAttribute('fill', 'none');

  template.style.fill = 'none';
  template.style.stroke = config.stroke;
  template.style.strokeWidth = config.strokeWidth;
  template.style.strokeDasharray = config.strokeDasharray;

  const gridFieldInPx = globalThis.GRID?.config.size ? globalThis.GRID?.config.size*10 : config.width; 
  template.setAttribute('points', getPath([
      {x:config.x + gridFieldInPx,y:config.y},
      {x:config.x,y:config.y},
      {x:config.x + gridFieldInPx,y:config.y+gridFieldInPx}
  ]));
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
    },
    {
      type: 'list',
      label: "Ротация",
      currentValue: "S",
      options: ["N", "E", "S", "W"],
      cb: (value) => {
        debugger;
      }
    }
  ];
}

export function DoorShape(config) {
  config.stroke = 'black';
  config.strokeWidth = 3;
  config.strokeDashArray = 5;
  return ShapeCreator('polyline', config, doorDraw, null, squareSetting, null);
}
