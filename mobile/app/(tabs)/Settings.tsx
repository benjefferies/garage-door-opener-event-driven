import React from "react";

import { Box } from "@/components/ui/box";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../_layout";

export default function Settings() {
  const { colorMode, toggleColorMode } = React.useContext(ThemeContext);
  return (
    <Box className="bg-white dark:bg-black flex-1 p-4 justify-center items-center">
      <Text>Dark mode</Text>
      <Switch
        testID="theme-switch"
        defaultValue={colorMode === "dark"}
        value={colorMode === "dark"}
        size={"lg"}
        onValueChange={async () => {
          toggleColorMode();
          await AsyncStorage.setItem(
            "colorMode",
            colorMode === "dark" ? "light" : "dark"
          );
        }}
      />
    </Box>
  );
}
