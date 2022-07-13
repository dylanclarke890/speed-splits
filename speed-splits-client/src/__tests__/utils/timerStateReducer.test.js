import { ReducerError } from "../../utils/errors";
import { timerStateReducer } from "../../utils/react/reducers";
import { timerStatus, timerActions, Split } from "../../models/core";

const mockSplits = [
  new Split("Start", null, 0),
  new Split("First", null, 1),
  new Split("Second", null, 2),
  new Split("Third", null, 3),
  new Split("", null, 4),
];

const initialState = {
  time: 0,
  splits: mockSplits,
  currentSplit: 0,
  status: timerStatus.INITIAL,
  timestampRef: 0,
  recordedTimes: [],
};

test("throws ReducerError if action isn't recognised", () => {
  expect(() => timerStateReducer({}, {})).toThrow(ReducerError);
});

test("initialize action returns initial state", () => {
  const actual = timerStateReducer({}, { type: timerActions.INITIALIZE });
  expect(actual).toEqual(initialState);
});

test("start action returns running status and sets timestampRef", () => {
  const expectedStatus = timerStatus.RUNNING;
  const actual = timerStateReducer({}, { type: timerActions.START });
  expect(actual.status).toEqual(expectedStatus);
  expect(actual.timestampRef).toBeGreaterThan(0);
});

test("pause/resume action returns expected states depending on status", () => {
  const actualPause = timerStateReducer(
    { status: timerStatus.RUNNING, recordedTimes: [] },
    { type: timerActions.PAUSE_RESUME }
  );
  expect(actualPause.status).toBe(timerStatus.PAUSED);
  expect(actualPause.recordedTimes.length).toBe(1);
  const actualResume = timerStateReducer(
    { status: timerStatus.PAUSED },
    { type: timerActions.PAUSE_RESUME }
  );
  expect(actualResume.status).toBe(timerStatus.RUNNING);
  expect(actualResume.timestampRef).toBeGreaterThan(0);
});

test("stop action returns stopped status", () => {
  const expectedStatus = timerStatus.STOPPED;
  const actual = timerStateReducer({}, { type: timerActions.STOP });
  expect(actual.status).toBe(expectedStatus);
});

test("tick action increments time", () => {
  const args = {
    time: 0,
    timestampRef: 0,
    recordedTimes: [],
  };
  const actual = timerStateReducer(args, { type: timerActions.TICK });
  expect(actual.time).toBeGreaterThan(0);
});

test("split action adds time to expected split and increments current split", () => {
  const args = {
    splits: [new Split("", 1000, 0), new Split("", null, 1)],
    currentSplit: 1,
    time: 100,
  };
  const expected = {
    splits: [new Split("", 1000, 0), new Split("", 100, 1)],
    currentSplit: 2,
    time: 100,
  };
  const actual = timerStateReducer(args, { type: timerActions.SPLIT });
  expect(actual).toEqual(expected);
});

test("undo action removes time from last split and decrements current split", () => {
  const args = {
    splits: [new Split("", 1000, 0), new Split("", 1200, 1)],
    currentSplit: 2,
  };
  const expected = {
    splits: [new Split("", 1000, 0), new Split("", null, 1)],
    currentSplit: 1,
  };
  const actual = timerStateReducer(args, { type: timerActions.UNDO });
  expect(actual).toEqual(expected);
});

test("reset action returns initial state", () => {
  const args = { splits: mockSplits };
  const actual = timerStateReducer(args, { type: timerActions.RESET });
  expect(actual).toEqual(initialState);
});
