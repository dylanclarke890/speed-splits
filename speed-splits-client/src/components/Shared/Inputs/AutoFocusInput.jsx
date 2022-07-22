import React from "react";

export default function AutoFocusTextInput({ value, onChange }) {
  return (
    <input
      className="custom-input"
      type="text"
      value={value}
      onChange={onChange}
      autoFocus
    />
  );
}
