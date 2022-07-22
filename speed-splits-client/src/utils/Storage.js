import { ArgumentNullError } from "./errors";

export default class Storage {
  static AddOrUpdate(name, item, useSerializer = true, allowNulls = true) {
    ArgumentNullError.Guard("name", name);
    if (!allowNulls) ArgumentNullError.Guard("item", item);
    localStorage.setItem(name, useSerializer ? JSON.stringify(item) : item);
  }

  static Get(name, useDeserializer = true) {
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
