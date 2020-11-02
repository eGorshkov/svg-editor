import { SHAPES } from '../components/shapes/base';

export interface Base<T = any, I = any> {
  /**
   * Шаблон фигуры
   */
  template: SVGElement | HTMLElement;
  /**
   *  Конфигурация фигуры
   */
  config: T;
  /**
   *  Конфигурация фигуры
   */
  items: I;
  /**
   * Тип фигуры
   */
  type: ShapesType;

  add(toolType: ShapesType): void;
}

export type ShapesType = keyof typeof SHAPES;
