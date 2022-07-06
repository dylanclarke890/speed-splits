import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import SplitTimesDisplay from "./SplitTimesDisplay";
import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";

export default function Timer() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [segmentedTimes, setSegmentedTimes] = useState([]);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
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
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(0);
    setSegmentedTimes([]);
  };

  const handleSplit = () => {
    setSegmentedTimes((times) => [...times, time]);
  };

  return (
    <>
      <TimerDisplay time={time} />
      <TimerControls
        active={isActive}
        paused={isPaused}
        onStart={handleStart}
        onPauseResume={handlePauseResume}
        onReset={handleReset}
        onSplit={handleSplit}
      />
      <SplitTimesDisplay times={segmentedTimes} />
    </>
  );
}
