import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLink from "../AppLink/AppLink";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-actions">
          <AppLink to="/splits">Splits</AppLink>
          <AppLink to="/settings">Advanced</AppLink>
          {location.pathname !== "/" && (
            <button className="app-link" onClick={() => navigate("/")}>
              Back to SplitTimer
            </button>
          )}
        </div>
      </div>
    </>
  );
}
