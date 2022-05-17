import { SHAPES } from '../components/shapes/base';

export interface Base<C = any, I = any, T = string> {
  __type: T;
  order: number;
  /**
   * Шаблон фигуры
   */
  template: SVGElement;
  /**
   *  Конфигурация фигуры
   */
  config: C;
  /**
   *  Конфигурация фигуры
   */
  items: I[];

  add(toolType: ShapesType): void;
}

export type ShapesType = keyof typeof SHAPES;
