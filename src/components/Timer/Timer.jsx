import React from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import SplitTimesDisplay from "./SplitTimesDisplay/SplitTimesDisplay";
import TimerControls from "./TimerControls/TimerControls";
import TimerDisplay from "./TimerDisplay/TimerDisplay";

export default function Timer() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [segmentedTimes, setSegmentedTimes] = useState([]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    localStorage.setItem("isRunning", true);
  };

  const handlePauseResume = useCallback(() => {
    setIsPaused((curr) => {
      localStorage.setItem("isRunning", curr);
      return !curr;
    });
    if (!isActive) setIsActive(true);
  }, [isActive]);

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(0);
    setSegmentedTimes([]);
    localStorage.removeItem("currentTime");
    localStorage.removeItem("isRunning");
    localStorage.removeItem("segments");
  };

  const handleSplit = useCallback(() => {
    setSegmentedTimes((times) => {
      const newSegments = [...times, time];
      localStorage.setItem("segments", JSON.stringify(newSegments));
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
          if (isActive) handleSplit();
          else handleStart();
          break;
        default:
          break;
      }
    },
    [handlePauseResume, handleSplit, isActive]
  );

  useEffect(() => {
    const storedTime = localStorage.getItem("currentTime");
    setTime(storedTime ? parseInt(storedTime) : 0);
    setSegmentedTimes(() => JSON.parse(localStorage.getItem("segments")) ?? []);
    const running = JSON.parse(localStorage.getItem("isRunning"));
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
          localStorage.setItem("currentTime", time);
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
