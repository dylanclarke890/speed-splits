import React from "react";
import { useReducer } from "react";
import { useEffect } from "react";
import { Split } from "../../models/core";
import {
  editRunActions as actions,
  editRunStatus as statuses,
} from "../../models/constants";
import SplitDisplay from "../Splits/SplitDisplay/SplitDisplay";
import { editRunReducer } from "../../utils/react/reducers";
import ItemButtons from "./Controls/ItemButtons";
import MainButtons from "./Controls/MainButtons";

const initialState = {
  droppedItem: -1,
  newSplit: new Split(),
  originalTitle: "",
  originalOrder: null,
  runs: [],
  selectedItem: -1,
  selectedRun: -1,
  status: statuses.INITIAL,
  splits: [],
};

export default function ManageSplits() {
  const [
    { splits, status, selectedItem, newSplit, runs, selectedRun },
    dispatch,
  ] = useReducer(editRunReducer, initialState);

  useEffect(() => {
    dispatch({ type: actions.INITIALIZE });
  }, []);

  // TODO: get rid of these
  const addItem = () => dispatch({ type: actions.ADD_ITEM }),
    addUpdate = (e) =>
      dispatch({ type: actions.ADD_UPDATE, data: { value: e.target.value } }),
    addCancel = () => dispatch({ type: actions.ADD_CANCEL }),
    addSave = () => dispatch({ type: actions.ADD_SAVE }),
    editItem = (i) => dispatch({ type: actions.EDIT_ITEM, data: { i } }),
    editUpdate = (i, e) =>
      dispatch({
        type: actions.EDIT_UPDATE,
        data: { i, value: e.target.value },
      }),
    editSave = () => dispatch({ type: actions.EDIT_SAVE }),
    editCancel = () => dispatch({ type: actions.EDIT_CANCEL }),
    deleteItem = (i) => dispatch({ type: actions.DELETE_ITEM, data: { i } }),
    deleteConfirm = () => dispatch({ type: actions.DELETE_CONFIRMED }),
    deleteCancel = () => dispatch({ type: actions.DELETE_CANCEL }),
    orderItems = () => dispatch({ type: actions.ORDER_ITEMS }),
    orderDragStart = (e, i) =>
      dispatch({ type: actions.ORDER_DRAG_START, data: { i, e } }),
    orderDragOver = (e, i) =>
      dispatch({ type: actions.ORDER_DRAGOVER, data: { i, e } }),
    orderDrop = (e, i) =>
      dispatch({ type: actions.ORDER_DROP, data: { i, e } }),
    orderSave = () => dispatch({ type: actions.ORDER_SAVE }),
    orderCancel = () => dispatch({ type: actions.ORDER_CANCEL }),
    titleEdit = () => dispatch({ type: actions.TITLE_EDIT }),
    titleUpdate = (e) =>
      dispatch({ type: actions.TITLE_UPDATE, data: { value: e.target.value } }),
    titleSave = () => dispatch({ type: actions.TITLE_SAVE }),
    titleCancel = () => dispatch({ type: actions.TITLE_CANCEL });

  const title = selectedRun > -1 ? runs[selectedRun].name : "Untitled";
  return (
    <>
      {status === statuses.EDITING_TITLE ? (
        <>
          <input
            className="custom-input"
            type="text"
            value={title}
            onChange={titleUpdate}
            autoFocus
          />
          <button className="btn" onClick={titleSave}>
            Save
          </button>
          <button className="btn" onClick={titleCancel}>
            Cancel
          </button>
        </>
      ) : (
        <h2 onClick={titleEdit}>{title}</h2>
      )}

      <div>
        {splits
          .sort((a, b) => a.order - b.order)
          .map((s, i) => (
            <div
              className="d-flex"
              key={s.title}
              draggable={status === statuses.ORDERING}
              onDragStart={(e) => orderDragStart(e, i)}
              onDragOver={(e) => {
                e.preventDefault();
                orderDragOver(e, i);
              }}
              onDrop={(e) => orderDrop(e, i)}
            >
              <SplitDisplay
                split={s}
                editableTitle={
                  i === selectedItem && status === statuses.EDITING
                }
                onEdit={(e) => editUpdate(i, e)}
              />
              <ItemButtons
                index={i}
                status={status}
                selectedItem={selectedItem}
                editItem={editItem}
                editCancel={editCancel}
                editSave={editSave}
                deleteItem={deleteItem}
                deleteCancel={deleteCancel}
                deleteConfirm={deleteConfirm}
              />
            </div>
          ))}
        {status === statuses.ADDING && (
          <div className="d-flex">
            <SplitDisplay
              split={newSplit}
              editableTitle
              onEdit={(e) => addUpdate(e)}
            />
          </div>
        )}
      </div>
      <MainButtons
        status={status}
        addItem={addItem}
        addCancel={addCancel}
        addSave={addSave}
        orderItems={orderItems}
        orderSave={orderSave}
        orderCancel={orderCancel}
      />
    </>
  );
}
