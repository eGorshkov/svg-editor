import { Base } from './base';
import { IShapeConfig } from './shape';
import { ISubject } from './subject';

/**
 * Типы и интерфейсы для изменения размера объектов.
 * @module types/resizable
 */

/**
 * Интерфейс точки изменения размера.
 * @interface IResizablePoint
 */
export interface IResizablePoint {
  /** X-координата точки */
  x: number;
  /** Y-координата точки */
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  cursor?: string;
}

/**
 * Интерфейс для всех точек изменения размера.
 */
export interface IResizablePoints {
  w: IResizablePoint;
  e: IResizablePoint;
  s: IResizablePoint;
  n: IResizablePoint;
  nw: IResizablePoint;
  ne: IResizablePoint;
  sw: IResizablePoint;
  se: IResizablePoint;
  overlay: IResizablePoint;
  circlesNames: Array<IResizablePointType>;
}

/**
 * Типы точек изменения размера.
 */
export type IResizablePointType = 'w' | 'e' | 's' | 'n' | 'nw' | 'ne' | 'sw' | 'se';

/**
 * Интерфейс для объектов, поддерживающих изменение размера.
 */
export declare interface IResizable extends Base<IShapeConfig> {
  show(template: HTMLElement | SVGElement, config: IShapeConfig): void;
  hide(): void;
  remove(): void;
  preventPoint: IResizablePoint;
  points: IResizablePoints;
  _resize: ISubject;
}
