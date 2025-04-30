import { IShape, IShapeConfig } from './shape';
import { Base } from './base';

export declare interface ILayer extends Base<any, IShape | ILayer, 'layer'> {
  defaultShapeConfig: IShapeConfig;
}
