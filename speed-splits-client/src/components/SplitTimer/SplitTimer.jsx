import React, { useReducer, useEffect } from "react";
import { useOnInit } from "../../services/custom-hooks/onInit";
import { GlobalEvents } from "../../services/utils/global/events";
import {
  initialTimerState,
  splitTimerReducer,
  timerActions as actions,
  timerStatus as statuses,
} from "../../services/reducers/splitTimerReducer";
import SplitsList from "../Splits/SplitsList/SplitsList";
import SplitTimerControls from "./SplitTimerControls/SplitTimerControls";
import TimeDisplay from "../Shared/TimeDisplay/TimeDisplay";

export default function SplitTimer() {
  const [tState, dispatch] = useReducer(splitTimerReducer, initialTimerState);

  const onKeyPress = (e) => {
    const action = (action) => dispatch({ type: action });
    const status = tState.status;
    switch (e.key.toUpperCase()) {
      case "ENTER":
      case "P": {
        if (status === statuses.RUNNING || status === statuses.PAUSED)
          action(actions.PAUSE_RESUME);
        else action(actions.START);
        break;
      }
      case " ": {
        if (status === statuses.PAUSED) action(actions.PAUSE_RESUME);
        if (status === statuses.RUNNING) action(actions.SPLIT);
        else action(actions.START);
        break;
      }
      case "R": {
        action(actions.RESET);
        break;
      }
      case "U": {
        action(actions.UNDO);
        break;
      }
      case "ESCAPE": {
        action(actions.STOP);
        break;
      }
      default:
        break;
    }
  };
  useOnInit(() => {
    dispatch({ type: actions.INITIALIZE });
    GlobalEvents.Add("keydown", onKeyPress);
    return () => {
      GlobalEvents.Remove("keydown", onKeyPress);
    };
  });

  useEffect(() => {
    let interval = null;
    if (tState.status === statuses.RUNNING)
      interval = setInterval(() => dispatch({ type: actions.TICK }), 10);
    else clearInterval(interval);
    return () => {
      clearInterval(interval);
    };
  }, [tState.status]);

  return (
    <>
      <div>
        <TimeDisplay time={tState.time} />
        <SplitsList splits={tState.splits} />
        <SplitTimerControls
          status={tState.status}
          onStart={() => dispatch({ type: actions.START })}
          onPauseResume={() => dispatch({ type: actions.PAUSE_RESUME })}
          onSplit={() => dispatch({ type: actions.SPLIT })}
          onUndo={() => dispatch({ type: actions.UNDO })}
          onReset={() => dispatch({ type: actions.RESET })}
          onStop={() => dispatch({ type: actions.STOP })}
        />
      </div>
    </>
  );
}
