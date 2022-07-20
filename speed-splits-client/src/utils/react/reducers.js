import {
  timerActions,
  manageSplitActions,
  storageKeys,
  timerStatus,
  manageSplitStatus,
  settingStorageKeys,
} from "../../models/constants";
import { Split } from "../../models/core";
import { ReducerError } from "../errors";
import { Time } from "../formatting";
import Storage from "../Storage";

export const timerStateReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case timerActions.INITIALIZE: {
      let currentSplit = 0,
        status = timerStatus.INITIAL,
        time = 0,
        timestampRef = 0,
        recordedTimes = [];
      let splits = Storage.Get(storageKeys.SPLITS, true);

      if (!splits)
        splits = Storage.Get(settingStorageKeys.SELECTED_RUN, true) || [];
      else {
        currentSplit = Storage.Get(storageKeys.CURRENT_SPLIT, true) || 0;
        status = Storage.Get(storageKeys.STATUS) || timerStatus.INITIAL;
        time = Storage.Get(storageKeys.CURRENT_TIME, true) || 0;
        timestampRef = Storage.Get(storageKeys.TIMESTAMP_REF, true) || 0;
        recordedTimes = Storage.Get(storageKeys.RECORDED_TIMES, true) || [];
      }

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
  const statuses = manageSplitStatus;
  let newState;
  switch (action.type) {
    case manageSplitActions.INITIALIZE: {
      const data = Storage.Get(settingStorageKeys.SETTINGS, true);
      console.log(data);

      if (!data) {
        newState = { ...state };
        break;
      }

      if (data.selectedRun >= 0 && data.runs.length > 0) {
        data.splits = data.runs[data.selectedRun];
      } else {
        data.selectedRun = 0;
        data.runs.push([]);
      }
      if (
        data.status === statuses.EDITING &&
        data.originalTitle &&
        data.selectedItem >= 0
      ) {
        data.splits[data.selectedItem] = data.originalTitle;
        data.originalTitle = "";
        data.selectedItem = -1;
      } else if (data.status === statuses.EDITING && data.originalOrder) {
        data.splits = data.originalOrder;
        data.originalOrder = null;
      }
      newState = { ...data };
      break;
    }
    case manageSplitActions.ADD_ITEM: {
      newState = {
        ...state,
        status: statuses.ADDING,
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
          status: statuses.INITIAL,
        };
        break;
      }
      const newSplit = state.newSplit;
      newSplit.order = state.splits.length;
      const splits = [...state.splits, newSplit];
      const runs = state.runs;
      if (runs.length) runs[state.selectedRun] = splits;
      else runs.push(splits);
      newState = {
        ...state,
        runs,
        splits,
        newSplit: new Split(),
        status: statuses.INITIAL,
      };
      break;
    }
    case manageSplitActions.ADD_CANCEL: {
      newState = {
        ...state,
        status: statuses.INITIAL,
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
        status: statuses.EDITING,
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
        status: statuses.INITIAL,
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
        status: statuses.INITIAL,
      };
      break;
    }
    case manageSplitActions.DELETE_ITEM: {
      newState = {
        ...state,
        selectedItem: action.data.i,
        status: statuses.DELETING,
      };
      break;
    }
    case manageSplitActions.DELETE_CONFIRMED: {
      const splits = state.splits.filter((_, i) => i !== state.selectedItem);
      newState = {
        ...state,
        splits,
        selectedItem: -1,
        status: statuses.INITIAL,
      };
      break;
    }
    case manageSplitActions.DELETE_CANCEL: {
      newState = {
        ...state,
        selectedItem: -1,
        status: statuses.INITIAL,
      };
      break;
    }
    case manageSplitActions.ORDER_ITEMS:
      newState = {
        ...state,
        status: statuses.ORDERING,
        // create a deep copy of the original splits
        // in case the user wants to cancel later.
        originalOrder: JSON.parse(JSON.stringify(state.splits)),
      };
      break;
    case manageSplitActions.ORDER_DRAG_START: {
      const { i } = action.data;
      newState = { ...state, selectedItem: i };
      break;
    }
    case manageSplitActions.ORDER_DRAGOVER: {
      const { i } = action.data;
      newState = { ...state, droppedItem: i };
      break;
    }
    case manageSplitActions.ORDER_DROP: {
      let splits = state.splits;
      const dragged = splits[state.selectedItem];
      const dropped = splits[state.droppedItem];
      splits = splits.map((v, i) => {
        if (i === state.selectedItem) v = dropped;
        if (i === state.droppedItem) v = dragged;
        v.order = i;
        return v;
      });
      newState = { ...state, splits };
      break;
    }
    case manageSplitActions.ORDER_SAVE:
      newState = { ...state, status: statuses.INITIAL, originalOrder: null };
      break;
    case manageSplitActions.ORDER_CANCEL:
      const splits = state.originalOrder;
      newState = {
        ...state,
        status: statuses.INITIAL,
        splits,
        originalOrder: null,
      };
      break;
    default:
      throw new ReducerError(action.type);
  }
  Storage.AddOrUpdate(settingStorageKeys.SETTINGS, newState, true, true);
  Storage.AddOrUpdate(
    settingStorageKeys.SELECTED_RUN,
    newState.runs[newState.selectedRun],
    true
  );
  return newState;
};
