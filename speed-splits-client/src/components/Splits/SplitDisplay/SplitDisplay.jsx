import React from "react";
import TimeDisplay from "../../Shared/TimeDisplay/TimeDisplay";

export default function SplitDisplay({ split }) {
  return (
    <>
      <div className="d-flex">
        <TimeDisplay time={split.time} small />
        <p className="digits-sm ml-1">{split.title}</p>
      </div>
    </>
  );
}
