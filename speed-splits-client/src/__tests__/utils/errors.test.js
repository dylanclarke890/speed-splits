import { storageKeys } from "../../models/core";
import { FormatError, ReducerError } from "../../utils/errors";
import Storage from "../../utils/Storage";

jest.mock("../../utils/Storage");

test("throwing instanceof BaseError should log error", () => {
  const mockGet = jest.fn().mockReturnValue([]);
  let res;
  const mockAdd = jest.fn((log) => (res = log));

  Storage.Get = mockGet;
  Storage.AddOrUpdate = mockAdd;

  expect(() => {
    throw new ReducerError("test");
  }).toThrow(ReducerError);
  expect(mockGet).toBeCalled();
  expect(mockAdd).toBeCalled();
  expect(Storage.Get(storageKeys.ERROR_LOG)).toBeTruthy();
  expect(res.length).toBe(1);
  expect(res[0].name).toBe("ReducerError");
  expect(res[0].message).toBe("Didn't recognise action: test.");
  expect(res[0].callStack).toBeTruthy();
});

test("throwing FormatError should include parameter name, value and type in error message", () => {
  const actual = new FormatError({ test: "msg" });
  expect(actual.message).toBe(
    "Formatting error using parameters: test - msg (string)."
  );
});
