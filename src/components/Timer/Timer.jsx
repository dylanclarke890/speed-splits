import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import SplitTimesDisplay from "./SplitTimesDisplay/SplitTimesDisplay";
import TimerControls from "./TimerControls/TimerControls";
import TimerDisplay from "./TimerDisplay/TimerDisplay";

export default function Timer() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [segmentedTimes, setSegmentedTimes] = useState([]);

  useEffect(() => {
    setTime(parseInt(localStorage.getItem("currentTime")) ?? 0);
    setSegmentedTimes(() => JSON.parse(localStorage.getItem("segments")) ?? []);
    const running = JSON.parse(localStorage.getItem("isRunning"));
    setIsPaused(!running);
    setIsActive(running);
  }, []);

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

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    localStorage.setItem("isRunning", true);
  };

  const handlePauseResume = () => {
    setIsPaused((curr) => {
      localStorage.setItem("isRunning", curr);
      return !curr;
    });
    if (!isActive) setIsActive(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(0);
    setSegmentedTimes([]);
    localStorage.removeItem("currentTime");
    localStorage.removeItem("isRunning");
    localStorage.removeItem("segments");
  };

  const handleSplit = () => {
    setSegmentedTimes((times) => {
      const newSegments = [...times, time];
      localStorage.setItem("segments", JSON.stringify(newSegments));
      return newSegments;
    });
  };

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
