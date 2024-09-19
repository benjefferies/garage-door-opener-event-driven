import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
let defaultTheme: "dark" | "light" = "light";

type ThemeContextType = {
  colorMode: "dark" | "light";
  toggleColorMode: () => void;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  colorMode: defaultTheme,
  toggleColorMode: () => {},
});

export default function Layout() {
  const [colorMode, setColorMode] = React.useState<"dark" | "light">(
    defaultTheme
  );

  useEffect(() => {
    const setMode = async () => {
      const colorMode = await AsyncStorage.getItem("colorMode");
      if (colorMode) {
        setColorMode(colorMode as "dark" | "light");
      }
    };
    setMode();
  }, []);

  const toggleColorMode = async () => {
    setColorMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ colorMode, toggleColorMode }}>
      <GluestackUIProvider mode={colorMode}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GluestackUIProvider>
    </ThemeContext.Provider>
  );
}
