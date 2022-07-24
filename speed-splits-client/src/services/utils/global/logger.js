import { ErrorLog } from "./models";
import Storage from "./storage";

/** Helper class for debugging. */
export default class Logger {
  static writeLogs = false;

  /** If empty, will log for all sources, actions and ids, else will only
      log for the specified params. */
  static #logFor = {
    sources: [],
    actions: [],
    ids: [],
  };

  static Error(name, message, stack) {
    const currentErrorLogs = Storage.Get(Storage.Keys.ERROR_LOG.id) || [];
    const newErrorLog = new ErrorLog(name, message, stack);
    Storage.AddOrUpdate([...currentErrorLogs, newErrorLog]);
    console.error(JSON.stringify(newErrorLog));
  }

  static Info({ source, action, msg, extraData }) {
    if (!this.writeLogs) return;
    let sourceName = source?.constructor?.name;
    if (!sourceName) sourceName = new Error().stack; // hacky way to get the rough caller of a function
    const { sources, actions, ids } = this.#logFor;
    const canLog =
      (!sources.length || sources.some((val) => val === source)) &&
      (!actions.length || actions.some((val) => val === action)) &&
      (!ids.length || ids.some((val) => val === extraData.id));

    if (!canLog) return;
    const baseLog = `${sourceName} (${action})- ${msg}.`;
    let log = baseLog;
    if (extraData) {
      if (extraData.value) extraData.value = JSON.stringify(extraData.value);
      log += " Data: ";
      for (let key in extraData) {
        log += `${key}: ${extraData[key]}, `;
      }
      log = log.slice(0, -2) + ".";
    }
    console.info(log);
  }
}
