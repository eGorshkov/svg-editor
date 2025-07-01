/**
 * Типы и интерфейсы для реактивных субъектов (наблюдателей).
 * @module types/subject
 */

/**
 * Интерфейс субъекта (наблюдателя).
 * @interface ISubject
 */
export interface ISubject {
  /** Подписка на изменения */
  subscribe: (observer: (value: any) => void) => void;
  /** Оповещение подписчиков */
  next: (value: any) => void;
}

/**
 * Интерфейс реактивного субъекта (наблюдателя).
 * @template V - Тип значения
 */
export declare interface ISubject<V = any> {
  value: V;
  subscribeFunctions: Function[];
  subscribeCount: number;
  next(...args): any;
  subscribe(...args): any;
  pipe(...args): any;
  bind(...args): Function;
  getValue(): V;
}
