export default class Storage {
  static AddOrUpdate(name, item, useSerializer = false) {
    localStorage.setItem(name, useSerializer ? JSON.stringify(item) : item);
  }

  static Get(name, useDeserializer = false) {
    const item = localStorage.getItem(name);
    return useDeserializer ? JSON.parse(item) : item;
  }

  static Delete(name) {
    localStorage.removeItem(name);
  }

  static DeleteAll(obj) {
    for (const key in obj) Storage.Delete(key);
  }
}
