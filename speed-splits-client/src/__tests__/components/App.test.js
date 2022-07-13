import React from "react";
import { render } from "@testing-library/react";
import App from "../../App";

test("renders successfully", () => {
  const component = render(<App />);
  expect(component.baseElement).toBeInTheDocument();
});

test("renders speed splits header", () => {
  const { getByText } = render(<App />);
  const headerElement = getByText(/Speed Splits/i);
  expect(headerElement).toBeInTheDocument();
});
