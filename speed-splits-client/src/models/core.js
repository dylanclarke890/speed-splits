export class Run {
  constructor(name, splits) {
    this.name = name || "Untitled";
    this.splits = splits || [];
  }
}

export class Split {
  constructor(title, time, order) {
    this.title = title || order;
    this.time = time || 0;
    this.order = order || 0;
  }
}

export class ErrorLog {
  constructor(name, message, callStack) {
    this.name = name;
    this.message = message;
    this.callStack = callStack;
  }
}
