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
  template.style.transformOrigin = '50% 50%';
  template.style.transformBox = 'fill-box';
  template.style.transform = Object.entries(config.transform ?? {}).reduce((acc, [fn, value]) => {
        switch (fn) {
           case 'rotate':
                acc += ' '.concat(`${fn}(${value}deg)`)
                break;
           default:
                break
        }
        return acc;
    }, "")
  
  const gridFieldInPx = globalThis.GRID?.config.size ? globalThis.GRID?.config.size*10 : config.width; 
  template.setAttribute('points', getPath([
      {x:config.x + gridFieldInPx,y:config.y},
      {x:config.x, y:config.y},
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
    { type: 'inputAsNumber', label: 'X: ', currentValue: shapeCtx.config.x, cb: InputAsNumberChange(shapeCtx, 'x') },
    { type: 'inputAsNumber', label: 'Y: ', currentValue: shapeCtx.config.y, cb: InputAsNumberChange(shapeCtx, 'y') },
    {
      type: 'inputAsNumber',
      label: 'Width: ',
      currentValue: shapeCtx.config.width,
      cb: InputAsNumberChange(shapeCtx, 'width')
    },
    {
      type: 'inputAsNumber',
      label: 'Height: ',
      currentValue: shapeCtx.config.height,
      cb: InputAsNumberChange(shapeCtx, 'height')
    },
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
      currentValue: "↑",
      options: ["↑", "→", "↓", "←"],
      cb: (e) => {
        switch (e.target.value) {
            case "↑": shapeCtx.config.transform.rotate = 0; break; 
            case "→": shapeCtx.config.transform.rotate = 90; break; 
            case "↓": shapeCtx.config.transform.rotate = 180; break;
            case "←": shapeCtx.config.transform.rotate = 270; break;
            default: break;
        }
        shapeCtx.draw(shapeCtx.template, shapeCtx.config);
      }
    }   
  ];
}

export function DoorShape(config) {
  config.stroke = 'black';
  config.strokeWidth = 3;
  config.strokeDasharray = 0;
  config.transform = {};
  return ShapeCreator('polyline', config, doorDraw, null, squareSetting, null);
}
