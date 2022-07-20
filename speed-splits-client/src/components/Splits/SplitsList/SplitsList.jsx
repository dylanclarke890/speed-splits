import React from "react";
import SplitDisplay from "../SplitDisplay/SplitDisplay";
import "./SplitsList.css";

export default function SplitsList({ splits }) {
  return (
    <>
      <div className="split-times">
        {splits
          .sort((a, b) => a.order - b.order)
          .map((s) => (
            <SplitDisplay key={s.order} split={s} showTime />
          ))}
      </div>
    </>
  );
}
