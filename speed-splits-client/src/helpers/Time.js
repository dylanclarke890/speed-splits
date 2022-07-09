export default class Time {
  static toString(time, format) {
    switch (format) {
      case "hour":
        return Time.calculateTime(time, 3600000, 0);
      case "min":
        return Time.calculateTime(time, 60000, 60);
      case "sec":
        return Time.calculateTime(time, 1000, 60);
      case "ms":
        return Time.calculateTime(time, 10, 100);
      default:
        return "";
    }
  }

  static calculateTime(time, divisor, mod) {
    if (time === 0) return "00";
    const divideResult = time / divisor;
    const result = Math.floor(mod > 0 ? divideResult % mod : divideResult);
    return ("0" + result).slice(-2);
  }
}
