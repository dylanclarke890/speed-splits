export class GlobalEvents {
  static Add(eventName, handler) {
    window.addEventListener(eventName, handler);
  }

  static Remove(eventName, handler) {
    window.removeEventListener(eventName, handler);
  }
}
