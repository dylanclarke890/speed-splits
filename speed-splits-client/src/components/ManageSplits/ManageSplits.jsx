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
};

export default function ManageSplits() {
  const [state, dispatch] = useReducer(manageSplitsReducer, initialState);

  useEffect(() => {
    dispatch({ type: actions.INITIALIZE });
  }, []);

  const addItem = () => dispatch({ type: actions.ADD_ITEM }),
    addCancel = () => dispatch({ type: actions.ADD_CANCEL }),
    addSave = () => dispatch({ type: actions.ADD_SAVE }),
    editItem = (i) => dispatch({ type: actions.EDIT_ITEM, data: { i } }),
    editSave = () => dispatch({ type: actions.EDIT_SAVE }),
    editCancel = () => dispatch({ type: actions.EDIT_CANCEL }),
    deleteItem = (i) => dispatch({ type: actions.DELETE_ITEM, data: { i } }),
    deleteConfirm = () => dispatch({ type: actions.DELETE_CONFIRMED }),
    deleteCancel = () => dispatch({ type: actions.DELETE_CANCEL }),
    orderItems = () => dispatch({ type: actions.ORDER_ITEMS }),
    orderSave = () => dispatch({ type: actions.ORDER_SAVE }),
    orderCancel = () => dispatch({ type: actions.ORDER_CANCEL });

  return (
    <>
      <div>
        {state.splits.map((s, i) => (
          <div className="d-flex" key={s.title}>
            <SplitDisplay
              split={s}
              editableTitle={
                i === state.selectedItem && state.status === statuses.EDITING
              }
              onEdit={(e) =>
                dispatch({
                  type: actions.ADD_UPDATE,
                  data: { i, value: e.target.value },
                })
              }
            />
            <ItemButtons
              index={i}
              status={state.status}
              selectedItem={state.selectedItem}
              editItem={editItem}
              editCancel={editCancel}
              editSave={editSave}
              deleteItem={deleteItem}
              deleteCancel={deleteCancel}
              deleteConfirm={deleteConfirm}
            />
          </div>
        ))}
        {state.status === statuses.ADDING && (
          <div className="d-flex">
            <SplitDisplay
              split={new Split()}
              editableTitle
              onEdit={(e) => {}}
            />
          </div>
        )}
      </div>
      <MainButtons
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
