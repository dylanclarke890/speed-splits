import React from "react";
import { parseMilliseconds } from "dc-javascript-utils";
import { Time } from "../../../services/utils/dateTime/time";

export default function TimeDisplay({ time, small }) {
  const classes = `digits text-center d-flex place-i-center justify-center ${
    small ? "digits-sm" : null
  }`;
  return (
    <>
      <div className={classes}>
        {parseMilliseconds(time)}
        {Time.toString(time, "hour")}:{Time.toString(time, "min")}:
        {Time.toString(time, "sec")}
        <span className="milli">.{Time.toString(time, "ms")}</span>
      </div>
    </>
  );
}
