import { ReducerError } from "../utils/global/errors";
import Storage from "../utils/global/storage";
import Clone from "../utils/objectHandling/clone";
import { Split, Run } from "../utils/global/models";
import Compare from "../utils/objectHandling/compare";

export const editRunActions = {
  INITIALIZE: "initialize",
  ADD_ITEM: "addItem",
  EDIT_ITEM: "editItem",
  EDIT_TITLE: "editTitle",
  DELETE_ITEM: "deleteItem",
  DELETE_CONFIRMED: "deleteConfirmed",
  ORDER_ITEMS: "orderItems",
  ORDER_DRAG_START: "orderDrag",
  ORDER_DRAG_OVER: "orderDragOver",
  ORDER_DROP: "orderDrop",
  UPDATE: "update",
  CANCEL: "cancel",
  SAVE: "save",
};

export const editRunStatus = {
  INITIAL: "initial",
  ADDING: "adding",
  EDITING: "editing",
  EDITING_TITLE: "editingTitle",
  DELETING: "deleting",
  ORDERING: "ordering",
  SAVING: "saving",
};

export const initialEditRunState = {
  droppedItem: -1,
  newSplit: new Split(),
  originalTitle: "",
  originalOrder: null,
  runs: [],
  selectedItem: -1,
  selectedRun: -1,
  status: editRunStatus.INITIAL,
  splits: [],
};

export function editRunReducer(state, action) {
  const statuses = editRunStatus;
  let newState;
  switch (action.type) {
    case editRunActions.INITIALIZE: {
      const data = Storage.Get(Storage.Keys.SETTINGS.id);
      if (!data) {
        newState = { ...state };
        break;
      }
      const runs = Storage.Get(Storage.Keys.RUNS.id);
      let selectedRun = Storage.Get(Storage.Keys.SELECTED_RUN.id);
      if (runs.length) {
        selectedRun = selectedRun > -1 ? selectedRun : 0;
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
    case editRunActions.EDIT_TITLE: {
      const originalTitle = state.runs[state.selectedRun].name;
      newState = { ...state, originalTitle, status: statuses.EDITING_TITLE };
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
    case editRunActions.ORDER_ITEMS: {
      newState = {
        ...state,
        status: statuses.ORDERING,
        originalOrder: Clone.Simple(state.splits),
      };
      break;
    }
    case editRunActions.SAVE: {
      const status = state.status;
      if (status === statuses.ADDING) {
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
        else runs.push(new Run(null, splits));

        newState = {
          ...state,
          runs,
          splits,
          newSplit: new Split(),
        };
      } else if (
        status === statuses.EDITING ||
        status === statuses.EDITING_TITLE
      ) {
        newState = {
          ...state,
          selectedItem: -1,
          originalTitle: "",
        };
      } else if (status === statuses.ORDERING) {
        const runs = state.runs;
        runs[state.selectedRun].splits = state.splits;
        newState = {
          ...state,
          originalOrder: null,
          runs,
        };
      }
      newState.status = statuses.INITIAL;
      break;
    }
    case editRunActions.UPDATE: {
      const status = state.status;
      if (status === statuses.ADDING) {
        const newSplit = state.newSplit;
        newSplit.title = action.data.value;
        newState = { ...state, newSplit };
      } else if (status === statuses.EDITING) {
        const splits = state.splits;
        splits[action.data.i].title = action.data.value;
        const runs = state.runs;
        runs[state.selectedRun].splits = splits;
        newState = { ...state, splits, runs };
      } else if (status === statuses.EDITING_TITLE) {
        const runs = state.runs;
        runs[state.selectedRun].name = action.data.value;
        newState = { ...state, runs };
      }
      break;
    }
    case editRunActions.CANCEL: {
      const status = state.status;
      if (status === statuses.ADDING) {
        newState = {
          ...state,
          newSplit: new Split(),
        };
      } else if (status === statuses.EDITING) {
        const splits = state.splits;
        splits[state.selectedItem].title = state.originalTitle;
        newState = {
          ...state,
          splits,
          selectedItem: -1,
          originalTitle: "",
        };
      } else if (status === statuses.DELETING) {
        newState = {
          ...state,
          selectedItem: -1,
        };
      } else if (status === statuses.ORDERING) {
        newState = {
          ...state,
          splits: state.originalOrder,
          originalOrder: null,
        };
      } else if (status === statuses.EDITING_TITLE) {
        const runs = state.runs;
        runs[state.selectedRun].name = state.originalTitle;
        newState = {
          ...state,
          runs,
          originalTitle: "",
        };
      }
      newState.status = statuses.INITIAL;
      break;
    }
    case editRunActions.ORDER_DRAG_START:
      newState = { ...state, selectedItem: action.data.i };
      break;
    case editRunActions.ORDER_DRAG_OVER:
      newState = { ...state, droppedItem: action.data.i };
      break;
    case editRunActions.ORDER_DROP: {
      const dragged = state.splits[state.selectedItem],
        dropped = state.splits[state.droppedItem];
      const splits = state.splits.map((v, i) => {
        if (i === state.selectedItem) v = dropped;
        if (i === state.droppedItem) v = dragged;
        v.order = i;
        return v;
      });
      newState = { ...state, splits, selectedItem: -1, droppedItem: -1 };
      break;
    }
    default:
      throw new ReducerError(action.type);
  }
  saveStateChanges(state, newState);
  return newState;
}

function saveStateChanges(oldState, newState) {
  Storage.AddOrUpdate(Storage.Keys.SETTINGS.id, newState);
  if (Compare.IsEqual(oldState.runs, newState.runs))
    Storage.AddOrUpdate(Storage.Keys.RUNS.id, newState.runs);
  if (Compare.IsEqual(oldState.selectedRun, newState.selectedRun))
    Storage.AddOrUpdate(Storage.Keys.SELECTED_RUN.id, newState.selectedRun);
}
