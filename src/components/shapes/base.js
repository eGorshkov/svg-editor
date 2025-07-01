import { SquareShape } from './square-shape.js';
import { TriangleShape } from './triangle-shape.js';
import { CircleShape } from './circle-shape.js';
import { LineShape } from './line-shape.js';
import { TextShape } from './text-shape.js';
import { LinkShape } from './link-shape.js';
import { DoorShape } from './door-shape.js';

/**
 * Словарь алиасов фигур для редактора.
 * @type {Object}
 */
export const SHAPES_ALIAS = {
  circle: 'circle',
  door: 'door',
  line: 'line',
  link: 'link',
  square: 'square',
  text: 'text',
  triangle: 'triangle',
}

/**
 * Словарь конструкторов фигур для редактора.
 * @type {Object}
 */
export const SHAPES = {
  [SHAPES_ALIAS.circle]: CircleShape,
  [SHAPES_ALIAS.door]: DoorShape,
  [SHAPES_ALIAS.line]: LineShape,
  [SHAPES_ALIAS.link]: LinkShape,
  [SHAPES_ALIAS.square]: SquareShape,
  [SHAPES_ALIAS.text]: TextShape,
  [SHAPES_ALIAS.triangle]: TriangleShape
};
