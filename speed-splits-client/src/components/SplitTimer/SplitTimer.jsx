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
  const [state, dispatch] = useReducer(splitTimerReducer, initialTimerState);
  const { currentTime, splits, status } = state;

  const onKeyPress = (e) => dispatch({ type: actions.KEYPRESS, data: { e } });
  useOnInit(() => {
    dispatch({ type: actions.INITIALIZE });
    GlobalEvents.Add("keydown", onKeyPress);
    return () => {
      GlobalEvents.Remove("keydown", onKeyPress);
    };
  });

  useEffect(() => {
    let interval = null;
    if (status === statuses.RUNNING)
      interval = setInterval(() => dispatch({ type: actions.TICK }), 10);
    else clearInterval(interval);
    return () => {
      clearInterval(interval);
    };
  }, [status]);

  return (
    <>
      <div>
        <TimeDisplay time={currentTime} />
        <SplitsList splits={splits} />
        <SplitTimerControls
          status={status}
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
