import React from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import {
  addToStorage,
  getFromStorage,
  removeFromStorage,
} from "../../helpers/storage";
import SplitTimesDisplay from "./SplitTimesDisplay/SplitTimesDisplay";
import TimerControls from "./TimerControls/TimerControls";
import TimerDisplay from "./TimerDisplay/TimerDisplay";

const CURR_TIME = "currentTime";
const IS_RUNNING = "isRunning";
const SEGMENTS = "segments";

const clearLocalStorage = () => {
  removeFromStorage(CURR_TIME);
  removeFromStorage(IS_RUNNING);
  removeFromStorage(SEGMENTS);
};

export default function Timer() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [segmentedTimes, setSegmentedTimes] = useState([]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    addToStorage(IS_RUNNING, true);
  };

  const handlePauseResume = useCallback(() => {
    setIsPaused((curr) => {
      addToStorage(IS_RUNNING, curr);
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
      addToStorage(SEGMENTS, newSegments, true);
      return newSegments;
    });
  }, [time]);

  const handleKeyPress = useCallback(
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
          if (isActive) handleSplit();
          else handleStart();
          break;
        default:
          break;
      }
    },
    [handlePauseResume, handleSplit, isActive, isPaused]
  );

  useEffect(() => {
    const storedTime = getFromStorage(CURR_TIME);
    setTime(storedTime ? parseInt(storedTime) : 0);
    setSegmentedTimes(() => getFromStorage(SEGMENTS, true) ?? []);
    const running = getFromStorage(IS_RUNNING, true);
    setIsPaused(!running);
    setIsActive(running);
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => {
          time += 10;
          addToStorage(CURR_TIME, time);
          return time;
        });
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  return (
    <>
      <div>
        <TimerDisplay time={time} />
        <TimerControls
          active={isActive || time > 0}
          paused={isPaused}
          onStart={handleStart}
          onPauseResume={handlePauseResume}
          onReset={handleReset}
          onSplit={handleSplit}
        />
        <SplitTimesDisplay times={segmentedTimes} />
      </div>
    </>
  );
}
