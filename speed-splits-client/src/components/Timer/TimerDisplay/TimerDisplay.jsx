import React from "react";
import { formatTime } from "../../../helpers/timeFormat";

export default function TimerDisplay({ time, small }) {
  return (
    <>
      <div
        className={
          small ? "digits digits-sm text-center" : "digits text-center"
        }
      >
        <span>{formatTime(time, "hour")}:</span>
        <span>{formatTime(time, "min")}:</span>
        <span>{formatTime(time, "sec")}.</span>
        <span className="milli">{formatTime(time, "ms")}</span>
      </div>
    </>
  );
}
