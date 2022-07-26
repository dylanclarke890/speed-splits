import React from "react";
import { useState, useEffect } from "react";
import { defaultTimerKeyBinds } from "../../services/reducers/splitTimerReducer";
import Storage from "../../services/utils/global/storage";
import KeyBindSetting from "./KeyBindSetting/KeyBindSetting";
import Dialog from "../Shared/Dialog/Dialog";

export default function Settings() {
  const [keyBinds, setKeyBinds] = useState(defaultTimerKeyBinds);
  const [editingBind, setEditingBind] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [dlgSettings, setDlgSettings] = useState({
    show: false,
    message: "",
  });

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
    for (let bindKey in binds) {
      const bind = binds[bindKey];
      if (bind.code === e.code && bindKey !== id) {
        const newDlgSettings = {
          show: true,
          message: (
            <p className="text-center">
              Are you sure you want to assign {e.code} to{" "}
              {binds[id].displayName}? Doing so will override your existing
              setting for {bind.displayName}.
            </p>
          ),
          onConfirm: () => {
            binds[id].code = e.code;
            setKeyBinds((_) => binds);
            deleteBind(bindKey);
            setDlgSettings((_) => ({ show: false, message: "" }));
          },
          onCancel: () => {
            setDlgSettings((_) => ({ show: false, message: "" }));
          },
        };
        setDlgSettings((_) => newDlgSettings);
        return;
      }
    }
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
      {dlgSettings.show && (
        <Dialog
          content={dlgSettings.message}
          onConfirm={dlgSettings.onConfirm}
          onCancel={dlgSettings.onCancel}
          small
        />
      )}
    </>
  );
}
