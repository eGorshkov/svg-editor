import { Base } from './base';
import { IShapeConfig } from './shape';
import { ISubject } from './subject';

export interface IResizablePoint {
  width: number;
  height: number;
  x: number;
  y: number;
  fill: string;
  stroke: string;
  cursor?: string;
}

export interface IResizablePoints {
  w: IResizablePoint;
  e: IResizablePoint;
  s: IResizablePoint;
  n: IResizablePoint;
  nw: IResizablePoint;
  ne: IResizablePoint;
  sw: IResizablePoint;
  se: IResizablePoint;
}

export type IResizablePointType = keyof IResizablePoints;

export interface IResizable extends Base<IShapeConfig> {
  show(template: HTMLElement | SVGElement, config: IShapeConfig): void;
  remove(): void;
  preventPoint: IResizablePoint;
  points: IResizablePoints;
  _resize: ISubject;
}
