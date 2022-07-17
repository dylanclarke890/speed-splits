import { ArgumentNullError, InvalidOperationError } from "./errors";

export default class Storage {
  static AddOrUpdate(name, item, useSerializer = false, allowNulls = true) {
    ArgumentNullError.Guard("name", name);
    if (!item && !allowNulls)
      throw new InvalidOperationError("Adding a null item is not allowed.");
    localStorage.setItem(name, useSerializer ? JSON.stringify(item) : item);
  }

  static Get(name, useDeserializer = false) {
    ArgumentNullError.Guard("name", name);
    const item = localStorage.getItem(name);
    return useDeserializer && item ? JSON.parse(item) : item;
  }

  static Delete(name) {
    ArgumentNullError.Guard("name", name);
    localStorage.removeItem(name);
  }

  static DeleteAll(obj) {
    ArgumentNullError.Guard("obj", obj);
    for (const key in obj) Storage.Delete(obj[key]);
  }
}
