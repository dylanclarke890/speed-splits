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

  useOnInit(() => {
    dispatch({ type: timerActions.INITIALIZE });
    const onKeyPress = (e) =>
      dispatch({ type: timerActions.KEYPRESS, data: { e } });
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
