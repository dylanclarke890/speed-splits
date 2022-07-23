import React, { useReducer, useEffect } from "react";
import {
  initialEditRunState,
  editRunReducer,
  editRunActions as actions,
  editRunStatus as statuses,
} from "../../services/utils/global/constants";
import SplitDisplay from "../Splits/SplitDisplay/SplitDisplay";
import ItemButtons from "./Controls/ItemButtons";
import MainButtons from "./Controls/MainButtons";
import AutoFocusTextInput from "../Shared/Inputs/AutoFocusInput";

export default function ManageSplits() {
  const [
    { splits, status, selectedItem, newSplit, runs, selectedRun },
    dispatch,
  ] = useReducer(editRunReducer, initialEditRunState);

  useEffect(() => {
    dispatch({ type: actions.INITIALIZE });
  }, []);

  const title = selectedRun > -1 ? runs[selectedRun].name : "Untitled";
  return (
    <>
      {status === statuses.EDITING_TITLE ? (
        <>
          <AutoFocusTextInput
            value={title}
            onChange={(e) =>
              dispatch({
                type: actions.UPDATE,
                data: { value: e.target.value },
              })
            }
          />
          <button
            className="btn"
            onClick={() => dispatch({ type: actions.SAVE })}
          >
            Save
          </button>
          <button
            className="btn"
            onClick={() => dispatch({ type: actions.CANCEL })}
          >
            Cancel
          </button>
        </>
      ) : (
        <h2 onClick={() => dispatch({ type: actions.EDIT_TITLE })}>{title}</h2>
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
                dispatch({ type: actions.ORDER_DRAG_OVER, data: { i, e } });
              }}
              onDrop={(e) =>
                dispatch({ type: actions.ORDER_DROP, data: { i, e } })
              }
            >
              <SplitDisplay
                split={s}
                editableTitle={
                  status === statuses.EDITING && i === selectedItem
                }
                onEdit={(e) =>
                  dispatch({
                    type: actions.UPDATE,
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
                deleteItem={(i) =>
                  dispatch({ type: actions.DELETE_ITEM, data: { i } })
                }
                deleteConfirm={() =>
                  dispatch({ type: actions.DELETE_CONFIRMED })
                }
                save={() => dispatch({ type: actions.SAVE })}
                cancel={() => dispatch({ type: actions.CANCEL })}
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
                  type: actions.UPDATE,
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
        orderItems={() => dispatch({ type: actions.ORDER_ITEMS })}
        save={() => dispatch({ type: actions.SAVE })}
        cancel={() => dispatch({ type: actions.CANCEL })}
      />
    </>
  );
}
