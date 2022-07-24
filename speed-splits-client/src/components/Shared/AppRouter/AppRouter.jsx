import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import NotFound from "../Layouts/NotFound";
import SplitTimer from "../../SplitTimer/SplitTimer";
import EditRun from "../../EditRun/EditRun";
import ViewRuns from "../../ViewRuns/ViewRuns";
import Settings from "../../Settings/Settings";

export default function AppRouter() {
  const routes = [
    ["", <SplitTimer />],
    ["/splits", <ViewRuns />],
    ["/edit-run", <EditRun />],
    ["/settings", <Settings />],
  ];
  return (
    <Routes>
      {routes.map((pr) => (
        <Route
          key={routes.indexOf(pr)}
          path={pr[0]}
          element={<MainLayout>{pr[1]}</MainLayout>}
        />
      ))}
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFound />
          </MainLayout>
        }
      />
    </Routes>
  );
}
