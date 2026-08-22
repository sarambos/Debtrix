import React from 'react';
import { Text, View, StyleSheet, Switch } from 'react-native';
import { AppTheme } from "../../theme/colors";
import { useThemeContext } from "../../theme/themeContext";

export default function SettingsScreen() {
  const { theme, isDark, toggleMode } = useThemeContext();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingTitle}>Dark Mode</Text>
          <Switch 
            value={isDark} 
            onValueChange={toggleMode}
            trackColor={{
              false: theme.border,
              true: theme.primary
            }}
            thumbColor={theme.textInverse}
          />
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    title: {
      color: theme.text,
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 24,
    },
    section: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16
    },
    sectionTitle: {
      color: theme.primary,
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 16
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.surface,
      padding: 16,
      borderRadius: 12,
    },
    settingTitle: {
      color: theme.text,
      fontSize: 17,
      fontWeight: "600",
    },
  });
