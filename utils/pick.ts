/**
 * Create an object composed of the picked object properties
 * @param {T} object
 * @param {Array<keyof T>} keys
 * @returns {Partial<T>}
 */
const pick = <T extends object>(object: T, keys: Array<keyof T>): Partial<T> => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {} as Partial<T>);
};

export default pick;
