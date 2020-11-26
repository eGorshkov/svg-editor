import { compose } from '../compose.js';
/**
 *
 * @param value
 * @param checkFirstChange
 * @returns { Subject }
 * @constructor
 */

export function Subject(value, checkFirstChange) {
  this.subscribeFunctions = [];
  this.pipeFunctions = [];
  this.checkFirstChange = checkFirstChange ?? true;
  this.canSubscribe = true;
  this.value = value ?? null;
  if (this.checkFirstChange) {
    this.next(value);
  }
  return this;
}

Subject.prototype.subscribe = function (cb) {
  this.subscribeFunctions.push(cb);
  if (this.checkFirstChange) {
    cb(this.value);
  }
};

Subject.prototype.next = function (v) {
  this.value = v;
  if (this.pipeFunctions?.length) {
    const _compose = compose.call(this, ...this.pipeFunctions);
    _compose(this);
  }
  for (let fn of this.subscribeFunctions) {
    if (this.canSubscribe) {
      fn(this.value);
    }
  }
};

Subject.prototype.pipe = function (...pipeFns) {
  debugger;
  (pipeFns || []).forEach(fn => this.pipeFunctions.push(fn));
  return this;
};

Subject.prototype.bind = function (v) {
  return this.next.bind(this, v);
};

Subject.prototype.getValue = function () {
  return this.value;
};
