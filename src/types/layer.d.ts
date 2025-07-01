import { IShape, IShapeConfig } from './shape';
import { Base } from './base';

/**
 * Типы и интерфейсы слоя SVG-редактора.
 * @module types/layer
 */

/**
 * Интерфейс слоя, расширяющий Base.
 */
export declare interface ILayer extends Base<any, IShape | ILayer, 'layer'> {
  defaultShapeConfig: IShapeConfig;
}

/**
 * Интерфейс слоя.
 * @interface ILayer
 */
export interface ILayer {
  /** Уникальный идентификатор слоя */
  uniqueId: string;
  /** Имя слоя */
  name?: string;
  /** Массив фигур */
  items: IShape[];
}
