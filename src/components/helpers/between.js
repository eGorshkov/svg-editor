/**
 * Проверяет, находится ли значение между двумя границами (включительно).
 * @param {number} value Проверяемое значение
 * @param {number} min Минимальная граница
 * @param {number} max Максимальная граница
 * @returns {boolean} true, если value между min и max (включительно)
 */
export default function between(value, min, max) {
  return value >= min && value <= max;
}
