import compose from '../compose.js';

/**
 * Реактивный субъект (наблюдатель).
 * @constructor
 * @implements {ISubject}
 * @param {*} value Начальное значение
 * @param {boolean} [checkFirstChange] Проверять первое изменение
 * @returns {Subject}
 */
export function Subject(value, checkFirstChange) {
  this.subscribeFunctions = [];
  this.pipeFunctions = {};
  this.checkFirstChange = checkFirstChange ?? true;
  this.canSubscribe = true;
  this.value = value ?? null;

  Object.defineProperty(this, 'subscribeCount', {
    get: function () {
      return this.subscribeFunctions.length;
    }
  });

  if (this.checkFirstChange) {
    this.next(value);
  }
  return this;
}

/**
 * Подписка на изменения значения.
 * @param {Function} cb Колбэк
 */
Subject.prototype.subscribe = function (cb) {
  if (!this.pipeFunctions[this.subscribeCount]) this.pipe();
  this.subscribeFunctions.push(cb);
  if (this.checkFirstChange) {
    cb(this.value);
  }
};

/**
 * Устанавливает новое значение и уведомляет подписчиков.
 * @param {*} v Новое значение
 */
Subject.prototype.next = function (v) {
  this.value = v;
  if (!this.canSubscribe) return;

  for (let i = 0; i < this.subscribeCount; i++) {
    const pipeFns = this.pipeFunctions[i];
    const subcribeFn = this.subscribeFunctions[i];

    const nextFn = pipeFns ? compose.call(this, ...pipeFns, subcribeFn) : subcribeFn;
    nextFn(this.value);
  }
};

/**
 * Добавляет пайпы (функции-посредники) для подписки.
 * @param {...Function} pipeFns Функции пайпа
 * @returns {Subject}
 */
Subject.prototype.pipe = function (...pipeFns) {
  this.pipeFunctions[this.subscribeCount] = pipeFns.length ? pipeFns : null;
  return this;
};

/**
 * Привязывает значение к next.
 * @param {*} v Значение
 * @returns {Function}
 */
Subject.prototype.bind = function (v) {
  return this.next.bind(this, v);
};

/**
 * Получает текущее значение.
 * @returns {*}
 */
Subject.prototype.getValue = function () {
  return this.value;
};
