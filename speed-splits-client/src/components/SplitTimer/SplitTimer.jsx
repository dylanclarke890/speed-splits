import React from "react";
import { useReducer, useEffect } from "react";
import { timerActions } from "../../models/core";
import { GlobalEvents } from "../../utils/events";
import { useOnInit } from "../../utils/react/custom-hooks";
import { timerStateReducer } from "../../utils/react/reducers";
import SplitsList from "../Splits/SplitsList/SplitsList";
import SplitTimerControls from "./SplitTimerControls/SplitTimerControls";
import TimeDisplay from "../Shared/TimeDisplay/TimeDisplay";

export default function SplitTimer() {
  const [tState, dispatch] = useReducer(timerStateReducer, {
    isActive: false,
    isPaused: false,
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
        if (tState.isActive) pauseResume();
        else start();
        break;
      case "R":
        reset();
        break;
      case " ":
      case "S":
        if (tState.isActive && tState.isPaused) pauseResume();
        if (tState.isActive && !tState.isPaused) split();
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
    if (tState.isActive && !tState.isPaused) {
      timerInterval = setInterval(() => {
        tick();
      }, 10);
    } else clearInterval(timerInterval);
    return () => {
      clearInterval(timerInterval);
    };
  }, [tState.isActive, tState.isPaused]);

  return (
    <>
      <div>
        <TimeDisplay time={tState.time} />
        <SplitTimerControls
          active={tState.isActive || tState.time > 0}
          paused={tState.isPaused}
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
