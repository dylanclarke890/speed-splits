import React from "react";

export default function TimerControls({
  active,
  paused,
  onStart,
  onPauseResume,
  onReset,
}) {
  const startButton = (
    <div className="btn btn-one btn-start" onClick={onStart}>
      Start
    </div>
  );
  const activeButtons = (
    <div className="btn-grp">
      <button className="btn btn-two" onClick={onReset}>
        Reset
      </button>
      <button className="btn btn-one" onClick={onPauseResume}>
        {paused ? "Resume" : "Pause"}
      </button>
    </div>
  );

  return (
    <div>
      <div>{active ? activeButtons : startButton}</div>
    </div>
  );
}
