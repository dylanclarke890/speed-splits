import React from "react";
import Navbar from "../Navbar/Navbar";

export default function MainLayout({ children }) {
  return (
    <section>
      <Navbar />
      <main>{children}</main>
    </section>
  );
}
