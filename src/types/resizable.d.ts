import { Base } from './base';
import { IShapeConfig } from './shape';

export interface IResizable extends Base<IShapeConfig> {
  show(template: HTMLElement, config: IShapeConfig): void;
  remove(): void;
  _resize(width: number, height: number): void;
}
