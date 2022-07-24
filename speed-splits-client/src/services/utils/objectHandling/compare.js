export default class Compare {
  static IsNull(obj) {
    return obj === null || obj === undefined;
  }

  static HasValue(obj) {
    return !this.HasValue(obj);
  }

  static IsSameRefOrEqual(a, b) {
    return a === b;
  }

  static IsEqual(a, b) {
    return this.#comparePrimitive(JSON.stringify(a), JSON.stringify(b));
  }

  static IsEqualDeep(a, b) {
    const aIsObj = this.#isObject(a);
    const bIsObj = this.#isObject(b);
    return a != null && b != null && aIsObj && bIsObj
      ? this.#compareObjects(a, b)
      : this.#comparePrimitive(a, b);
  }

  static #comparePrimitive(a, b) {
    return a === b;
  }

  static #isObject(obj) {
    return typeof obj === "object";
  }

  static #compareObjects(a, b) {
    let count = [0, 0];
    // eslint-disable-next-line no-unused-vars
    for (let _ in a) count[0]++;
    // eslint-disable-next-line no-unused-vars
    for (let _ in b) count[1]++;
    if (count[0] - count[1] !== 0) {
      return false;
    }
    for (let key in a) {
      if (!(key in b) || !this.IsEqualDeep(a[key], b[key])) {
        return false;
      }
    }
    for (let key in b) {
      if (!(key in a) || !this.IsEqualDeep(b[key], a[key])) {
        return false;
      }
    }
    return true;
  }
}
