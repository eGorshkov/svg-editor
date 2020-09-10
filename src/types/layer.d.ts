import { IShape } from './shape';

export interface ILayer {
  layerId: string;
  shapes: IShape[];
}
