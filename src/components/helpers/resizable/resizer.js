export function resizer(point, template, props) {
  return pointId => {
    const result = {};
    switch (props) {
      case 'width':
        result.width = pointId.includes('e') || pointId.includes('s') ? 100 : template.width.baseVal.value;
        break;
      case 'height':
        result.height = pointId.includes('s') || pointId.includes('n') ? 100 : template.height.baseVal.value;
        break;
    }
  };
}


// function set(pointKey, sizeKey, invert = false) {
//   if (invert) {
//     shapeCtx.config[sizeKey] = point[pointKey] - shapeCtx.template[pointKey].baseVal.value;
//   } else {
//     shapeCtx.config[sizeKey] = (shapeCtx.config[pointKey] - point[pointKey]) + shapeCtx.template[sizeKey].baseVal.value;
//     shapeCtx.config[pointKey] -= (shapeCtx.config[pointKey] - point[pointKey]);
//   }
// }
