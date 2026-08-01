import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
    expenseName: string;
    totalAmount: string;
    onExpenseNameChange: (value: string) => void;
    onTotalAmountChange: (value: string) => void;
};

export default function ExpenseDetailsSection({ expenseName, totalAmount, onExpenseNameChange, onTotalAmountChange }: Props) {
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

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    backgroundColor: "#d7d9ce",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    color: "#0c7489",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  required: {
    color: "#ff3b30",
  },
  helperText: {
    color: "#5f6368",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#d7d9ce",
    borderWidth: 1,
    borderColor: "#808080",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
});