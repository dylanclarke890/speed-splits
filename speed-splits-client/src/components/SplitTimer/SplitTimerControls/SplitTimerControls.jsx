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
  onStop,
}) {
  const start = <ControlButton name="Start" onClick={onStart} isMain />;
  const stop = <ControlButton name="Stop" onClick={onStop} isMain />;
  const reset = <ControlButton name="Reset" onClick={onReset} />;
  const split = <ControlButton name="Split" onClick={onSplit} />;
  const pauseResume = (
    <ControlButton
      name={paused ? "Resume" : "Pause"}
      onClick={onPauseResume}
      isMain
    />
  );

  const buttons = [];
  if (paused && !active) buttons.push(start);
  if (paused && active) buttons.push([pauseResume, stop, reset]);
  if (!paused && active) buttons.push([pauseResume, split]);

  return (
    <div className="timer-controls d-flex justify-center mt-1">
      <div>{buttons}</div>
    </div>
  );
}
