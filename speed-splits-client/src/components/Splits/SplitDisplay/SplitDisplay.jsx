import React from "react";
import TimeDisplay from "../../Shared/TimeDisplay/TimeDisplay";

export default function SplitDisplay({ split }) {
  return (
    <>
      <h3 className="text-center">{split.title}</h3>
      <TimeDisplay time={split.time} small />
    </>
  );
}
