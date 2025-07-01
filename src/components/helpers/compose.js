/**
 * Композиция функций справа налево.
 * @param {...Function} fns Функции для композиции
 * @returns {Function} Результирующая функция-композиция
 */
export default function compose(...functions) {
  if (!functions) {
    return x => x;
  }

  if (functions.length === 1) {
    return functions[0];
  }

  return functions.reduce(
    (a, b) =>
      (...args) =>
        b(a(...args))
  );
}
