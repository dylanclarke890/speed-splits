export default class Compare {
  static HasValue(obj) {
    const objType = typeof obj;
    switch (objType) {
      case "undefined":
        return false;
      case "string":
        return obj !== "";
      case "number":
      case "bigint":
        return obj > 0;
      case "boolean":
        return obj;
      case "object":
        return obj !== null && obj !== undefined;
      // unlikely this class will be needed for funcs and symbols
      // so just return true as a default
      default:
        return true;
    }
  }

  static IsNull(obj) {
    return obj === null || obj === undefined;
  }

  static IsNotNull(obj) {
    return obj !== null && obj !== undefined;
  }

  static IsSameRefOrEqual(a, b) {
    return a === b;
  }

  static IsEqual(a, b) {
    const aIsObj = this.#isObject(a),
      bIsObj = this.#isObject(b);
    a = aIsObj ? JSON.stringify(a) : a;
    b = bIsObj ? JSON.stringify(b) : b;
    return this.#comparePrimitive(a, b);
  }

  static IsNotEqual(a, b) {
    const aIsObj = this.#isObject(a),
      bIsObj = this.#isObject(b);
    a = aIsObj ? JSON.stringify(a) : a;
    b = bIsObj ? JSON.stringify(b) : b;
    return !this.#comparePrimitive(a, b);
  }

  static IsNotEqualDeep(a, b) {
    const aIsObj = this.#isObject(a),
      bIsObj = this.#isObject(b);
    return a != null && b != null && aIsObj && bIsObj
      ? !this.#compareObjects(a, b)
      : !this.#comparePrimitive(a, b);
  }

  static IsEqualDeep(a, b) {
    const aIsObj = this.#isObject(a),
      bIsObj = this.#isObject(b);
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
