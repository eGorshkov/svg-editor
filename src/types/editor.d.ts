import { ILayer } from './layer';
import { Base } from './base';

export interface IEditor extends Base<any, ILayer, 'editor'> {
  replaceOrder(source: number, target: number): void;
}
