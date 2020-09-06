export function ShapeCreator(elementName, config, defaultConfig, drawCallback) {
  config = { ...defaultConfig, ...config };
  const template = document.createElementNS(
    "http://www.w3.org/2000/svg",
    elementName
  );
  template.setAttributeNS(null, "width", config.width);
  template.setAttributeNS(null, "height", config.height);
  return [template, config, drawCallback];
}
