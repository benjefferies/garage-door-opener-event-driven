// Settings.test.js

import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import Settings from "../(tabs)/settings";
import { ThemeContext } from "../_layout";

describe("<Settings />", () => {
  test("renders correctly with light mode", () => {
    const toggleColorModeMock = jest.fn();
    const { getByText, getByTestId } = render(
      <ThemeContext.Provider
        value={{ colorMode: "light", toggleColorMode: toggleColorModeMock }}
      >
        <Settings />
      </ThemeContext.Provider>
    );

    const switchComponent = getByTestId("theme-switch");
    expect(switchComponent.props.value).toBe(false);
  });

  test("renders correctly with dark mode", () => {
    const toggleColorModeMock = jest.fn();
    const { getByText, getByTestId } = render(
      <ThemeContext.Provider
        value={{ colorMode: "dark", toggleColorMode: toggleColorModeMock }}
      >
        <Settings />
      </ThemeContext.Provider>
    );

    expect(getByText("Dark mode")).toBeTruthy();

    const switchComponent = getByTestId("theme-switch");
    expect(switchComponent.props.value).toBe(true);
  });

  test("toggles the theme when switch is changed", () => {
    const toggleColorModeMock = jest.fn();
    const { getByTestId } = render(
      <ThemeContext.Provider
        value={{ colorMode: "light", toggleColorMode: toggleColorModeMock }}
      >
        <Settings />
      </ThemeContext.Provider>
    );

    const switchComponent = getByTestId("theme-switch");

    // Simulate toggling the switch
    fireEvent(switchComponent, "onValueChange", true);

    expect(toggleColorModeMock).toHaveBeenCalled();
  });
});
