import React from "react";
import { render, act, screen } from "@testing-library/react";
import { timerStatus } from "../../models/core";
import SplitTimerControls from "../../components/SplitTimer/SplitTimerControls/SplitTimerControls";

test("successfully renders", () => {
  const component = render(<SplitTimerControls />);
  expect(component.baseElement).toBeInTheDocument();
});

test("renders correct buttons depending on status", () => {
  const { rerender } = render(
    <SplitTimerControls status={timerStatus.INITIAL} />
  );

  const expectedBtns = {
    initial: ["Start"],
    running: ["Pause", "Split", "Undo"],
    paused: ["Resume", "Stop"],
    stopped: ["Reset"],
  };

  const changeStatusAssert = (status) => {
    rerender(<SplitTimerControls status={status} />);
    act(() => {
      expectedBtns[status].forEach((btn) => {
        expect(screen.getByText(btn)).toBeInTheDocument();
      });
    });
  };

  changeStatusAssert(timerStatus.RUNNING);
  changeStatusAssert(timerStatus.PAUSED);
  changeStatusAssert(timerStatus.STOPPED);
  changeStatusAssert(timerStatus.INITIAL);
});
