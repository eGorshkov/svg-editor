import { ShapeCreator } from "./shape-creator.js";

export function SquareShape(config) {
  return ShapeCreator(
    "rect",
    config,
    {
      width: 80,
      height: 80,
    },
    (template, config) => {
      template.setAttributeNS(null, "x", config.x);
      template.setAttributeNS(null, "y", config.y);
    }
  );
}
