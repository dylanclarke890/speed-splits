import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Run } from "../../services/utils/global/models";
import Clone from "../../services/utils/objectHandling/clone";
import Storage from "../../services/utils/global/storage";
import Dialog from "../Shared/Dialog/Dialog";
import "./ViewRuns.css";

export default function ViewRuns() {
  const [runs, setRuns] = useState([]);
  const [deletingId, setDeletingId] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    setRuns((_) => Storage.Get(Storage.Keys.RUNS.id) || []);
  }, []);

  useEffect(() => {
    if (runs.length > 0) Storage.AddOrUpdate(Storage.Keys.RUNS.id, runs);
  }, [runs]);

  const newRun = () => {
    setRuns((curr) => [...curr, new Run()]);
  };

  const editRun = (i) => {
    Storage.AddOrUpdate(Storage.Keys.SELECTED_RUN.id, i);
    navigate("/edit-run");
  };

  const copyRun = (i) => {
    const run = runs[i];
    setRuns((curr) => [...curr, Clone.Simple(run)]);
  };

  const deleteRun = (i) => {
    setDeletingId((_) => i);
  };

  const cancelDeleteRun = () => {
    setDeletingId((_) => -1);
  };

  const confirmDeleteRun = () => {
    const run = runs[deletingId];
    const newRuns = runs.filter((r) => r !== run);
    setRuns((_) => [...newRuns]);
    setDeletingId(-1);
  };

  return (
    <>
      <button className="app-link" onClick={newRun}>
        New
      </button>
      <div className="runs">
        {runs.map((v, i) => (
          <div className="run-display" key={v.name + i}>
            <div className="run-name">{v.name}</div>
            <div className="run-actions">
              <button className="app-link" onClick={() => editRun(i)}>
                Edit Run
              </button>
              <button className="app-link" onClick={() => deleteRun(i)}>
                Delete
              </button>
              <button className="app-link" onClick={() => copyRun(i)}>
                Copy
              </button>
            </div>
          </div>
        ))}

        {deletingId >= 0 && (
          <Dialog
            content={
              <p className="text-center">
                Are you sure you want to delete this run?
              </p>
            }
            onConfirm={confirmDeleteRun}
            onCancel={cancelDeleteRun}
            small
          />
        )}
      </div>
    </>
  );
}
