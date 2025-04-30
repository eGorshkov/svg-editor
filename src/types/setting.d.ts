import { SETTINGS_TOOLS } from '../components/widgets/settings-tool/tools/base.js';

export declare interface ISetting<V = any> {
  type: keyof typeof SETTINGS_TOOLS;
  label: string;
  currentValue: V;
  cb: (value: V) => void;
}

export declare type ISettingType = 'color' | 'input';
