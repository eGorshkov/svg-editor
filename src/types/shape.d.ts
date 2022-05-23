import { IResizable, IResizablePointType } from './resizable';
import { IPrototype } from './prototype';
import { ShapesType } from './base';

export declare interface IShape extends IPrototype<'shape'> {
  /**
   *
   */
  config: IShapeConfig;
  /**
   * Тип фигуры
   */
  type: ShapesType;

  /**
   *
   * @param shapeCtx
   * @param pointId
   * @param event
   */
  resize(shapeCtx: IShape, pointId: IResizablePointType, event: Event): void;

  /**
   *
   * @param shapeCtx
   */
  setting(shapeCtx: IShape): void;

  /**
   * Функция рисвоки шаблона
   * @param template - шаблон фигуры
   * @param config - конфигурация фигуры
   */
  draw(template: SVGElement, config: IShapeConfig): void;
}

export interface IShapeConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  value?: string;
}
