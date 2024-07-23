import { SquareShape } from './square-shape.js';
import { TriangleShape } from './triangle-shape.js';
import { CircleShape } from './circle-shape.js';
import { LineShape } from './line-shape.js';
import { TextShape } from './text-shape.js';
import { LinkShape } from './link-shape.js';
import { DoorShape } from './door-shape.js';

export const SHAPES_ALIAS = {
  square: 'square',
  triangle: 'triangle',
  circle: 'circle',
  line: 'line',
  text: 'text',
  link: 'link',
  door: 'door',
}

export const SHAPES = {
  [SHAPES_ALIAS.square]: SquareShape,
  [SHAPES_ALIAS.triangle]: TriangleShape,
  [SHAPES_ALIAS.circle]: CircleShape,
  [SHAPES_ALIAS.line]: LineShape,
  [SHAPES_ALIAS.text]: TextShape,
  [SHAPES_ALIAS.link]: LinkShape,
  [SHAPES_ALIAS.door]: DoorShape
};
