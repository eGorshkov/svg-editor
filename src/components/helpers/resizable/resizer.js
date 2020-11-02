export function resizer(templateValue, pointValue, isInvert = false) {
  config.forEach(x => {
    if (isInvert) {
      shapeCtx.config[sizeKey] = shapeCtx.config[pointKey] - point[pointKey] + shapeCtx.template[sizeKey].baseVal.value;
      shapeCtx.config[pointKey] -= shapeCtx.config[pointKey] - point[pointKey];
    } else {
      return pointValue - templateValue;
    }
  });
}
