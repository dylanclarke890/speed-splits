import React from "react";
import "./SplitTimerControls.css";

const ControlButton = ({ name, isMain, onClick }) => (
  <button className={isMain ? "btn btn-red" : "btn"} onClick={onClick}>
    {name}
  </button>
);

export default function SplitTimerControls({
  active,
  paused,
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
      name: paused ? "Resume" : "Pause",
      onClick: onPauseResume,
      isMain: true,
    },
  };

  const activeButtons = [];
  if (paused && !active) activeButtons.push(buttons.start);
  if (paused && active)
    activeButtons.push(buttons.pauseResume, buttons.stop, buttons.reset);
  if (!paused && active)
    activeButtons.push(buttons.pauseResume, buttons.split, buttons.undo);
  return (
    <div className="timer-controls d-flex justify-center mt-1">
      <div>
        {activeButtons.map((btn) => {
          return (
            <ControlButton
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
