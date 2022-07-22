import React, { useReducer, useEffect } from "react";
import { GlobalEvents } from "../../utils/events";
import { useOnInit } from "../../utils/react/custom-hooks";
import { timerActions, timerStatus } from "../../models/constants";
import {
  initialTimerState,
  timerStateReducer,
} from "../../utils/react/reducers";
import SplitsList from "../Splits/SplitsList/SplitsList";
import SplitTimerControls from "./SplitTimerControls/SplitTimerControls";
import TimeDisplay from "../Shared/TimeDisplay/TimeDisplay";

export default function SplitTimer() {
  const [tState, dispatch] = useReducer(timerStateReducer, initialTimerState);

  const onKeyPress = (e) => {
    const action = (action) => dispatch({ type: action });
    const status = tState.status;
    switch (e.key.toUpperCase()) {
      case "ENTER":
      case "P": {
        if (status === timerStatus.RUNNING || status === timerStatus.PAUSED)
          action(timerActions.PAUSE_RESUME);
        else action(timerActions.START);
        break;
      }
      case " ": {
        if (status === timerStatus.PAUSED) action(timerActions.PAUSE_RESUME);
        if (status === timerStatus.RUNNING) action(timerActions.SPLIT);
        else action(timerActions.START);
        break;
      }
      case "R": {
        action(timerActions.RESET);
        break;
      }
      case "U": {
        action(timerActions.UNDO);
        break;
      }
      case "ESCAPE": {
        action(timerActions.STOP);
        break;
      }
      default:
        break;
    }
  };
  useOnInit(() => {
    dispatch({ type: timerActions.INITIALIZE });
    GlobalEvents.Add("keydown", onKeyPress);
    return () => {
      GlobalEvents.Remove("keydown", onKeyPress);
    };
  });

  useEffect(() => {
    let interval = null;
    if (tState.status === timerStatus.RUNNING)
      interval = setInterval(() => dispatch({ type: timerActions.TICK }), 10);
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
          onStart={() => dispatch({ type: timerActions.START })}
          onPauseResume={() => dispatch({ type: timerActions.PAUSE_RESUME })}
          onSplit={() => dispatch({ type: timerActions.SPLIT })}
          onUndo={() => dispatch({ type: timerActions.UNDO })}
          onReset={() => dispatch({ type: timerActions.RESET })}
          onStop={() => dispatch({ type: timerActions.STOP })}
        />
      </div>
    </>
  );
}
