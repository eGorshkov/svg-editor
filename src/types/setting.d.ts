import { SETTINGS_TOOLS } from '../components/widgets/settings-tool/tools/base.js';

export interface ISetting<V = any> {
  type: keyof typeof SETTINGS_TOOLS;
  label: string;
  currentValue: V;
  cb: (value: V) => void;
}

export type ISettingType = 'color' | 'input';
