import { SHAPES } from '../components/shapes/base.js';
import { IResizable } from './resizable';

export interface IShape {
  /**
   * Шаблон фигуры
   */
  template: SVGElement;
  /**
   *  Конфигурация фигуры
   */
  config: IShapeConfig;
  /**
   * Ид фигуры
   */
  shapeId: number;
  /**
   * Флаг того, что фигура активна:
   * 1. Активируется resizable - возможность изменения размера фигуры
   * 2. Добавляется возможность переноса фигуры
   */
  _active: boolean;
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
  /**
   * Класс изменения размера фигуры
   */
  resizable: IResizable;
  /**
   *  Тип фигуры
   */
  type: ShapesType;
  /**
   * Функция рисвоки шаблона
   * @param template - шаблон фигуры
   * @param config - конфигурация фигуры
   */
  draw(template: SVGElement, config: IShapeConfig): void;
  /**
   * Функция активации фигуры
   * 1. Активируется resizable - возможность изменения размера фигуры
   * 2. Добавляется возможность переноса фигуры
   */
  active(): void;

  /**
   * Функция деактивации фигуры
   * 1. Отключает resizable - возможность изменения размера фигуры
   * 2. Убирает возможность переноса фигуры
   */
  deactive(): void;
}

export interface IShapeConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ShapesType = keyof typeof SHAPES;
