import React from "react";
import { useState, useEffect } from "react";
import { defaultTimerKeyBinds } from "../../services/reducers/splitTimerReducer";
import Storage from "../../services/utils/global/storage";
import KeyBindSetting from "./KeyBindSetting/KeyBindSetting";

export default function Settings() {
  const [keyBinds, setKeyBinds] = useState(defaultTimerKeyBinds);
  const [editingBind, setEditingBind] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setKeyBinds(Storage.Get(Storage.Keys.KEY_BINDS.id) || defaultTimerKeyBinds);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) Storage.AddOrUpdate(Storage.Keys.KEY_BINDS.id, keyBinds);
  }, [keyBinds, initialized]);

  const toggleBindToEdit = (id) => {
    let value;
    if (id === editingBind) value = "";
    else value = id;
    setEditingBind((_) => value);
  };

  const clearEditingSelection = () => {
    setEditingBind((_) => "");
  };

  const updateBind = (e, id) => {
    const binds = { ...keyBinds };
    binds[id].code = e.code;
    setKeyBinds((_) => binds);
  };

  const resetBind = (id) => {
    const binds = { ...keyBinds };
    binds[id].code = defaultTimerKeyBinds[id].code;
    setKeyBinds((_) => binds);
  };

  const deleteBind = (id) => {
    const binds = { ...keyBinds };
    binds[id].code = "";
    setKeyBinds((_) => binds);
  };

  const keyBindSettings = Object.entries(keyBinds).map((key) => {
    const id = key[0];
    const { code, displayName } = key[1];
    return (
      <KeyBindSetting
        key={id}
        id={id}
        name={displayName}
        value={code}
        isEditing={id === editingBind}
        onClick={toggleBindToEdit}
        onFocusOut={clearEditingSelection}
        onEdit={updateBind}
        onReset={resetBind}
        onDelete={deleteBind}
      />
    );
  });

  return (
    <>
      <div>
        <h2>Timer Key Binds</h2>
        {keyBindSettings}
        <button
          className="app-link"
          onClick={() => setKeyBinds((_) => defaultTimerKeyBinds)}
        >
          Reset all to default
        </button>
      </div>
    </>
  );
}
