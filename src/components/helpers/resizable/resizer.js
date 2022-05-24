//#region Стратегия ресайза общих фигур
function defaultStrategyCalculate(config, point) {
  const calculate = {
    e: () => {
      config.width = point.x - config.x;
    },
    w: () => {
      config.width += config.x - point.x;
      config.x -= config.x - point.x;
    },
    s: () => {
      config.height = point.y - config.y;
    },
    n: () => {
      config.height += config.y - point.y;
      config.y -= config.y - point.y;
    }
  };
  return pointId => calculate[pointId]();
}
function defaultStrategy(shapeConfig, point, pointId) {
  if (!pointId) {
    return;
  }
  pointId.match(/[\w]/gi).forEach(defaultStrategyCalculate(shapeConfig, point));
}
//#endregion

//#region Стратегия ресайза круга
function circleStrategy(shapeConfig, shapeTemplate, point, pointId) {
  switch (pointId) {
    case 'se':
    case 'ne':
    case 'e':
      shapeConfig.width = point.x - shapeTemplate.cx.baseVal.value + shapeTemplate.r.baseVal.value;
      break;
    case 'n':
      shapeConfig.width = shapeTemplate.cy.baseVal.value + shapeTemplate.r.baseVal.value - point.y;
      break;
    case 's':
      shapeConfig.width = point.y - shapeTemplate.cy.baseVal.value + shapeTemplate.r.baseVal.value;
      break;
    case 'nw':
    case 'sw':
    case 'w':
      shapeConfig.width = shapeTemplate.cx.baseVal.value + shapeTemplate.r.baseVal.value - point.x;
      break;
    default:
      break;
  }
}
//#endregion

const Resizer = {
  defaultStrategy,
  circleStrategy
}

export default Resizer;
