import { GlobalEvents } from "../../utils/events";
import userEvent from "@testing-library/user-event";

const mockHandler = jest.fn();

test("adds event to window", () => {
  GlobalEvents.Add("click", mockHandler);
  userEvent.click(document.body);
  expect(mockHandler).toBeCalledTimes(1);
});

test("removes event from window", () => {
  GlobalEvents.Add("click", mockHandler);
  userEvent.click(document.body);
  expect(mockHandler).toBeCalledTimes(1);
  GlobalEvents.Remove("click", mockHandler);
  userEvent.click(document.body);
  expect(mockHandler).toBeCalledTimes(1);
});
