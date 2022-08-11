import { parseMilliseconds } from "dc-javascript-utils";
import React from "react";

export default function TimeDisplay({ time, small }) {
  const classes = `digits text-center d-flex place-i-center justify-center ${
    small ? "digits-sm" : null
  }`;
  const timeObj = parseMilliseconds(time);
  return (
    <>
      <div className={classes}>
        {timeObj.hours}:{timeObj.minutes}:{timeObj.seconds}
        <span className="milli">.{timeObj.milliseconds}</span>
      </div>
    </>
  );
}
