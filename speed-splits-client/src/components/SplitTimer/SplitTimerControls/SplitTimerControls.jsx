import React from "react";
import { timerStatus as statuses } from "../../../services/reducers/splitTimerReducer";
import "./SplitTimerControls.css";

const TimerBtn = ({ name, isMain, onClick }) => (
  <button className={isMain ? "btn btn-red" : "btn"} onClick={onClick}>
    {name}
  </button>
);

export default function SplitTimerControls({
  status,
  onStart,
  onPauseResume,
  onReset,
  onSplit,
  onUndo,
  onStop,
}) {
  const buttons = {
    start: { name: "Start", onClick: onStart, isMain: true },
    stop: { name: "Stop", onClick: onStop, isMain: true },
    reset: { name: "Reset", onClick: onReset, isMain: false },
    split: { name: "Split", onClick: onSplit, isMain: false },
    undo: { name: "Undo", onClick: onUndo, isMain: false },
    pauseResume: {
      name: status === statuses.PAUSED ? "Resume" : "Pause",
      onClick: onPauseResume,
      isMain: true,
    },
  };

  const activeButtons = [];
  switch (status) {
    case statuses.INITIAL:
      activeButtons.push(buttons.start);
      break;
    case statuses.RUNNING:
      activeButtons.push(buttons.pauseResume, buttons.split, buttons.undo);
      break;
    case statuses.PAUSED:
      activeButtons.push(buttons.pauseResume, buttons.stop);
      break;
    case statuses.STOPPED:
      activeButtons.push(buttons.reset);
      break;
    default:
      break;
  }

  return (
    <div className="timer-controls d-flex justify-center mt-1">
      <div>
        {activeButtons.map((btn) => {
          return (
            <TimerBtn
              name={btn.name}
              key={btn.name}
              onClick={btn.onClick}
              isMain={btn.isMain}
            />
          );
        })}
      </div>
    </div>
  );
}
