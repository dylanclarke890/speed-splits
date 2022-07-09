import React from "react";
import TimeDisplay from "../../Shared/TimeDisplay/TimeDisplay";

export default function SegmentDisplay({ segment }) {
  return (
    <>
      <h3 className="text-center">{segment.title}</h3>
      <TimeDisplay time={segment.time} small />
    </>
  );
}
