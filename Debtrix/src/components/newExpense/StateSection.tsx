import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    selectedState: string;
    taxRate: number;
    onOpenPicker: () => void;
};

export default function StateSection({ selectedState, taxRate, onOpenPicker }: Props) {
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
    marginBottom: 6,
  },
  required: {
    color: "#ff3b30",
  },
  subtitle: {
    color: "#5f6368",
    fontSize: 13,
    marginBottom: 12,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4f4ef",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#808080",
  },
  selectedText: {
    color: "#040404",
    fontSize: 16,
    fontWeight: "500",
  },
  placeholderText: {
    color: "#808080",
    fontSize: 16,
  },
  dropdownIcon: {
    color: "#119da4",
    fontSize: 14,
  },
  taxInfo: {
    marginTop: 10,
    backgroundColor: "#f4f4ef",
    borderRadius: 8,
    padding: 10,
  },
  taxInfoText: {
    color: "#0c7489",
    fontSize: 14,
    textAlign: "center",
  },
});