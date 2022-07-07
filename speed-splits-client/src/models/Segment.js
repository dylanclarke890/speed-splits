import { formatTime } from "../helpers/timeFormat";

export default class Segment {
  constructor(title, time, order) {
    this.title = title;
    this.time = time;
    this.order = order;
  }

  static formatTime = (time, format) => formatTime(time, format);
}
