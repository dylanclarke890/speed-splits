import React from "react";
import { TimeFormatting } from "../../../services/utils/dateTime/time";

export default function AlternateSplitDisplay({ settings, onChange }) {
  return (
    <>
      <div className="d-flex">
        {settings.showTime && (
          <div
            className={`digits digits-sm text-center d-flex place-i-center justify-center`}
          >
            {TimeFormatting.toString(settings.split.time, "hour")}:
            {TimeFormatting.toString(settings.split.time, "min")}:
            {TimeFormatting.toString(settings.split.time, "sec")}
            <span className="milli">
              .{TimeFormatting.toString(settings.split.time, "ms")}
            </span>
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
