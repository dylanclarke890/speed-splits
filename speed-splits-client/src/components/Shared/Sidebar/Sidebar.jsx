import React from "react";
import { useLocation } from "react-router-dom";
import AppLink from "../AppLink/AppLink";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  return (
    <>
      <div className="sidebar">
        <div className="sidebar-actions">
          <AppLink to="/test">Test</AppLink>
          <AppLink to="/ing">ing</AppLink>
          {location.pathname !== "/" && <AppLink to="/">Back</AppLink>}
        </div>
      </div>
    </>
  );
}
