import React from "react";
import TimerDisplay from "../TimerDisplay/TimerDisplay";

export default function SplitTimesDisplay({ times }) {
  return (
    <>
      <div className="split-times">
        {times.map((t) => (
          <TimerDisplay time={t} small/>
        ))}
      </div>
    </>
  );
}
