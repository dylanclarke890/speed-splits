import React from "react";
import SplitDisplay from "../SplitDisplay/SplitDisplay";

export default function SplitsList({ splits }) {
  return (
    <>
      <div className="split-times">
        {splits
          .sort((a, b) => a.order - b.order)
          .map((s) => (
            <SplitDisplay split={s} key={s.order} />
          ))}
      </div>
    </>
  );
}
