import { ReducerError } from "../utils/global/errors";
import Storage from "../utils/global/storage";
import { Time } from "../utils/dateTime/time";
import Compare from "../utils/objectHandling/compare";

export const timerActions = {
  INITIALIZE: "initialize",
  START: "start",
  TICK: "tick",
  PAUSE_RESUME: "pauseResume",
  SPLIT: "split",
  UNDO: "undo",
  RESET: "reset",
  STOP: "stop",
  KEYPRESS: "keyPress",
};

export const timerStatus = {
  INITIAL: "initial",
  RUNNING: "running",
  PAUSED: "paused",
  STOPPED: "stopped",
};

export const initialTimerState = {
  status: timerStatus.INITIAL,
  splits: [],
  currentSplit: 0,
  currentTime: 0,
  timestampRef: 0,
  recordedTimes: [],
};

export function splitTimerReducer(state, action) {
  const statuses = timerStatus;
  let newState;
  switch (action.type) {
    case timerActions.INITIALIZE: {
      const currentRun = Storage.Get(Storage.Keys.SELECTED_RUN.id) || 0,
        splits =
          Storage.Get(Storage.Keys.SPLITS.id) ||
          (Storage.Get(Storage.Keys.RUNS.id) || [])[currentRun]?.splits ||
          [],
        currentTime = Storage.Get(Storage.Keys.CURRENT_TIME.id) || 0,
        currentSplit = Storage.Get(Storage.Keys.CURRENT_SPLIT.id) || 0,
        recordedTimes = Storage.Get(Storage.Keys.RECORDED_TIMES.id) || [],
        status = Storage.Get(Storage.Keys.STATUS.id) || statuses.INITIAL,
        timestampRef = Storage.Get(Storage.Keys.TIMESTAMP_REF.id) || 0;
      newState = {
        currentTime,
        currentSplit,
        recordedTimes,
        splits,
        status,
        timestampRef,
      };
      break;
    }
    case timerActions.START: {
      newState = {
        ...state,
        status: statuses.RUNNING,
        timestampRef: Time.now(),
      };
      break;
    }
    case timerActions.TICK: {
      const msSinceRef = Time.now() - state.timestampRef;
      const currentTime =
        msSinceRef + state.recordedTimes.reduce((a, b) => a + b, 0);
      newState = { ...state, currentTime };
      break;
    }
    case timerActions.PAUSE_RESUME: {
      if (state.status === statuses.RUNNING) {
        newState = {
          ...state,
          status: statuses.PAUSED,
          recordedTimes: [
            ...state.recordedTimes,
            Time.now() - state.timestampRef,
          ],
        };
      }
      if (state.status === statuses.PAUSED) {
        newState = {
          ...state,
          status: statuses.RUNNING,
          timestampRef: Time.now(),
        };
      }
      break;
    }
    case timerActions.SPLIT: {
      if (state.currentSplit >= state.splits.length) {
        newState = { ...state, status: statuses.STOPPED };
        break;
      }
      const splits = state.splits;
      const splitToAdd = splits.find((s) => s.order === state.currentSplit);
      splitToAdd.time = state.currentTime;
      const currentSplit = state.currentSplit + 1;
      newState = {
        ...state,
        splits,
        currentSplit,
      };
      break;
    }
    case timerActions.UNDO: {
      if (state.currentSplit === 0) {
        newState = state;
        break;
      }
      const splits = state.splits;
      const splitToRemove = splits.find(
        (s) => s.order === state.currentSplit - 1
      );
      splitToRemove.time = null;
      const currentSplit = state.currentSplit - 1;
      newState = {
        ...state,
        splits,
        currentSplit,
      };
      break;
    }
    case timerActions.RESET: {
      newState = {
        status: statuses.INITIAL,
        currentTime: 0,
        splits: state.splits.map((s) => ({ ...s, time: null })),
        currentSplit: 0,
        timestampRef: 0,
        recordedTimes: [],
      };
      Storage.DeleteAll();
      break;
    }
    case timerActions.STOP: {
      newState = { ...state, status: statuses.STOPPED };
      break;
    }
    default:
      throw new ReducerError(action.type);
  }
  saveStateChanges(state, newState);
  return newState;
}

function saveStateChanges(oldState, newState) {
  if (Compare.IsNotEqual(oldState.currentSplit, newState.currentSplit))
    Storage.AddOrUpdate(Storage.Keys.CURRENT_SPLIT.id, newState.currentSplit);
  if (Compare.IsNotEqual(oldState.currentTime, newState.currentTime))
    Storage.AddOrUpdate(Storage.Keys.CURRENT_TIME.id, newState.currentTime);
  if (Compare.IsNotEqual(oldState.splits, newState.splits))
    Storage.AddOrUpdate(Storage.Keys.SPLITS.id, newState.splits);
  if (Compare.IsNotEqual(oldState.recordedTimes, newState.recordedTimes))
    Storage.AddOrUpdate(Storage.Keys.RECORDED_TIMES.id, newState.recordedTimes);
  if (Compare.IsNotEqual(oldState.status, newState.status))
    Storage.AddOrUpdate(Storage.Keys.STATUS.id, newState.status);
  if (Compare.IsNotEqual(oldState.timestampRef, newState.timestampRef))
    Storage.AddOrUpdate(Storage.Keys.TIMESTAMP_REF.id, newState.timestampRef);
}
