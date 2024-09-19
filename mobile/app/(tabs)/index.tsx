import { ThemeContext } from "@/app/_layout";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import FontAwesome from "@expo/vector-icons/MaterialCommunityIcons";
import debounce from "debounce";
import Pusher from "pusher-js";
import React, { useEffect } from "react";
import colors from "tailwindcss/colors";

type GarageState = {
  isOpen: boolean;
  timestamp?: string;
};

const pusher = new Pusher("c45587a7e5c8ba4cd06b", {
  cluster: "eu",
});

export default function GarageControl() {
  const { colorMode } = React.useContext(ThemeContext);
  const [garageState, setGarageState] = React.useState<GarageState>();
  const [loading, setLoading] = React.useState(false);

  const setLoadingFalse = React.useCallback(
    debounce(() => {
      setLoading(false);
    }, 200),
    []
  );

  useEffect(() => {
    pusher
      .subscribe("cache-garage-door")
      .bind("state", (data: { isOpen: boolean; timestamp: string }) => {
        setLoading(true);
        setGarageState(data);
        setLoadingFalse();
      });
  }, []);

  const actionTimestamp: Date | undefined = garageState?.timestamp
    ? new Date(garageState.timestamp)
    : undefined;

  return (
    <Box className="bg-white dark:bg-black flex-1 p-4 justify-center items-center">
      <Box className="h-32 flex justify-center">
        {loading && (
          <Spinner
            testID="spinner"
            size="large"
            className="text-gray-500 dark:text-white"
          />
        )}

        {!loading && (
          <FontAwesome
            testID="garage-icon"
            size={100}
            name={garageState?.isOpen ? "garage-open" : "garage"}
            color={colorMode === "dark" ? colors.gray[300] : colors.gray[800]}
          />
        )}
      </Box>
      <Button className="w-full">
        <ButtonText>{garageState?.isOpen ? "Close" : "Open"} Garage</ButtonText>
      </Button>
      {!!actionTimestamp && (
        <Box className="w-full p-4 border-gray-200">
          <Text className="text-center">
            Last changed at {actionTimestamp.toLocaleTimeString()} on{" "}
            {actionTimestamp.toLocaleDateString()}
          </Text>
        </Box>
      )}
    </Box>
  );
}
