export default class Segment {
  constructor(title, time, order) {
    this.title = title || order;
    this.time = time;
    this.order = order;
  }
}
