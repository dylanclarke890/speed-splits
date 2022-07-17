import { ArgumentNullException, InvalidOperationError } from "./errors";

export default class Storage {
  static AddOrUpdate(name, item, useSerializer = false, allowNulls = true) {
    ArgumentNullException.Guard("name", name);
    if (!item && !allowNulls)
      throw new InvalidOperationError("Adding a null item is not allowed.");
    localStorage.setItem(name, useSerializer ? JSON.stringify(item) : item);
  }

  static Get(name, useDeserializer = false) {
    ArgumentNullException.Guard("name", name);
    const item = localStorage.getItem(name);
    return useDeserializer && item ? JSON.parse(item) : item;
  }

  static Delete(name) {
    ArgumentNullException.Guard("name", name);
    localStorage.removeItem(name);
  }

  static DeleteAll(obj) {
    ArgumentNullException.Guard("obj", obj);
    for (const key in obj) Storage.Delete(key);
  }
}
