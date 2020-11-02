export function createTemplate(elementName) {
  return document.createElementNS('http://www.w3.org/2000/svg', elementName);
}

export function ShapeCreator(elementName, config, drawCallback, resizeCallback) {
  const template = createTemplate(elementName);
  template.setAttributeNS(null, 'width', config.width ?? 80);
  template.setAttributeNS(null, 'height', config.height ?? 80);
  template.setAttributeNS(null, 'cursor', config.cursor ?? 'default');
  template.setAttributeNS(null, 'fill', config.fill ?? 'rgb(255, 255, 255)');
  template.setAttributeNS(null, 'stroke', config.stroke ?? 'rgb(0, 0, 0)');
  return [
    template,
    config,
    drawCallback || defaultDraw,
    resizeCallback || defaultResize
  ];
}

/**
 *
 * @param shapeCtx { IShape }
 * @param event
 * @param activePointId
 */
function defaultResize(shapeCtx, event, activePointId) {

}

/**
 *
 * @param template
 * @param config
 */
export function defaultDraw(template, config) {
  template.setAttributeNS(null, 'x', config.x);
  template.setAttributeNS(null, 'y', config.y);
}
