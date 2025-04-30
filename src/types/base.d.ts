import { SHAPES } from '../components/shapes/base';
import { IPrototype } from './prototype';
import { IShapeConfig } from './shape';

export declare interface Base<C = any, I = any, T = string> extends IPrototype<T> {
  /**
   *  Конфигурация фигуры
   */
  coreConfig: C;
  /**
   *  Конфигурация фигуры
   */
  items: I[];

  add<I>(toolType: ShapesType, config: IShapeConfig): void;

  get<I>(values: any | any[], key: keyof typeof IPrototype): I;

  find<I>(values: any, key: keyof typeof IPrototype): I;

  load(items: Base[]): I[];

  killChild(child: Base, byKey: string): void;

  replaceOrder(source: number, target: number): void;

  reorder(): void;

  killAll(): void;

  getCoreConfig(): C;

  setCoreDraggable(cb: IPrototype['listener']['start']): void;

  removeCoreDraggable(cb: IPrototype['listener']['start']): void;

  changeChildPosition(change: IShapeConfig): void;
}

export type ShapesType = keyof typeof SHAPES;
