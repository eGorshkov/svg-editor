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
