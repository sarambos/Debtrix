import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
      headerStyle: {
        backgroundColor: "#D7d9ce",
      },
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#0c7489",
      },
      headerTitleAlign: "center",
      tabBarLabelPosition: "below-icon",
      tabBarActiveTintColor: "#119da4",
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
            <Ionicons name="add" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>

  );
}