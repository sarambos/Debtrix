import { Stack } from "expo-router";
import { ThemeProvider, useThemeContext } from "../theme/themeContext";

export default function RootLayout() {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider>
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
          }
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="receipt/[receiptId]"
          options={{
            title: "Receipt Details",
            headerBackTitle: "Home"
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
