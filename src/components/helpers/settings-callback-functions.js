/**
 *
 * @param shapeCtx {IShape}
 */
export function defaultStrokeSetting(shapeCtx) {
  return { type: 'color', label: 'Stroke: ', currentValue: shapeCtx.config.stroke, cb: StrokeChange(shapeCtx) };
}
/**
 *
 * @param shapeCtx {IShape}
 */
export function defaultFillSetting(shapeCtx) {
  return { type: 'color', label: 'Fill: ', currentValue: shapeCtx.config.fill, cb: FillChange(shapeCtx) };
}
/**
 *
 * @param shapeCtx {IShape}
 */
export function defaultColorSetting(shapeCtx) {
  return { type: 'color', label: 'Text color: ', currentValue: shapeCtx.config.color, cb: ColorChange(shapeCtx) };
}

function ColorChange(shapeCtx) {
  return ({ target }) => {
    shapeCtx.template.style.color = shapeCtx.config.color = target.value;
  };
}

function StrokeChange(shapeCtx) {
  return ({ target }) => {
    shapeCtx.template.style.stroke = shapeCtx.config.stroke = target.value;
  };
}

function FillChange(shapeCtx) {
  return ({ target }) => {
    shapeCtx.template.style.fill = shapeCtx.config.fill = target.value;
  };
}

export function InputAsNumberChange(shapeCtx, key) {
  return ({ target }) => {
    debugger;
    shapeCtx.config[key] = target.valueAsNumber ?? 0;
    shapeCtx.draw(shapeCtx.template, shapeCtx.config);
  };
}
