import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerShown: false,
        }} 
      />
      <Tabs.Screen 
        name="new-expense" 
        options={{ 
          title: 'New Expense',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" size={50} color={color} />
          ),
          headerShown: false,
        }} 
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="GroupScreen"
        options={{
          href: null,
        }}/>
    </Tabs>

  );
}