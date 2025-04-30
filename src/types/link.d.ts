import { IResizablePointType } from './resizable';
import { IShape } from './shape';

export declare interface ILink {
  fromType: IResizablePointType;
  fromShape: IShape;
  toType: IResizablePointType;
  toShape: IShape;
  linkShape: IShape;
}

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
