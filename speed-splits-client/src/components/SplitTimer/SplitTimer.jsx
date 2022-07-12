import React from "react";
import { useReducer, useEffect } from "react";
import { timerActions, timerStatus } from "../../models/core";
import { GlobalEvents } from "../../utils/events";
import { useOnInit } from "../../utils/react/custom-hooks";
import { timerStateReducer } from "../../utils/react/reducers";
import SplitsList from "../Splits/SplitsList/SplitsList";
import SplitTimerControls from "./SplitTimerControls/SplitTimerControls";
import TimeDisplay from "../Shared/TimeDisplay/TimeDisplay";

export default function SplitTimer() {
  const [tState, dispatch] = useReducer(timerStateReducer, {
    status: timerStatus.INITIAL,
    splits: [],
    currentSplit: 0,
    time: 0,
    timestampRef: 0,
    recordedTimes: [],
  });

  const start = () => dispatch({ type: timerActions.START }),
    tick = () => dispatch({ type: timerActions.TICK }),
    pauseResume = () => dispatch({ type: timerActions.PAUSE_RESUME }),
    split = () => dispatch({ type: timerActions.SPLIT }),
    undo = () => dispatch({ type: timerActions.UNDO }),
    reset = () => dispatch({ type: timerActions.RESET }),
    stop = () => dispatch({ type: timerActions.STOP });

  const timerShortcutPress = (e) => {
    switch (e.key.toUpperCase()) {
      case "ENTER":
      case "P": {
        const status = tState.status;
        if (status === timerStatus.RUNNING || status === timerStatus.PAUSED)
          pauseResume();
        else start();
        break;
      }
      case "R": {
        reset();
        break;
      }
      case " ":
      case "S": {
        const status = tState.status;
        if (status === timerStatus.PAUSED) pauseResume();
        if (status === timerStatus.RUNNING) split();
        else start();
        break;
      }
      case "U": {
        undo();
        break;
      }
      case "ESCAPE": {
        stop();
        break;
      }
      default:
        break;
    }
  };

  useOnInit(() => {
    dispatch({ type: timerActions.INITIALIZE });
    GlobalEvents.Add("keydown", timerShortcutPress);
    return () => {
      GlobalEvents.Remove("keydown", timerShortcutPress);
    };
  });

  useEffect(() => {
    let interval = null;
    if (tState.status === timerStatus.RUNNING)
      interval = setInterval(() => {
        tick();
      }, 10);
    else clearInterval(interval);
    return () => {
      clearInterval(interval);
    };
  }, [tState.status]);

  return (
    <>
      <div>
        <TimeDisplay time={tState.time} />
        <SplitTimerControls
          status={tState.status}
          onStart={start}
          onPauseResume={pauseResume}
          onSplit={split}
          onUndo={undo}
          onReset={reset}
          onStop={stop}
        />
        <SplitsList splits={tState.splits} />
      </div>
    </>
  );
}
