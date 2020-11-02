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
