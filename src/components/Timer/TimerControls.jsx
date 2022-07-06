import React from "react";

export default function TimerControls({
  active,
  paused,
  onStart,
  onPauseResume,
  onReset,
  onSplit,
}) {
  const startButton = (
    <div className="btn btn-one btn-start" onClick={onStart}>
      Start
    </div>
  );
  const activeButtons = (
    <div className="btn-grp">
      <button className="btn" onClick={onReset}>
        Reset
      </button>
      <button className="btn" onClick={onPauseResume}>
        {paused ? "Resume" : "Pause"}
      </button>
      {!paused ? (
        <button className="btn" onClick={onSplit}>
          Split
        </button>
      ) : null}
    </div>
  );

  return (
    <div>
      <div>{active ? activeButtons : startButton}</div>
    </div>
  );
}
