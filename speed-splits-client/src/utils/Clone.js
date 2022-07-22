export default class Clone {
  /** Not suggested for use with Maps and Sets. */
  static Simple(value) {
    return JSON.parse(JSON.stringify(value));
  }

  /** A more reliable deep copy that can handle Maps and Sets. */
  static Complex(type, hash = new WeakMap()) {
    const referenceTypesRegEx = "Array|Object|Map|Set|Date";
    const isType = Object.prototype.toString.call(type);
    if (
      !new RegExp(referenceTypesRegEx).test(isType) ||
      type instanceof WeakMap ||
      type instanceof WeakSet
    )
      return type;

    if (hash.has(type)) {
      return hash.get(type);
    }
    const c = new type.constructor();

    if (type instanceof Map) {
      type.forEach((value, key) => c.set(Clone.Deep(key), Clone.Deep(value)));
    }
    if (type instanceof Set) {
      type.forEach((value) => c.add(Clone.Deep(value)));
    }
    if (type instanceof Date) {
      return new Date(type);
    }
    hash.set(type, c);
    return Object.assign(
      c,
      ...Object.keys(type).map((prop) => ({
        [prop]: Clone.Deep(type[prop], hash),
      }))
    );
  }
}
