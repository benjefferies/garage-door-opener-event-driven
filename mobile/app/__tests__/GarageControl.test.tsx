import GarageControl from "@/app/(tabs)";
import { act, render } from "@testing-library/react-native";
import { PusherMock } from "pusher-js-mock";
import React from "react";

const pusher = new PusherMock();
const channel = pusher.subscribe("cache-garage-door");

jest.mock("pusher-js", () => {
  const Pusher = require("pusher-js-mock").PusherMock;
  return Pusher;
});

jest.mock("@expo/vector-icons/MaterialCommunityIcons", () => {
  const { View } = require("react-native");
  return ({ testID, name }: any) => <View testID={testID} name={name} />;
});

describe("<GarageControl />", () => {
  beforeEach(() => {
    jest.useFakeTimers(); // Control timers for debounce
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  test("Button should say Open Garage when garage is closed", () => {
    const { getByText } = render(<GarageControl />);

    act(() => {
      channel.emit("state", { isOpen: false });
    });

    const button = getByText("Open Garage");

    expect(button).toBeTruthy();
  });

  test("Button should say Close Garage when garage is closed", () => {
    const { getByText } = render(<GarageControl />);

    act(() => {
      channel.emit("state", { isOpen: true });
    });

    const button = getByText("Close Garage");

    expect(button).toBeTruthy();
  });

  test("Spinner shows during loading and hides after debounce", () => {
    const { getByTestId, queryByTestId } = render(<GarageControl />);

    act(() => {
      channel.emit("state", { isOpen: true });
    });

    // Spinner should be visible immediately
    expect(getByTestId("spinner")).toBeTruthy();

    // Advance timers by 200ms (debounce duration)
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Spinner should be gone
    expect(queryByTestId("spinner")).toBeNull();
  });

  test("Displays garage-open icon when garage is open", () => {
    const { getByTestId } = render(<GarageControl />);

    act(() => {
      channel.emit("state", { isOpen: true });
      jest.advanceTimersByTime(200);
    });

    const icon = getByTestId("garage-icon");
    expect(icon.props.name).toBe("garage-open");
  });

  test("Displays garage icon when garage is closed", () => {
    const { getByTestId } = render(<GarageControl />);

    act(() => {
      channel.emit("state", { isOpen: false });
      jest.advanceTimersByTime(200);
    });

    const icon = getByTestId("garage-icon");
    expect(icon.props.name).toBe("garage");
  });

  test("Displays the correct timestamp when provided", () => {
    const testTimestamp = new Date().toISOString();
    const { getByText } = render(<GarageControl />);

    act(() => {
      channel.emit("state", { isOpen: true, timestamp: testTimestamp });
    });

    const actionTimestamp = new Date(testTimestamp);
    const expectedText = `Last changed at ${actionTimestamp.toLocaleTimeString()} on ${actionTimestamp.toLocaleDateString()}`;

    expect(getByText(expectedText)).toBeTruthy();
  });

  test("Does not display timestamp when not provided", () => {
    const { queryByText } = render(<GarageControl />);

    act(() => {
      channel.emit("state", { isOpen: true });
    });

    const timestampText = queryByText(/Last changed at/);
    expect(timestampText).toBeNull();
  });
});
