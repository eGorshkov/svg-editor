import { ILayer } from './layer';
import { Base } from './base';
import { ISubject } from './subject';

export declare interface IEditor extends Base<any, ILayer, 'editor'> {
  configuration: any;
  onChange: ISubject;
}
