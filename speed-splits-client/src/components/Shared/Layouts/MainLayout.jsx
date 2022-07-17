import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

export default function MainLayout({ children }) {
  return (
    <section>
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main>{children}</main>
      </div>
    </section>
  );
}
