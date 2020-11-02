/**
 *
 * @param value
 * @param checkFirstChange
 * @returns { Subject }
 * @constructor
 */
export function Subject(value, checkFirstChange) {
  this.subscribeFunctions = [];
  this.checkFirstChange = checkFirstChange ?? true;
  this.value = value ?? null;
  if(this.checkFirstChange) this.next(value);
  return this;
}

Subject.prototype.subscribe = function (cb) {
  this.subscribeFunctions.push(cb);
  if (this.checkFirstChange) cb(this.value);
};

Subject.prototype.next = function (v) {
  this.value = v;
  this.subscribeFunctions.forEach(cb => cb(v));
};

Subject.prototype.bind = function (v) {
  return this.next.bind(this, v);
};

Subject.prototype.getValue = function () {
  return this.value;
};
