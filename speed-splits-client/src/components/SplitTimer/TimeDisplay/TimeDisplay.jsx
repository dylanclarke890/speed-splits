import React from "react";
import Time from "../../../helpers/Time";

export default function TimeDisplay({ time, small }) {
  const classes = small ? "digits digits-sm text-center" : "digits text-center";
  return (
    <>
      <div className={classes}>
        <span>{Time.formatTime(time, "hour")}:</span>
        <span>{Time.formatTime(time, "min")}:</span>
        <span>{Time.formatTime(time, "sec")}.</span>
        <span className="milli">{Time.formatTime(time, "ms")}</span>
      </div>
    </>
  );
}
