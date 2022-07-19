import React from "react";
import { useReducer } from "react";
import { useEffect } from "react";
import { Split } from "../../models/core";
import {
  manageSplitActions as actions,
  manageSplitStatus as statuses,
} from "../../models/constants";
import SplitDisplay from "../Splits/SplitDisplay/SplitDisplay";
import { manageSplitsReducer } from "../../utils/react/reducers";
import ItemButtons from "./Controls/ItemButtons";
import MainButtons from "./Controls/MainButtons";

const initialState = {
  splits: [],
  status: statuses.INITIAL,
  selectedItem: -1,
  originalTitle: "",
  newSplit: new Split(),
  originalOrder: [],
  droppedItem: -1,
};

export default function ManageSplits() {
  const [{ splits, status, selectedItem, newSplit }, dispatch] = useReducer(
    manageSplitsReducer,
    initialState
  );

  useEffect(() => {
    dispatch({ type: actions.INITIALIZE });
  }, []);

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
    orderCancel = () => dispatch({ type: actions.ORDER_CANCEL });

  return (
    <>
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
