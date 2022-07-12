export const timerActions = {
  INITIALIZE: "initialize",
  START: "start",
  TICK: "tick",
  PAUSE_RESUME: "pauseResume",
  SPLIT: "split",
  UNDO: "undo",
  RESET: "reset",
  STOP: "stop",
};

export const timerStorageKeys = {
  IS_ACTIVE: "isActive",
  CURRENT_TIME: "currentTime",
  CURRENT_SPLIT: "currentSplit",
  SPLITS: "splits",
};

export class Split {
  constructor(title, time, order) {
    this.title = title || order;
    this.time = time;
    this.order = order;
  }
}
