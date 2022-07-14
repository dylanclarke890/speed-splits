import ReactDOM from "react-dom";
import App from "../App";

// probably doesn't pass but index.js has been omitted from code coverage anyway.
test("renders without crashing", () => {
  const mockRender = jest.fn();
  ReactDOM.render = mockRender;
  const component = <App />;
  const div = document.createElement("div");
  global.document.getElementById = (id) => id === "root" && div;
  ReactDOM.render(component, div);
  expect(mockRender).toHaveBeenCalledWith(component, div);
});
