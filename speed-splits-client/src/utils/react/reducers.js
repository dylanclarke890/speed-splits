import {
  timerActions,
  storageKeys,
  Split,
  timerStatus,
} from "../../models/core";
import { ReducerError } from "../errors";
import { Time } from "../formatting";
import Storage from "../Storage";

const mockSplits = [
  new Split("Start", null, 0),
  new Split("First", null, 1),
  new Split("Second", null, 2),
  new Split("Third", null, 3),
  new Split("", null, 4),
];

export const timerStateReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case timerActions.INITIALIZE: {
      const currentSplit = Storage.Get(storageKeys.CURRENT_SPLIT, true) || 0,
        splits = Storage.Get(storageKeys.SPLITS, true) || mockSplits,
        status = Storage.Get(storageKeys.STATUS) || timerStatus.INITIAL,
        time = Storage.Get(storageKeys.CURRENT_TIME, true) || 0,
        timestampRef = Storage.Get(storageKeys.TIMESTAMP_REF, true) || 0,
        recordedTimes = Storage.Get(storageKeys.RECORDED_TIMES, true) || [];
      newState = {
        time,
        splits,
        currentSplit,
        status,
        timestampRef,
        recordedTimes,
      };
      break;
    }
    case timerActions.START: {
      const status = timerStatus.RUNNING;
      const timestampRef = Time.now();
      newState = {
        ...state,
        status,
        timestampRef,
      };
      Storage.AddOrUpdate(storageKeys.STATUS, status);
      Storage.AddOrUpdate(storageKeys.TIMESTAMP_REF, timestampRef);
      break;
    }
    case timerActions.TICK: {
      const msSinceRef = Time.now() - state.timestampRef;
      const time = msSinceRef + state.recordedTimes.reduce((a, b) => a + b, 0);
      newState = { ...state, time };
      Storage.AddOrUpdate(storageKeys.CURRENT_TIME, time);
      break;
    }
    case timerActions.PAUSE_RESUME: {
      let status;
      if (state.status === timerStatus.RUNNING) {
        status = timerStatus.PAUSED;
        newState = {
          ...state,
          status,
          recordedTimes: [
            ...state.recordedTimes,
            Time.now() - state.timestampRef,
          ],
        };
        Storage.AddOrUpdate(
          storageKeys.RECORDED_TIMES,
          newState.recordedTimes,
          true
        );
      }
      if (state.status === timerStatus.PAUSED) {
        status = timerStatus.RUNNING;
        newState = {
          ...state,
          status,
          timestampRef: Time.now(),
        };
        Storage.AddOrUpdate(storageKeys.TIMESTAMP_REF, newState.timestampRef);
      }
      Storage.AddOrUpdate(storageKeys.STATUS, status);
      break;
    }
    case timerActions.SPLIT: {
      if (state.currentSplit >= state.splits.length) {
        newState = { ...state, status: timerStatus.STOPPED };
        Storage.AddOrUpdate(storageKeys.STATUS);
        break;
      }
      const splits = state.splits;
      const splitToAdd = splits.find((s) => s.order === state.currentSplit);
      splitToAdd.time = state.time;
      const currentSplit = state.currentSplit + 1;
      newState = {
        ...state,
        splits,
        currentSplit,
      };
      Storage.AddOrUpdate(storageKeys.SPLITS, splits, true);
      Storage.AddOrUpdate(storageKeys.CURRENT_SPLIT, currentSplit);
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
      Storage.AddOrUpdate(storageKeys.SPLITS, splits, true);
      Storage.AddOrUpdate(storageKeys.CURRENT_SPLIT, currentSplit);
      break;
    }
    case timerActions.RESET: {
      newState = {
        status: timerStatus.INITIAL,
        time: 0,
        splits: state.splits.map((s) => ({ ...s, time: null })),
        currentSplit: 0,
        timestampRef: 0,
        recordedTimes: [],
      };
      Storage.DeleteAll(storageKeys);
      break;
    }
    case timerActions.STOP: {
      newState = { ...state, status: timerStatus.STOPPED };
      Storage.AddOrUpdate(storageKeys.STATUS);
      break;
    }
    default:
      throw new ReducerError(action.type);
  }
  return newState;
};
