import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TipOption } from '../../types/newExpense';

type Props = {
    selectedOption: TipOption;
    customTipAmount: string;
    calculatedTip: number;
    onOptionChange: (option: TipOption) => void;
    onCustomTipChange: (amount: string) => void;
};

const TIP_OPTIONS: TipOption[] = [0, 10, 15, 18, 20, "custom"];

export default function TipSection({ selectedOption, customTipAmount, calculatedTip, onOptionChange, onCustomTipChange }: Props) {
    const getLabel = (option: TipOption) => {
        if (option === 0) return "No Tip";
        if (option === "custom") return "Custom";
        return `${option}%`;
    };

    return (
        <View style={styles.section}>
            <Text style={styles.label}>Tip</Text>
            <Text style={styles.helperText}>
                Select a percentage or enter a custom dollar amount.
            </Text>
            <View style={styles.options}>
                {TIP_OPTIONS.map((option) => {
                    const selected = selectedOption === option;

                    return (
                        <TouchableOpacity
                            key={String(option)}
                            style={[styles.option, selected && styles.selectedOption]}
                            onPress={() => onOptionChange(option)}
                        >
                            <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
                                {getLabel(option)}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
            {selectedOption === "custom" && (
                <TextInput
                    style={styles.input}
                    placeholder="$0.00"
                    value={customTipAmount}
                    onChangeText={onCustomTipChange}
                    keyboardType="decimal-pad"
                />
            )}
            <View style={styles.tipSummary}>
                <Text style={styles.tipSummaryLabel}>Tip Amount</Text>
                <Text style={styles.tipSummaryAmount}>${calculatedTip.toFixed(2)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({ 
    section: { 
        marginBottom: 24, 
        backgroundColor: "#d7d9ce", 
        borderRadius: 12, 
        padding: 16, 
    }, 
    label: { 
        color: "#0c7489", 
        fontSize: 16, 
        fontWeight: "600", 
        marginBottom: 6, 
    }, 
    helperText: { 
        color: "#5f6368", 
        fontSize: 13, 
        marginBottom: 12, 
    }, 
    options: { 
        flexDirection: "row", 
        flexWrap: "wrap", 
        marginBottom: 12, 
    }, 
    option: { 
        backgroundColor: "#f4f4ef", 
        borderRadius: 20, 
        paddingHorizontal: 14, 
        paddingVertical: 9, 
        marginRight: 8, 
        marginBottom: 8, 
        borderWidth: 1, 
        borderColor: "#b3b5ae", 
    }, 
    selectedOption: { 
        backgroundColor: "#0c7489", 
        borderColor: "#0c7489", 
    }, 
    optionText: { 
        color: "#333", 
        fontWeight: "500", 
    }, 
    selectedOptionText: { 
        color: "#fff", 
        fontWeight: "700", 
    }, 
    input: { 
        backgroundColor: "#f4f4ef", 
        borderWidth: 1, 
        borderColor: "#808080", 
        borderRadius: 8, 
        padding: 12, 
        fontSize: 16, 
        marginBottom: 12, 
    }, 
    tipSummary: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        backgroundColor: "#f4f4ef", 
        borderRadius: 8, 
        padding: 12, 
    }, 
    tipSummaryLabel: { 
        color: "#444", 
    }, 
    tipSummaryAmount: { 
        color: "#13505b", 
        fontWeight: "700", 
    }, 
});