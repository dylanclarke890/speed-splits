import React from "react";
import { Time } from "../../../utils/formatting";

export default function TimeDisplay({ time, small }) {
  const classes = `digits text-center ${small ? "digits-sm" : null}`;
  return (
    <>
      <div className={classes}>
        <span>{Time.toString(time, "hour")}:</span>
        <span>{Time.toString(time, "min")}:</span>
        <span>{Time.toString(time, "sec")}</span>
        <span className="milli">.{Time.toString(time, "ms")}</span>
      </div>
    </>
  );
}
