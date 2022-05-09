import { ILayer } from './layer';
import { Base } from './base';

export interface IEditor extends Base<any, ILayer> {
  replaceOrder(source: number, target: number): void;
}
