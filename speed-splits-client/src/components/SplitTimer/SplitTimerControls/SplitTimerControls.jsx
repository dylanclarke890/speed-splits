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
  const startButton = <ControlButton name="Start" onClick={onStart} isMain />;
  const activeButtons = (
    <>
      <ControlButton name="Reset" onClick={onReset} />
      {paused ? null : <ControlButton name="Split" onClick={onSplit} />}
      <ControlButton
        name={paused ? "Resume" : "Pause"}
        onClick={onPauseResume}
        isMain
      />
      <ControlButton name="Stop" onClick={onStop} isMain />
    </>
  );

  return (
    <div className="timer-controls d-flex justify-center mt-1">
      <div>{active ? activeButtons : startButton}</div>
    </div>
  );
}
