import React from "react";
import "./Dialog.css";

export default function Dialog({ content, onConfirm, onCancel, small }) {
  return (
    <>
      <div className="dialog-box">
        <div className={`dialog-inner-box ${small && "dialog-inner-small"}`}>
          <span className="close-icon" onClick={onCancel}>
            x
          </span>
          {content}
          <div className="d-flex justify-evenly">
            <button className="app-link" onClick={onCancel}>
              Cancel
            </button>
            <button className="app-link" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
