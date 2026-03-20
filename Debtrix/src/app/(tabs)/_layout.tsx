// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
      headerStyle: {
        backgroundColor: "#fff",
      },
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#000",
      },
      headerTitleAlign: "center",
      tabBarLabelPosition: "below-icon",
      tabBarActiveTintColor: "#0000ff",
      tabBarInactiveTintColor: "#808080"
    }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="new-expense" 
        options={{ 
          title: 'New Expense',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" size={50} color={color} />
          ),
        }} 
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="GroupScreen"
        options={{
          title: 'Split Report',
          href: null,
        }}
      />
    </Tabs>
  );
}