import React from "react";
import "./SplitTimerControls.css";

export default function SplitTimerControls({
  active,
  paused,
  onStart,
  onPauseResume,
  onReset,
  onSplit,
}) {
  const startButton = (
    <button className="btn btn-red" onClick={onStart}>
      Start
    </button>
  );
  const activeButtons = (
    <div>
      <button className="btn" onClick={onReset}>
        Reset
      </button>
      {!paused ? (
        <button className="btn" onClick={onSplit}>
          Split
        </button>
      ) : null}
      <button className="btn btn-red" onClick={onPauseResume}>
        {paused ? "Resume" : "Pause"}
      </button>
    </div>
  );

  return (
    <div className="timer-controls d-flex justify-center mt-1">
      <div>{active ? activeButtons : startButton}</div>
    </div>
  );
}
