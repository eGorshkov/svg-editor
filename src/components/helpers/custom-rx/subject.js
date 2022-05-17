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
  this.pipeFunctions = {};
  this.checkFirstChange = checkFirstChange ?? true;
  this.canSubscribe = true;
  this.value = value ?? null;

  Object.defineProperty(this, 'subscribeCount', {
    get: function() {
      return this.subscribeFunctions.length;
    }
  });

  if (this.checkFirstChange) {
    this.next(value);
  }
  return this;
}

Subject.prototype.subscribe = function (cb) {
  if (!this.pipeFunctions[this.subscribeCount]) this.pipe();
  this.subscribeFunctions.push(cb);
  if (this.checkFirstChange) {
    cb(this.value);
  }
};

Subject.prototype.next = function (v) {
  this.value = v;
  if(!this.canSubscribe) return;

  for (let i = 0; i < this.subscribeCount; i++) {
    const pipeFns = this.pipeFunctions[i];
    const subcribeFn = this.subscribeFunctions[i];

    const nextFn = pipeFns ? compose.call(this, ...pipeFns, subcribeFn) : subcribeFn;
    nextFn(this.value);
  }
};

Subject.prototype.pipe = function (...pipeFns) {
  this.pipeFunctions[this.subscribeCount] = pipeFns.length ? pipeFns : null;
  return this;
};

Subject.prototype.bind = function (v) {
  return this.next.bind(this, v);
};

Subject.prototype.getValue = function () {
  return this.value;
};
