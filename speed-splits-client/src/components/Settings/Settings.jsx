import React from "react";
import { useState, useEffect } from "react";
import { defaultTimerKeyBinds } from "../../services/reducers/splitTimerReducer";
import Storage from "../../services/utils/global/storage";

export default function Settings() {
  const [keyBinds, setKeyBinds] = useState({});

  useEffect(() => {
    setKeyBinds(Storage.Get(Storage.Keys.KEY_BINDS.id) || defaultTimerKeyBinds);
  }, []);

  return (
    <>
      <div>
        <h2>Key Binds</h2>
        <div>Start Timer: {keyBinds.START}</div>
        <div>Pause/Resume Timer: {keyBinds.PAUSE_RESUME}</div>
        <div>Split: {keyBinds.SPLIT}</div>
        <div>Undo Split: {keyBinds.UNDO}</div>
        <div>Reset Timer: {keyBinds.RESET}</div>
        <div>Stop Timer: {keyBinds.STOP}</div>
      </div>
    </>
  );
}
