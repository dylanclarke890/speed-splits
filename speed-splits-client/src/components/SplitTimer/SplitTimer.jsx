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
  });

  const start = () => {
    dispatch({ type: timerActions.START });
  };
  const tick = () => {
    dispatch({ type: timerActions.TICK });
  };
  const pauseResume = () => {
    dispatch({ type: timerActions.PAUSE_RESUME });
  };
  const split = () => {
    dispatch({ type: timerActions.SPLIT });
  };
  const undo = () => {
    dispatch({ type: timerActions.UNDO });
  };
  const reset = () => {
    dispatch({ type: timerActions.RESET });
  };
  const stop = () => {
    dispatch({ type: timerActions.STOP });
  };
  const shortcutPress = (e) => {
    switch (e.key.toUpperCase()) {
      case "ENTER":
      case "P":
        if (
          tState.status === timerStatus.RUNNING ||
          tState.status === timerStatus.RUNNING
        )
          pauseResume();
        else start();
        break;
      case "R":
        reset();
        break;
      case " ":
      case "S":
        if (tState.status === timerStatus.PAUSED) pauseResume();
        if (tState.status === timerStatus.RUNNING) split();
        else start();
        break;
      case "U":
        undo();
        break;
      case "ESCAPE":
        stop();
        break;
      default:
        break;
    }
  };

  useOnInit(() => {
    dispatch({ type: timerActions.INITIALIZE });
    GlobalEvents.Add("keydown", shortcutPress);
    return () => {
      GlobalEvents.Remove("keydown", shortcutPress);
    };
  });

  useEffect(() => {
    let timerInterval = null;
    if (tState.status === timerStatus.RUNNING) {
      timerInterval = setInterval(() => {
        tick();
      }, 10);
    } else clearInterval(timerInterval);
    return () => {
      clearInterval(timerInterval);
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
