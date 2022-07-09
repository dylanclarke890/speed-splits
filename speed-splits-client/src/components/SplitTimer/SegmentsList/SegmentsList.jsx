import React from "react";
import TimeDisplay from "../TimeDisplay/TimeDisplay";

export default function SegmentsList({ times }) {
  return (
    <>
      <div className="split-times">
        {times.map((t) => (
          <TimeDisplay time={t} small key={t} />
        ))}
      </div>
    </>
  );
}
