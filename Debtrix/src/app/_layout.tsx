import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
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
  );
}
