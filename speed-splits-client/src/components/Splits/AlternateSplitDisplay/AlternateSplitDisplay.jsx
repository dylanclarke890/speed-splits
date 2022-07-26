import React from "react";
import { Time } from "../../../services/utils/dateTime/time";

export default function AlternateSplitDisplay({ split, onChange }) {
  return (
    <>
      <div className="d-flex">
        {showTime && (
          <div
            className={`digits digits-sm text-center d-flex place-i-center justify-center`}
          >
            {Time.toString(split.time, "hour")}:
            {Time.toString(split.time, "min")}:
            {Time.toString(split.time, "sec")}
            <span className="milli">.{Time.toString(split.time, "ms")}</span>
          </div>
        )}
        {editableTitle ? (
          <AutoFocusTextInput value={split.title} onChange={onChange} />
        ) : (
          <p className="digits-sm ml-1">{split.title}</p>
        )}
      </div>
    </>
  );
}
