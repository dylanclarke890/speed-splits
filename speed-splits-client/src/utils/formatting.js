export class Time {
  static toString(time, format) {
    switch (format) {
      case "hour":
        return Time.calculate(time, 3600000, 0);
      case "min":
        return Time.calculate(time, 60000, 60);
      case "sec":
        return Time.calculate(time, 1000, 60);
      case "ms":
        return Time.calculate(time, 10, 100);
      default:
        return "";
    }
  }

  static calculate(time, divisor, mod) {
    if (time === 0) return "00";
    const divideResult = time / divisor;
    const result = Math.floor(mod > 0 ? divideResult % mod : divideResult);
    return ("0" + result).slice(-2);
  }

  // has a fallback in case Date.now is not supported.
  static now() {
    return Date.now() || new Date().getTime();
  }
}
