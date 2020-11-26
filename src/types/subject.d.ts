export interface ISubject {
  value: any;
  subscribeFunctions: Function[];
  next(...args): any;
  subscribe(...args): any;
  pipe(...args): any;
  bind(...args): Function;
  getValue(): any;
}
