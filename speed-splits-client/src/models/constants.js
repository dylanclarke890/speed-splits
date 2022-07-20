export const storageKeys = {
  CURRENT_SPLIT: "currentSplit",
  CURRENT_TIME: "currentTime",
  SPLITS: "splits",
  STATUS: "status",
  TIMESTAMP_REF: "timestampRef",
  RECORDED_TIMES: "recordedTimes",
  ERROR_LOG: "errorLog",
};

export const settingStorageKeys = {
  SETTINGS: "settings",
};

export const timerActions = {
  INITIALIZE: "initialize",
  START: "start",
  TICK: "tick",
  PAUSE_RESUME: "pauseResume",
  SPLIT: "split",
  UNDO: "undo",
  RESET: "reset",
  STOP: "stop",
};

export const timerStatus = {
  INITIAL: "initial",
  RUNNING: "running",
  PAUSED: "paused",
  STOPPED: "stopped",
};

export const manageSplitActions = {
  INITIALIZE: "initialize",
  ADD_ITEM: "addItem",
  ADD_UPDATE: "addUpdate",
  ADD_SAVE: "addSave",
  ADD_CANCEL: "addCancel",
  EDIT_ITEM: "editItem",
  EDIT_UPDATE: "editUpdate",
  EDIT_SAVE: "editSave",
  EDIT_CANCEL: "editCancel",
  DELETE_ITEM: "deleteItem",
  DELETE_CONFIRMED: "deleteConfirmed",
  DELETE_CANCEL: "deleteCancel",
  ORDER_ITEMS: "orderItems",
  ORDER_DRAG_START: "orderDrag",
  ORDER_DRAGOVER: "orderDragOver",
  ORDER_DROP: "orderDrop",
  ORDER_SAVE: "orderSave",
  ORDER_CANCEL: "orderCancel",
};

export const manageSplitStatus = {
  INITIAL: "initial",
  ADDING: "adding",
  EDITING: "editing",
  DELETING: "deleting",
  ORDERING: "ordering",
  SAVING: "saving",
};
