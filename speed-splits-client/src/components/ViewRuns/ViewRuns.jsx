import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { runStorageKeys } from "../../models/constants";
import { Run } from "../../models/core";
import Storage from "../../utils/Storage";
import "./ViewRuns.css";

export default function ViewRuns() {
  const [runs, setRuns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRuns((_) => Storage.Get(runStorageKeys.RUNS, true) || []);
  }, []);

  useEffect(() => {
    if (runs.length > 0) Storage.AddOrUpdate(runStorageKeys.RUNS, runs, true);
  }, [runs]);

  const newRun = () => {
    setRuns((curr) => [...curr, new Run()]);
  };

  const editRun = (i) => {
    Storage.AddOrUpdate(runStorageKeys.SELECTED_RUN, i);
    navigate("/edit-run");
  };

  const copyRun = (i) => {
    const run = runs[i];
    const runCopy = JSON.parse(JSON.stringify(run));
    setRuns((curr) => [...curr, runCopy]);
  };

  const deleteRun = (i) => {
    const run = runs[i];
    const newRuns = runs.filter((r) => r !== run);
    setRuns((_) => [...newRuns]);
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
      </div>
    </>
  );
}
