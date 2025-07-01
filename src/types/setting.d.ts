import { SETTINGS_TOOLS } from '../components/widgets/settings-tool/tools/base.js';

/**
 * Типы и интерфейсы для настроек редактора.
 * @module types/setting
 */

/**
 * Интерфейс настройки инструмента.
 * @template V - Тип значения
 */
export declare interface ISetting<V = any> {
  type: keyof typeof SETTINGS_TOOLS;
  label: string;
  currentValue: V;
  cb: (value: V) => void;
}

/**
 * Типы настроек.
 */
export declare type ISettingType = 'color' | 'input';

/**
 * Интерфейс настройки.
 * @interface ISetting
 */
export interface ISetting {
  /** Ключ настройки */
  key: string;
  /** Значение настройки */
  value: any;
}
