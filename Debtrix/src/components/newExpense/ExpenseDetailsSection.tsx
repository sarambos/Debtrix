import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AppTheme } from '../../theme/colors';
import { useThemeContext } from '../../theme/themeContext';

type Props = {
    expenseName: string;
    totalAmount: string;
    onExpenseNameChange: (value: string) => void;
    onTotalAmountChange: (value: string) => void;
};

export default function ExpenseDetailsSection({ expenseName, totalAmount, onExpenseNameChange, onTotalAmountChange }: Props) {
    const { theme } = useThemeContext();
    const styles = getStyles(theme);
    
    return (
        <View style={styles.section}>
            <Text style={styles.label}>
                Expense name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
                style={styles.input}
                placeholder="e.g., Dinner at Pizza Place"
                value={expenseName}
                onChangeText={onExpenseNameChange}
                autoCapitalize="words"
            />
            <Text style={styles.label}>Receipt total</Text>
            <Text style={styles.helperText}>
                Optional. Enter the printed total to compare it with Debtrix's calculation.
            </Text>
            <TextInput
                style={styles.input}
                placeholder="$0.00"
                selectTextOnFocus={false}
                value={totalAmount}
                onChangeText={onTotalAmountChange}
            />
        </View>
    );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
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
      marginBottom: 8,
    },

    required: {
      color: theme.danger,
    },

    helperText: {
      color: theme.textSecondary,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 10,
    },

    input: {
      backgroundColor: theme.surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      fontSize: 16,
      color: theme.text,
    },
  });