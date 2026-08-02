import { Stack } from "expo-router";
import { ThemeProvider, useThemeContext } from "../theme/themeContext";

function RootNavigator() {
  const { theme } = useThemeContext();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.surface,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color: theme.primary,
        },
        headerTitleAlign: "center",
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="receipt/[receiptId]"
        options={{
          title: "Receipt Details",
          headerBackTitle: "Home",
          headerTintColor: theme.primary,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
