import React from "react";
import { Link } from "react-router-dom";
import "./AppLink.css";

export default function AppLink({ to, children }) {
  return (
    <>
      <Link to={to}>
        <div className="app-link">{children}</div>
      </Link>
    </>
  );
}
