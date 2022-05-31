import { ISubject } from './subject';
import { IShape } from './shape';
import { ILinkStore } from './link';
import { IEditor } from './editor';
export declare module globalThis {
  export const EDITOR: IEditor;
  export const SETTINGS_TOOL_SUBJECT: ISubject;
  export const ACTIVE_ITEM_SUBJECT: ISubject<IShape | null>;
  export const LINK_STORE: ILinkStore;
  export const LINK: {
    set: ISubject;
    update: ISubject;
    remove: ISubject;
  };
}
