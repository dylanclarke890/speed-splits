import React from "react";
import { useState, useCallback, useEffect } from "react";
import GlobalEvents from "../../helpers/GlobalEvents";
import Storage from "../../helpers/Storage";
import SegmentsList from "./SegmentsList/SegmentsDisplay";
import SplitTimerControls from "./SplitTimerControls/SplitTimerControls";
import TimeDisplay from "./TimeDisplay/TimeDisplay";

const timerKeys = {
  CURR_TIME: "currentTime",
  IS_RUNNING: "isRunning",
  SEGMENTS: "segments",
};
const clearLocalStorage = () => {
  Storage.Delete(timerKeys.CURR_TIME);
  Storage.Delete(timerKeys.IS_RUNNING);
  Storage.Delete(timerKeys.SEGMENTS);
};

export default function SplitTimer() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [segmentedTimes, setSegmentedTimes] = useState([]);
  const [time, setTime] = useState(0);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    Storage.AddOrUpdate(timerKeys.IS_RUNNING, true);
  };

  const handlePauseResume = useCallback(() => {
    setIsPaused((curr) => {
      Storage.AddOrUpdate(timerKeys.IS_RUNNING, curr);
      return !curr;
    });
    if (!isActive) setIsActive(true);
  }, [isActive]);

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(0);
    setSegmentedTimes([]);
    clearLocalStorage();
  };

  const handleSplit = useCallback(() => {
    setSegmentedTimes((times) => {
      const newSegments = [...times, time];
      Storage.AddOrUpdate(timerKeys.SEGMENTS, newSegments, true);
      return newSegments;
    });
  }, [time]);

  const handleShortcutPress = useCallback(
    (e) => {
      switch (e.key) {
        case "Enter":
        case "P":
        case "p":
          if (isActive) handlePauseResume();
          else handleStart();
          break;
        case "Escape":
        case "R":
        case "r":
          handleReset();
          break;
        case " ":
        case "S":
        case "s":
          if (isActive && isPaused) handlePauseResume();
          if (isActive && !isPaused) handleSplit();
          else handleStart();
          break;
        default:
          break;
      }
    },
    [handlePauseResume, handleSplit, isActive, isPaused]
  );

  useEffect(() => {
    const storedTime = Storage.Get(timerKeys.CURR_TIME);
    setTime(storedTime ? parseInt(storedTime) : 0);
    setSegmentedTimes(() => Storage.Get(timerKeys.SEGMENTS, true) ?? []);
    const running = Storage.Get(timerKeys.IS_RUNNING, true);
    setIsPaused(!running);
    setIsActive(running);
    GlobalEvents.Add("keydown", handleShortcutPress);
    return () => {
      GlobalEvents.Remove("keydown", handleShortcutPress);
    };
  }, [handleShortcutPress]);

  useEffect(() => {
    let timerInterval = null;
    if (isActive && !isPaused) {
      timerInterval = setInterval(
        () => {
          setTime((time) => {
            time += document.hidden ? 1000 : 10; // account for page throttling
            Storage.AddOrUpdate(timerKeys.CURR_TIME, time);
            return time;
          });
        },
        document.hidden ? 1000 : 10
      );
    } else clearInterval(timerInterval);
    return () => {
      clearInterval(timerInterval);
    };
  }, [isActive, isPaused]);

  return (
    <>
      <div>
        <TimeDisplay time={time} />
        <SplitTimerControls
          active={isActive || time > 0}
          paused={isPaused}
          onStart={handleStart}
          onPauseResume={handlePauseResume}
          onReset={handleReset}
          onSplit={handleSplit}
        />
        <SegmentsList times={segmentedTimes} />
      </div>
    </>
  );
}
