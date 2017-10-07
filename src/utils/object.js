/**
 * Returns true when the given value is a plain object
 *
 * @param {*} o
 * @returns {boolean}
 */
export function isPlainObj(o) {
  return typeof o === 'object' && o.constructor === Object;
}
