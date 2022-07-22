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
