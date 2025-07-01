/**
 * Оператор map для кастомной реализации RxJS.
 * @param {Function} fn Функция преобразования значения
 * @returns {Function} Оператор map
 */
export function map(fn) {
  return source => ({
    subscribe: observer => source.subscribe({
      next: value => observer.next(fn(value)),
      error: err => observer.error(err),
      complete: () => observer.complete()
    })
  });
}
