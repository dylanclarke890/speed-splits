import React from "react";
import { render } from "@testing-library/react";
import App from "../../App";

test("renders successfully", () => {
  const component = render(<App />);
  expect(component.baseElement).toBeInTheDocument();
});
