export function ShapeCreator(elementName, config, defaultConfig, drawCallback) {
  config = { ...defaultConfig, ...config };
  const template = document.createElementNS(
    "http://www.w3.org/2000/svg",
    elementName
  );
  template.setAttributeNS(null, "width", config.width ?? 80);
  template.setAttributeNS(null, "height", config.height ?? 80);
  template.setAttributeNS(null, "cursor", config.cursor ?? "default");
  return [template, config, drawCallback];
}
