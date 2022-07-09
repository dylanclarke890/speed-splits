import React from "react";
import SegmentDisplay from "../SegmentDisplay/SegmentDisplay";

export default function SegmentsList({ segments }) {
  return (
    <>
      <div className="split-times">
        {segments
          .sort((a, b) => a.order - b.order)
          .map((s) => (
            <SegmentDisplay segment={s} key={s.order} />
          ))}
      </div>
    </>
  );
}
