import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/Shared/AppRouter/AppRouter";
import "./styles/utilities.css";
import "./styles/custom-styles.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
}

export default App;
