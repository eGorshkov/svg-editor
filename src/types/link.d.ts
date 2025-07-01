import { IResizablePointType } from './resizable';
import { IShape } from './shape';

/**
 * Типы и интерфейсы связей SVG-редактора.
 * @module types/link
 */

/**
 * Интерфейс связи между фигурами.
 * @interface ILink
 */
export interface ILink {
  /** Уникальный идентификатор связи */
  uniqueId: string;
  /** Идентификатор начальной фигуры */
  fromId: string;
  /** Идентификатор конечной фигуры */
  toId: string;
}

/**
 * Интерфейс хранилища связей.
 */
export declare interface ILinkStore {
  links: ILink[];
  initFrom: SubscribeFrom;
  from: SubscribeFrom | null;

  init(): void;
  set(type: IResizablePointType, shape: IShape): void;
  update(shape: IShape): void;
  remove(shape: IShape): void;
  addLink(curr: SubscribeFrom, linkShape: IShape): void;
  removeLinkById(linkId: IShape['uniqueId']): void;
  getByShapeId(shapeId: IShape['uniqueId'], type: 'from' | 'to'): void;
}

interface SubscribeFrom {
  type: IResizablePointType;
  shape: IShape;
}
