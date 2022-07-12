import { timerActions, timerStorageKeys, Split } from "../../models/core";
import Storage from "../Storage";
const mockSplits = [
  new Split("Start", null, 0),
  new Split("First", null, 1),
  new Split("Second", null, 2),
  new Split("Third", null, 3),
  new Split("", null, 4),
];

export const timerStateReducer = (state, timerAction) => {
  let newState;
  switch (timerAction.type) {
    case timerActions.INITIALIZE: {
      const currentTime = Storage.Get(timerStorageKeys.CURRENT_TIME, true) || 0;
      const splits = Storage.Get(timerStorageKeys.SPLITS, true) || mockSplits; // TODO: Change this
      const currentSplit =
        Storage.Get(timerStorageKeys.CURRENT_SPLIT, true) || 0;
      const isActive = Storage.Get(timerStorageKeys.IS_ACTIVE, true);
      newState = {
        time: currentTime,
        splits: splits,
        currentSplit: currentSplit,
        isActive: isActive,
        isPaused: !isActive,
      };
      break;
    }
    case timerActions.START: {
      newState = { ...state, isActive: true, isPaused: false };
      Storage.AddOrUpdate(timerStorageKeys.IS_ACTIVE, true);
      break;
    }
    case timerActions.TICK: {
      const newTime = state.time + (document.hidden ? 1000 : 10); // account for page throttling
      newState = { ...state, time: newTime };
      Storage.AddOrUpdate(timerStorageKeys.CURRENT_TIME, newTime);
      break;
    }
    case timerActions.PAUSE_RESUME: {
      newState = { ...state, isPaused: !state.isPaused };
      Storage.AddOrUpdate(timerStorageKeys.IS_ACTIVE, state.isPaused);
      break;
    }
    case timerActions.SPLIT: {
      if (state.currentSplit >= state.splits.length) {
        newState = { ...state, isActive: false, isPaused: true };
        Storage.AddOrUpdate(timerStorageKeys.IS_ACTIVE, false);
        break;
      }
      const newSplits = state.splits;
      const splitToAdd = newSplits.find((s) => s.order === state.currentSplit);
      splitToAdd.time = state.time;
      const nextCurrSplitVal = state.currentSplit + 1;
      newState = {
        ...state,
        splits: newSplits,
        currentSplit: nextCurrSplitVal,
      };
      Storage.AddOrUpdate(timerStorageKeys.SPLITS, newSplits, true);
      Storage.AddOrUpdate(timerStorageKeys.CURRENT_SPLIT, nextCurrSplitVal);
      break;
    }
    case timerActions.UNDO: {
      if (state.currentSplit === 0) {
        newState = state;
        break;
      }
      const newSplits = state.splits;
      const splitToRemove = newSplits.find(
        (s) => s.order === state.currentSplit - 1
      );
      splitToRemove.time = null;
      const prevCurrSplitVal = state.currentSplit - 1;
      newState = {
        ...state,
        splits: newSplits,
        currentSplit: prevCurrSplitVal,
      };
      Storage.AddOrUpdate(timerStorageKeys.SPLITS, newSplits, true);
      Storage.AddOrUpdate(timerStorageKeys.CURRENT_SPLIT, prevCurrSplitVal);
      break;
    }
    case timerActions.RESET: {
      newState = {
        isPaused: true,
        isActive: false,
        time: 0,
        splits: state.splits.map((s) => ({ ...s, time: null })),
        currentSplit: 0,
      };
      Storage.Delete(timerStorageKeys.CURRENT_TIME);
      Storage.Delete(timerStorageKeys.IS_ACTIVE);
      Storage.Delete(timerStorageKeys.SPLITS);
      Storage.Delete(timerStorageKeys.CURRENT_SPLIT);
      break;
    }
    case timerActions.STOP: {
      newState = { ...state, isActive: false, isPaused: true };
      Storage.AddOrUpdate(timerStorageKeys.IS_ACTIVE, false);
      break;
    }
    default:
      throw new ReducerError(timerAction.type);
  }
  return newState;
};

class ReducerError extends Error {
  constructor(action) {
    super(`Didn't recognise action: ${action}.`);
    this.name = "ReducerError";
  }
}
