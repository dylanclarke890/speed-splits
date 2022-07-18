import {
  timerActions,
  manageSplitActions,
  storageKeys,
  timerStatus,
  manageSplitStatus,
} from "../../models/constants";
import { Split } from "../../models/core";
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

const getSplits = () => Storage.Get(storageKeys.SPLITS, true) || mockSplits;

export const timerStateReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case timerActions.INITIALIZE: {
      const currentSplit = Storage.Get(storageKeys.CURRENT_SPLIT, true) || 0,
        splits = getSplits(),
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
      const status = timerStatus.STOPPED;
      newState = { ...state, status };
      Storage.AddOrUpdate(storageKeys.STATUS, status);
      break;
    }
    default:
      throw new ReducerError(action.type);
  }
  return newState;
};

export const manageSplitsReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case manageSplitActions.INITIALIZE: {
      const splits = getSplits();
      newState = { ...state, splits, status: manageSplitStatus.INITIAL };
      break;
    }
    case manageSplitActions.ADD_ITEM: {
      newState = {
        ...state,
        status: manageSplitStatus.ADDING,
        newSplit: new Split(),
      };
      break;
    }
    case manageSplitActions.ADD_UPDATE: {
      const newSplit = state.newSplit;
      newSplit.title = action.data.value;
      newState = { ...state, newSplit };
      break;
    }
    case manageSplitActions.ADD_SAVE: {
      if (!state.newSplit.title) {
        newState = {
          ...state,
          newSplit: new Split(),
          status: manageSplitStatus.INITIAL,
        };
        break;
      }
      const newSplit = state.newSplit;
      newSplit.order = state.splits.length;
      const splits = [...state.splits, newSplit];
      newState = {
        ...state,
        splits,
        newSplit: new Split(),
        status: manageSplitStatus.INITIAL,
      };
      break;
    }
    case manageSplitActions.ADD_CANCEL: {
      newState = {
        ...state,
        status: manageSplitStatus.INITIAL,
        newSplit: new Split(),
      };
      break;
    }
    case manageSplitActions.EDIT_ITEM: {
      const index = action.data.i;
      const originalTitle = state.splits[index].title;
      newState = {
        ...state,
        originalTitle,
        selectedItem: index,
        status: manageSplitStatus.EDITING,
      };
      break;
    }
    case manageSplitActions.EDIT_UPDATE: {
      const splits = state.splits;
      splits[action.data.i].title = action.data.value;
      newState = { ...state, splits };
      break;
    }
    case manageSplitActions.EDIT_SAVE: {
      newState = {
        ...state,
        status: manageSplitStatus.INITIAL,
        selectedItem: -1,
        originalTitle: "",
      };
      break;
    }
    case manageSplitActions.EDIT_CANCEL: {
      const splits = state.splits;
      splits[state.selectedItem].title = state.originalTitle;
      newState = {
        ...state,
        splits,
        selectedItem: -1,
        originalTitle: "",
        status: manageSplitStatus.INITIAL,
      };
      break;
    }
    case manageSplitActions.DELETE_ITEM: {
      newState = {
        ...state,
        selectedItem: action.data.i,
        status: manageSplitStatus.DELETING,
      };
      break;
    }
    case manageSplitActions.DELETE_CONFIRMED: {
      const splits = state.splits.filter((_, i) => i !== state.selectedItem);
      newState = {
        ...state,
        splits,
        selectedItem: -1,
        status: manageSplitStatus.INITIAL,
      };
      break;
    }
    case manageSplitActions.DELETE_CANCEL: {
      newState = {
        ...state,
        selectedItem: -1,
        status: manageSplitStatus.INITIAL,
      };
      break;
    }
    case manageSplitActions.ORDER_ITEMS:
      newState = { ...state, status: manageSplitStatus.ORDERING };
      break;
    case manageSplitActions.ORDER_SAVE:
      newState = { ...state };
      break;
    case manageSplitActions.ORDER_CANCEL:
      newState = {
        ...state,
        status: manageSplitStatus.INITIAL,
      };
      break;
    default:
      throw new ReducerError(action.type);
  }
  return newState;
};
