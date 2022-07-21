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

  const title = selectedRun > -1 ? runs[selectedRun].name : "Untitled";
  return (
    <>
      {status === statuses.EDITING_TITLE ? (
        <>
          <input
            className="custom-input"
            type="text"
            value={title}
            onChange={(e) =>
              dispatch({
                type: actions.TITLE_UPDATE,
                data: { value: e.target.value },
              })
            }
            autoFocus
          />
          <button
            className="btn"
            onClick={() => dispatch({ type: actions.TITLE_SAVE })}
          >
            Save
          </button>
          <button
            className="btn"
            onClick={() => dispatch({ type: actions.TITLE_CANCEL })}
          >
            Cancel
          </button>
        </>
      ) : (
        <h2 onClick={() => dispatch({ type: actions.TITLE_EDIT })}>{title}</h2>
      )}

      <div>
        {splits
          .sort((a, b) => a.order - b.order)
          .map((s, i) => (
            <div
              className="d-flex"
              key={s.title}
              draggable={status === statuses.ORDERING}
              onDragStart={(e) =>
                dispatch({ type: actions.ORDER_DRAG_START, data: { i, e } })
              }
              onDragOver={(e) => {
                e.preventDefault();
                dispatch({ type: actions.ORDER_DRAGOVER, data: { i, e } });
              }}
              onDrop={(e) =>
                dispatch({ type: actions.ORDER_DROP, data: { i, e } })
              }
            >
              <SplitDisplay
                split={s}
                editableTitle={
                  i === selectedItem && status === statuses.EDITING
                }
                onEdit={(e) =>
                  dispatch({
                    type: actions.EDIT_UPDATE,
                    data: { i, value: e.target.value },
                  })
                }
              />
              <ItemButtons
                index={i}
                status={status}
                selectedItem={selectedItem}
                editItem={(i) =>
                  dispatch({ type: actions.EDIT_ITEM, data: { i } })
                }
                editCancel={() => dispatch({ type: actions.EDIT_CANCEL })}
                editSave={() => dispatch({ type: actions.EDIT_SAVE })}
                deleteItem={(i) =>
                  dispatch({ type: actions.DELETE_ITEM, data: { i } })
                }
                deleteCancel={() => dispatch({ type: actions.DELETE_CANCEL })}
                deleteConfirm={() =>
                  dispatch({ type: actions.DELETE_CONFIRMED })
                }
              />
            </div>
          ))}
        {status === statuses.ADDING && (
          <div className="d-flex">
            <SplitDisplay
              split={newSplit}
              editableTitle
              onEdit={(e) =>
                dispatch({
                  type: actions.ADD_UPDATE,
                  data: { value: e.target.value },
                })
              }
            />
          </div>
        )}
      </div>
      <MainButtons
        status={status}
        addItem={() => dispatch({ type: actions.ADD_ITEM })}
        addCancel={() => dispatch({ type: actions.ADD_CANCEL })}
        addSave={() => dispatch({ type: actions.ADD_SAVE })}
        orderItems={() => dispatch({ type: actions.ORDER_ITEMS })}
        orderSave={() => dispatch({ type: actions.ORDER_SAVE })}
        orderCancel={() => dispatch({ type: actions.ORDER_CANCEL })}
      />
    </>
  );
}
