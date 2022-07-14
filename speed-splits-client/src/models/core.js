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

export const storageKeys = {
  CURRENT_SPLIT: "currentSplit",
  CURRENT_TIME: "currentTime",
  SPLITS: "splits",
  STATUS: "status",
  TIMESTAMP_REF: "timestampRef",
  RECORDED_TIMES: "recordedTimes",
  ERROR_LOG: "errorLog",
};

export const timerStatus = {
  INITIAL: "initial",
  RUNNING: "running",
  PAUSED: "paused",
  STOPPED: "stopped",
};

export class Split {
  constructor(title, time, order) {
    this.title = title || order;
    this.time = time;
    this.order = order;
  }
}

export class ErrorLog {
  constructor(name, message, callStack) {
    this.name = name;
    this.message = message;
    this.callStack = callStack;
  }
}
