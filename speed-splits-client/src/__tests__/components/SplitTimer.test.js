import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { timerStateReducer } from "../../utils/react/reducers";
import SplitTimer from "../../components/SplitTimer/SplitTimer";

jest.mock("../../utils/react/reducers", () => ({
  __esModule: true,
  timerStateReducer: jest.fn().mockImplementation(() => ({
    time: 0,
    splits: [],
    currentSplit: 0,
    status: "initial",
    timestampRef: 0,
    recordedTimes: [],
  })),
}));

test("successfully renders", () => {
  jest.clearAllMocks();
  const component = render(<SplitTimer />);
  expect(component.baseElement).toBeInTheDocument();
});

test("calls timerStateReducer for valid keys", () => {
  const component = render(<SplitTimer />);
  const validKeys = ["ENTER", "P", "R", "S", " ", "U", "ESCAPE"];
  validKeys.forEach((key) => fireEvent.keyDown(component.baseElement, { key }));
  expect(timerStateReducer).toHaveBeenCalledTimes(validKeys.length);
});
