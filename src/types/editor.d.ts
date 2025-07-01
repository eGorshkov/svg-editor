import { ILayer } from './layer';
import { Base } from './base';
import { ISubject } from './subject';

/**
 * Типы и интерфейсы редактора SVG.
 * @module types/editor
 */

/**
 * Интерфейс редактора, расширяющий Base.
 */
export declare interface IEditor extends Base<any, ILayer, 'editor'> {
  configuration: any;
  onChange: ISubject;
  /** Уникальный идентификатор редактора */
  uniqueId: string;
  /** Список слоёв */
  layers: ILayer[];
}
