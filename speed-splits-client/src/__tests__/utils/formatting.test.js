import { FormatError, InvalidOperationError } from "../../utils/errors";
import { Time } from "../../utils/formatting";

test("Time.toString() throws InvalidOperationError if format is not recognised.", () => {
  expect(() => Time.toString(12, "invalid")).toThrow(InvalidOperationError);
});

test("Time.calculate() throws FormatError if error calculating time.", () => {
  expect(() => Time.calculate("invalid", "ms")).toThrow(FormatError);
});

test("Time.now() calls fallback func if Date.now() returns falsy", () => {
  const mockDateNow = jest.fn(() => null);
  Date.now = mockDateNow;
  const actual = Time.now();
  expect(Date.now).toBeCalledTimes(1);
  expect(actual).toBeGreaterThan(0);
});
