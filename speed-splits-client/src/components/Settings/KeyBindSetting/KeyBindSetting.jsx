import React from "react";

export default function KeyBindSetting({
  id,
  name,
  value,
  isEditing,
  onClick,
  onFocusOut,
  onEdit,
  onReset,
  onDelete,
}) {
  return (
    <div className="d-flex">
      <button
        className={`app-link ${isEditing && "text-red"}`}
        onClick={() => onClick(id)}
        onKeyPress={isEditing ? (e) => onEdit(e, id) : null}
        onBlur={onFocusOut}
      >
        {name}: {value}
      </button>
      <div>
        <button onClick={() => onDelete(id)} className="app-link">
          Clear
        </button>
        <button onClick={() => onReset(id)} className="app-link">
          Reset
        </button>
      </div>
    </div>
  );
}
