import { ErrorLog, storageKeys } from "../models/core";
import Storage from "./Storage";

class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.Log();
  }

  Log() {
    const currentErrors = Storage.Get(storageKeys.ERROR_LOG) || [];
    Storage.AddOrUpdate(
      [...currentErrors, new ErrorLog(this.name, this.message, this.stack)],
      true
    );
  }
}

export class ReducerError extends BaseError {
  constructor(action) {
    super(`Didn't recognise action: ${action}.`);
  }
}

export class InvalidOperationError extends BaseError {
  constructor(operation) {
    super(`Invalid operation: ${operation}.`);
  }
}

export class FormatError extends BaseError {
  constructor(args) {
    let message = "Formatting error using parameters: ";
    for (let key in args) {
      message += `${key} - ${args[key]} (${typeof args[key]}),`;
    }
    message = message.slice(0, -1) + ".";
    super(message);
  }
}
