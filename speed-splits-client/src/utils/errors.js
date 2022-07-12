class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.controller.name;
  }
}

export class ReducerError extends BaseError {
  constructor(action) {
    super(`Didn't recognise action: ${action}.`);
  }
}
