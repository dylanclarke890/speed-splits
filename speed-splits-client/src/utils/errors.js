import { ErrorLog } from "../models/core";
import { storageKeys } from "../models/constants";
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
export class ArgumentException extends BaseError {
  constructor(msg, parameterName) {
    if (parameterName) msg = `${msg} Parameter: ${parameterName}`;
    super(msg);
  }
}

export class ArgumentNullError extends BaseError {
  constructor(parameterName) {
    super("Argument cannot be null.", parameterName);
  }

  static Guard(name, value) {
    if (!value) throw new ArgumentNullError(name);
  }
}
