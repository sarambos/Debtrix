import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ExpenseItemInput, PersonInput } from '../../types/newExpense';

type Props = {
    items: ExpenseItemInput[];
    people: PersonInput[];
    subtotal: number;
    estimatedTax: number;
    tipAmount: number;
    estimatedTotal: number;
    onAddItem: () => void;
    onUpdateItem: (
        itemId: string,
        field: "name" | "price",
        value: string
    ) => void;
    onRemoveItem: (itemId: string) => void;
    onToggleAssignedPerson: (
        itemId: string,
        personName: string
    ) => void;
};

export default function ItemSection({ items, people, subtotal, estimatedTax, tipAmount, estimatedTotal, onAddItem, onUpdateItem, onRemoveItem, onToggleAssignedPerson}: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>Receipt items</Text>
      <Text style={styles.helperText}>
        Add each item and select everyone who shared it.
      </Text>
      {items.map((item, index) => (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>
              Item {index + 1}
            </Text>
            <TouchableOpacity
              onPress={() => onRemoveItem(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Remove item ${index + 1}`}
              hitSlop={8}
            >
              <MaterialCommunityIcons
                name="delete-outline"
                size={24}
                color="#c62828"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.itemInputRow}>
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="Item name"
              value={item.name}
              onChangeText={(value) =>
                onUpdateItem(item.id, "name", value)
              }
            />
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="$0.00"
              keyboardType="decimal-pad"
              value={item.price}
              onChangeText={(value) =>
                onUpdateItem(item.id, "price", value)
              }
            />
          </View>
          <Text style={styles.assignmentLabel}>
            Who shared this item?
          </Text>

          {people.length === 0 ? (
            <Text style={styles.emptyText}>
              Add participant names before assigning items.
            </Text>
          ) : (
            <View style={styles.chips}>
              {people.map((person) => {
                const personName = person.name.trim();
                const selected =
                  personName.length > 0 &&
                  item.assignedTo.includes(personName);

                return (
                  <TouchableOpacity
                    key={person.id}
                    disabled={!personName}
                    onPress={() =>
                      onToggleAssignedPerson(
                        item.id,
                        personName,
                      )
                    }
                    style={[
                      styles.chip,
                      selected && styles.selectedChip,
                      !personName && styles.disabledChip,
                    ]}
                  >
                    <Text style={[styles.chipText, selected && styles.selectedChipText]}>
                      {personName || "Unnamed"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddItem}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons
          name="plus"
          size={21}
          color="#fff"
        />
        <Text style={styles.addButtonText}>Add item</Text>
      </TouchableOpacity>
      <View style={styles.summary}>
        <SummaryRow label="Subtotal" amount={subtotal} />
        <SummaryRow label="Estimated tax" amount={estimatedTax}/>
        <SummaryRow label="Tip" amount={tipAmount} />
        <View style={styles.summaryDivider} />
        <SummaryRow label="Estimated total" amount={estimatedTotal} emphasized/>
      </View>
    </View>
  );
}

type SummaryRowProps = {
  label: string;
  amount: number;
  emphasized?: boolean;
};

function SummaryRow({ label, amount, emphasized = false}: SummaryRowProps) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, emphasized && styles.emphasizedText]}>
        {label}
      </Text>
      <Text style={[styles.summaryAmount, emphasized && styles.emphasizedText]}>
        ${amount.toFixed(2)}
      </Text>
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
  helperText: {
    color: "#5f6368",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  itemCard: {
    borderWidth: 1,
    borderColor: "#b3b5ae",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  itemTitle: {
    color: "#13505b",
    fontSize: 15,
    fontWeight: "700",
  },
  itemInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    backgroundColor: "#f4f4ef",
    borderWidth: 1,
    borderColor: "#808080",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  nameInput: {
    flex: 2,
  },
  priceInput: {
    flex: 1,
  },
  assignmentLabel: {
    color: "#13505b",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptyText: {
    color: "#666",
    fontSize: 13,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "#e5e5e0",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginRight: 7,
    marginBottom: 7,
  },
  selectedChip: {
    backgroundColor: "#0c7489",
  },
  disabledChip: {
    opacity: 0.45,
  },
  chipText: {
    color: "#333",
  },
  selectedChipText: {
    color: "#fff",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#13505b",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  summary: {
    marginTop: 16,
    backgroundColor: "#f4f4ef",
    borderRadius: 10,
    padding: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryLabel: {
    color: "#444",
  },
  summaryAmount: {
    color: "#444",
    fontVariant: ["tabular-nums"],
  },
  summaryDivider: {
    borderTopWidth: 1,
    borderTopColor: "#c4c4be",
    marginVertical: 6,
  },
  emphasizedText: {
    color: "#13505b",
    fontWeight: "700",
  },
});