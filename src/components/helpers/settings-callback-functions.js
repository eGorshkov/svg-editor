/**
 *
 * @param shapeCtx {IShape}
 */
export function defaultStrokeSetting(shapeCtx) {
  return {
    type: 'color',
    label: 'Stroke: ',
    currentValue: shapeCtx.config.stroke,
    cb: ColorChange(shapeCtx, 'stroke')
  };
}
/**
 *
 * @param shapeCtx {IShape}
 */
export function defaultFillSetting(shapeCtx) {
  return { type: 'color', label: 'Fill: ', currentValue: shapeCtx.config.fill, cb: ColorChange(shapeCtx, 'fill') };
}
/**
 *
 * @param shapeCtx {IShape}
 */
export function defaultColorSetting(shapeCtx) {
  return {
    type: 'color',
    label: 'Text color: ',
    currentValue: shapeCtx.config.color,
    cb: ColorChange(shapeCtx, 'color')
  };
}

function ColorChange(shapeCtx, key) {
  return ({ target }) => {
    shapeCtx.template.style[key] = shapeCtx.config[key] = target.value;
  };
}

export function InputAsNumberChange(shapeCtx, key) {
  return ({ target }) => {
    shapeCtx.config[key] = target.valueAsNumber ?? 0;
    shapeCtx.draw(shapeCtx.template, shapeCtx.config);
  };
}
