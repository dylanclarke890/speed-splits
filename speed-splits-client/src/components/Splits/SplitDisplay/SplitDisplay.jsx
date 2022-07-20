import React from "react";
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
          <input
            className="custom-input"
            type="text"
            value={split.title}
            onChange={onEdit}
            autoFocus
          />
        ) : (
          <p className="digits-sm ml-1">{split.title}</p>
        )}
      </div>
    </>
  );
}
