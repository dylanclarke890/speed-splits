import React from "react";
import { useState, useCallback, useEffect } from "react";
import GlobalEvents from "../../helpers/GlobalEvents";
import Storage from "../../helpers/Storage";
import SegmentsList from "../Segments/SegmentsList/SegmentsList";
import SplitTimerControls from "./SplitTimerControls/SplitTimerControls";
import TimeDisplay from "../Shared/TimeDisplay/TimeDisplay";
import Segment from "../../models/Segment";
import { useInit } from "../../custom-hooks/onInit";

const timerKeys = {
  CURR_TIME: "currentTime",
  IS_RUNNING: "isRunning",
  SEGMENTS: "segments",
  CURRENT_SEGMENT: "currentSegment",
};

const clearLocalStorage = () => {
  Storage.Delete(timerKeys.CURR_TIME);
  Storage.Delete(timerKeys.IS_RUNNING);
  Storage.Delete(timerKeys.SEGMENTS);
  Storage.Delete(timerKeys.CURRENT_SEGMENT);
};

const segments = [
  new Segment("Start", null, 0),
  new Segment("First", null, 1),
  new Segment("Second", null, 2),
  new Segment("Third", null, 3),
  new Segment("", null, 4),
];

export default function SplitTimer() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [segmentedTimes, setSegmentedTimes] = useState(segments); // TODO: Change this
  const [currentSegment, setCurrentSegment] = useState(0);
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
  }, []);

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(0);
    setSegmentedTimes((curr) => {
      curr.forEach((i) => (i.time = null));
      return curr;
    });
    setCurrentSegment(0);
    clearLocalStorage();
  };

  const handleSplit = useCallback(() => {
    if (currentSegment >= segmentedTimes.length) {
      handleStop();
      return;
    }
    setSegmentedTimes((segments) => {
      const update = segments;
      const item = update.find((seg) => seg.order === currentSegment);
      item.time = time;
      Storage.AddOrUpdate(timerKeys.SEGMENTS, segments, true);
      return update;
    });
    setCurrentSegment((curr) => {
      const newVal = curr + 1;
      Storage.AddOrUpdate(timerKeys.CURRENT_SEGMENT, newVal);
      return newVal;
    });
  }, [time, currentSegment, segmentedTimes.length]);

  const handleUndoSplit = useCallback(() => {
    if (segmentedTimes.find((s) => s.time !== null) === undefined) return;
    setSegmentedTimes((segs) => {
      const items = segs;
      segs.find((s) => s.order === currentSegment - 1).time = null;
      Storage.AddOrUpdate(timerKeys.SEGMENTS, items, true);
      return items;
    });
    setCurrentSegment((curr) => {
      const newVal = curr - 1;
      Storage.AddOrUpdate(timerKeys.CURRENT_SEGMENT, newVal);
      return newVal;
    });
  }, [currentSegment, segmentedTimes]);

  const handleShortcutPress = useCallback(
    (e) => {
      switch (e.key) {
        case "Enter":
        case "P":
        case "p":
          if (isActive) handlePauseResume();
          else handleStart();
          break;
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
        case "u":
        case "U":
          handleUndoSplit();
          break;
        case "Escape":
          handleStop();
          break;
        default:
          break;
      }
    },
    [isActive, isPaused, handleUndoSplit, handlePauseResume, handleSplit]
  );

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(true);
    Storage.AddOrUpdate(timerKeys.IS_RUNNING, false);
  };

  useInit(() => {
    setTime(() => Storage.Get(timerKeys.CURR_TIME, true) || 0);
    setSegmentedTimes(() => Storage.Get(timerKeys.SEGMENTS, true) || segments); // TODO: Change this
    setCurrentSegment(() => Storage.Get(timerKeys.CURRENT_SEGMENT, true) || 0);
    const running = Storage.Get(timerKeys.IS_RUNNING, true);
    setIsPaused(!running);
    setIsActive(running);
    GlobalEvents.Add("keydown", handleShortcutPress);
    return () => {
      GlobalEvents.Remove("keydown", handleShortcutPress);
    };
  });

  useEffect(() => {
    let timerInterval = null;
    if (isActive && !isPaused) {
      timerInterval = setInterval(() => {
        setTime((time) => {
          time += document.hidden ? 1000 : 10; // account for page throttling
          Storage.AddOrUpdate(timerKeys.CURR_TIME, time);
          return time;
        });
      }, 10);
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
          onSplit={handleSplit}
          onUndo={handleUndoSplit}
          onReset={handleReset}
          onStop={handleStop}
        />
        <SegmentsList segments={segmentedTimes} />
      </div>
    </>
  );
}
