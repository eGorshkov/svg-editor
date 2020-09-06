import { ShapeCreator } from "./helpers/shape-creator.js";

export function CircleShape(config) {
  return ShapeCreator(
    "circle",
    config,
    {
      width: 80,
      height: 80,
    },
    (template, config) => {
      template.setAttributeNS(null, "cx", config.x);
      template.setAttributeNS(null, "cy", config.y);
      template.setAttributeNS(
        null,
        "r",
        Math.max(config.width, config.height) / 2
      );
    }
  );
}
