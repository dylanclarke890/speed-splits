import { InvalidOperationError } from "../global/errors";

export class Time {
  static toTimeString(settings) {
    if (settings.hr) {
    }
  }
  msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }
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
        throw new InvalidOperationError(format);
    }
  }

  static calculate(time, divisor, mod) {
    if (time === 0) return "00";
    const divideResult = time / divisor;
    const result = Math.floor(mod > 0 ? divideResult % mod : divideResult);
    if (Number.isNaN(result)) return "00";
    return ("0" + result).slice(-2);
  }

  // Has a fallback in case Date.now() is not supported. Date.now() is faster in most cases.
  static now() {
    return Date.now() || new Date().getTime();
  }
}

export class TimeOnly {
  constructor(durationInMs, settings) {
    Object.assign(this, this.#convertDurationToTime(durationInMs, settings));
  }

  static FromNumber(duration) {
    return new TimeOnly(duration);
  }

  static FromString(duration) {
    const tryAsNumber = +duration;
    if (!isNaN(tryAsNumber)) {
      return TimeOnly.FromNumber(tryAsNumber);
    }
  }

  static FromDate(duration) {
    return TimeOnly.FromNumber(duration.getTime());
  }

  static Now() {
    return TimeOnly.FromNumber(Date.now() || new Date().getTime());
  }

  toString() {
    const hours = this.hours < 10 ? "0" + this.hours : this.hours,
      minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes,
      seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds,
      milliseconds = this.milliseconds;
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

  #convertDurationToTime(duration, settings) {
    const milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return { duration, hours, minutes, seconds, milliseconds };
  }
}
