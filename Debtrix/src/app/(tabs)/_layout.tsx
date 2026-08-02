import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useThemeContext } from '../../theme/themeContext';

export default function TabLayout() {
  const { theme } = useThemeContext();
  return (
    <ThemeProvider>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTitleStyle: {
            fontWeight: "bold",
            color: theme.primary,
          },
          headerTitleAlign: "center",
          tabBarLabelPosition: "below-icon",
          tabBarActiveTintColor: theme.primaryBright,
          tabBarInactiveTintColor: theme.tabInactive
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
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="settings-outline"
                color={color}
                size={size}
              />
            )
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}