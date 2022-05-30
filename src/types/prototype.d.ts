import { IShape, IShapeConfig } from './shape';
import { IResizable } from './resizable';
import { ISetting } from './setting';
import { Base } from './base';
import { IEditor } from './editor';

export declare interface IPrototype<T = string> {
  __type: T;
  order: number;
  uniqueId: string;
  /**
   * Шаблон фигуры
   */
  template: SVGElement;
  /**
   * Флаг того, что фигуру можно переносить
   */
  dragging: boolean;
  /**
   *
   */
  dragOffsetX: 0;
  /**
   *
   */
  dragOffsetY: 0;

  listener: {
    start(e: Event): void;
    move(e: Event): void;
    end(e: Event): void;
  };

  config: IShapeConfig;

  parent: Base;
  fullOrder: string;
  level: number;
  orders: number[];
  active: boolean;
  isEditor: boolean;
  isLayer: boolean;
  isShape: boolean;
  /**
   * Класс изменения размера фигуры
   */
  resizable: IResizable | null;

  links: {
    from: IShape[];
    to: IShape[];
  }

  kill(): void;

  activate(settingsConfig?: ISetting[]): void;

  deactivate(): void;

  setSettings(config: null | ISetting[]): void;

  removeSettings(): void;

  setDraggable(cb): void;

  removeDraggable(cb): void;

  setResizable(subscribeFn, config: IShapeConfig): void;

  removeResizable(): void;

  getEditor(): IEditor;

  getFullPath(prop: keyof typeof IPrototype): any[];
}
