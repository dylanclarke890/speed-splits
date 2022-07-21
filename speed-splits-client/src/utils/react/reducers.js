import {
  timerActions,
  editRunActions,
  storageKeys,
  timerStatus,
  editRunStatus,
  runStorageKeys,
} from "../../models/constants";
import { Run, Split } from "../../models/core";
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

      if (!splits) {
        splits = Storage.Get(runStorageKeys.SELECTED_RUN, true).splits || [];
      } else {
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

export const editRunReducer = (state, action) => {
  const statuses = editRunStatus;
  let newState;
  switch (action.type) {
    case editRunActions.INITIALIZE: {
      const data = Storage.Get(runStorageKeys.SETTINGS, true);
      if (!data) {
        newState = { ...state };
        break;
      }
      const runs = Storage.Get(runStorageKeys.RUNS, true);
      let selectedRun = Storage.Get(runStorageKeys.SELECTED_RUN, true);

      if (selectedRun >= 0 && runs.length > 0) {
        data.splits = runs[selectedRun].splits;
      } else {
        selectedRun = 0;
        runs.push(new Run());
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
      newState = { ...data, runs, selectedRun };
      break;
    }
    case editRunActions.ADD_ITEM: {
      newState = {
        ...state,
        status: statuses.ADDING,
        newSplit: new Split(),
      };
      break;
    }
    case editRunActions.ADD_UPDATE: {
      const newSplit = state.newSplit;
      newSplit.title = action.data.value;
      newState = { ...state, newSplit };
      break;
    }
    case editRunActions.ADD_SAVE: {
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
      if (state.selectedRun >= 0) runs[state.selectedRun].splits = splits;
      else runs.push(new Run("", splits));

      newState = {
        ...state,
        runs,
        splits,
        newSplit: new Split(),
        status: statuses.INITIAL,
      };
      break;
    }
    case editRunActions.ADD_CANCEL: {
      newState = {
        ...state,
        status: statuses.INITIAL,
        newSplit: new Split(),
      };
      break;
    }
    case editRunActions.EDIT_ITEM: {
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
    case editRunActions.EDIT_UPDATE: {
      const splits = state.splits;
      splits[action.data.i].title = action.data.value;
      const runs = state.runs;
      runs[state.selectedRun].splits = splits;
      newState = { ...state, splits, runs };
      break;
    }
    case editRunActions.EDIT_SAVE: {
      newState = {
        ...state,
        status: statuses.INITIAL,
        selectedItem: -1,
        originalTitle: "",
      };
      break;
    }
    case editRunActions.EDIT_CANCEL: {
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
    case editRunActions.DELETE_ITEM: {
      newState = {
        ...state,
        selectedItem: action.data.i,
        status: statuses.DELETING,
      };
      break;
    }
    case editRunActions.DELETE_CONFIRMED: {
      const splits = state.splits.filter((_, i) => i !== state.selectedItem);
      const runs = state.runs;
      runs[state.selectedRun].splits = splits;
      newState = {
        ...state,
        runs,
        splits,
        selectedItem: -1,
        status: statuses.INITIAL,
      };
      break;
    }
    case editRunActions.DELETE_CANCEL: {
      newState = {
        ...state,
        selectedItem: -1,
        status: statuses.INITIAL,
      };
      break;
    }
    case editRunActions.ORDER_ITEMS:
      newState = {
        ...state,
        status: statuses.ORDERING,
        // create a deep copy of the original splits
        // in case the user wants to cancel later.
        originalOrder: JSON.parse(JSON.stringify(state.splits)),
      };
      break;
    case editRunActions.ORDER_DRAG_START: {
      const { i } = action.data;
      newState = { ...state, selectedItem: i };
      break;
    }
    case editRunActions.ORDER_DRAGOVER: {
      const { i } = action.data;
      newState = { ...state, droppedItem: i };
      break;
    }
    case editRunActions.ORDER_DROP: {
      let splits = state.splits;
      const dragged = splits[state.selectedItem];
      const dropped = splits[state.droppedItem];
      splits = splits.map((v, i) => {
        if (i === state.selectedItem) v = dropped;
        if (i === state.droppedItem) v = dragged;
        v.order = i;
        return v;
      });
      newState = { ...state, splits, selectedItem: -1, droppedItem: -1 };
      break;
    }
    case editRunActions.ORDER_SAVE:
      const runs = state.runs;
      runs[state.selectedRun].splits = state.splits;
      newState = {
        ...state,
        status: statuses.INITIAL,
        originalOrder: null,
        runs,
      };
      break;
    case editRunActions.ORDER_CANCEL:
      const splits = state.originalOrder;
      newState = {
        ...state,
        status: statuses.INITIAL,
        splits,
        originalOrder: null,
      };
      break;
    case editRunActions.TITLE_EDIT:
      const originalTitle = state.runs[state.selectedRun].name;
      newState = { ...state, originalTitle, status: statuses.EDITING_TITLE };
      break;
    case editRunActions.TITLE_UPDATE: {
      const name = action.data.value;
      const runs = state.runs;
      runs[state.selectedRun].name = name;
      newState = { ...state, runs };
      break;
    }
    case editRunActions.TITLE_SAVE:
      newState = { ...state, status: statuses.INITIAL };
      break;
    case editRunActions.TITLE_CANCEL: {
      const runs = state.runs;
      runs[state.selectedRun].name = state.originalTitle;
      newState = { ...state, runs, status: statuses.INITIAL };
      break;
    }
    default:
      throw new ReducerError(action.type);
  }
  Storage.AddOrUpdate(runStorageKeys.SETTINGS, newState, true, true);
  Storage.AddOrUpdate(runStorageKeys.RUNS, newState.runs, true);
  Storage.AddOrUpdate(runStorageKeys.SELECTED_RUN, newState.selectedRun, true);
  return newState;
};
