import React from "react";
import AutoFocusTextInput from "../../Shared/Inputs/AutoFocusInput";
import TimeDisplay from "../../Shared/TimeDisplay/TimeDisplay";

export default function SplitDisplay({
  split,
  showTime,
  editableTitle,
  onEdit,
}) {
  return (
    <>
      <div className="d-flex">
        {showTime && <TimeDisplay time={split.time} small />}
        {editableTitle ? (
          <AutoFocusTextInput value={split.title} onChange={onEdit} />
        ) : (
          <p className="digits-sm ml-1">{split.title}</p>
        )}
      </div>
    </>
  );
}
