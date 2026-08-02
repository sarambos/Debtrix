import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppTheme } from '../../theme/colors';
import { useThemeContext } from '../../theme/themeContext';

type Props = {
    selectedState: string;
    taxRate: number;
    onOpenPicker: () => void;
};

export default function StateSection({ selectedState, taxRate, onOpenPicker }: Props) {
    const { theme } = useThemeContext();
    const styles = getStyles(theme);

    return (
        <View style={styles.section}>
            <Text style={styles.label}>
                State <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.subtitle}>
                Used to estimate the state-level sales tax.
            </Text>
            <TouchableOpacity
                style={styles.selector}
                onPress={onOpenPicker}
                accessibilityRole="button"
                accessibilityLabel="Select State"
            >
                <Text style={selectedState ? styles.selectedText : styles.placeholderText}>
                    {selectedState || "Select a state"}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>

            {selectedState ? (
                <View style={styles.taxInfo}>
                    <Text style={styles.taxInfoText}>
                        Estimated state tax rate: {taxRate.toFixed(2)}%
                    </Text>
                </View>
            ) : null}
        </View>
    );
}

const getStyles = (theme: AppTheme) => StyleSheet.create({
  section: {
    marginBottom: 24,
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  required: {
    color: theme.danger,
  },
  subtitle: {
    color: theme.textSecondary,
    fontSize: 13,
    marginBottom: 12,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.surfaceSecondary,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectedText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "500",
  },
  placeholderText: {
    color: theme.textMuted,
    fontSize: 16,
  },
  dropdownIcon: {
    color: theme.primaryBright,
    fontSize: 14,
  },
  taxInfo: {
    marginTop: 10,
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
    padding: 10,
  },
  taxInfoText: {
    color: theme.primaryDark,
    fontSize: 14,
    textAlign: "center",
  },
});