import React from "react";
import { formatTime } from "../../helpers/timeFormat";

export default function TimerDisplay({ time }) {
  return (
    <>
      <div className="timer">
        <span className="digits">{formatTime(time, "hour")}:</span>
        <span className="digits">{formatTime(time, "min")}:</span>
        <span className="digits">{formatTime(time, "sec")}.</span>
        <span className="digits mili-sec">{formatTime(time, "ms")}</span>
      </div>
    </>
  );
}
