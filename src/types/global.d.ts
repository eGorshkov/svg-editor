import { ISubject } from './subject';
import { IResizable } from './resizable';
import { IShape } from './shape';
export declare module globalThis {
  export const SETTINGS_TOOL_SUBJECT: ISubject;
  export const ACTIVE_ITEM_SUBJECT: ISubject<IShape | null>;
  export const RESIZABLE: IResizable;
}
