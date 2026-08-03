import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ExpenseItemInput, PersonInput } from '../../types/newExpense';
import { AppTheme } from '../../theme/colors';
import { useThemeContext } from '../../theme/themeContext';

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
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

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
                color={theme.danger}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.itemInputRow}>
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="Item name"
              placeholderTextColor={theme.textMuted}
              value={item.name}
              onChangeText={(value) =>
                onUpdateItem(item.id, "name", value)
              }
            />
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="$0.00"
              placeholderTextColor={theme.textMuted}
              selectTextOnFocus={false}
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
          color={theme.textInverse}
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
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  
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
  helperText: {
    color: theme.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  itemCard: {
    backgroundColor: theme.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.border,
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
    color: theme.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  itemInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: theme.text
  },
  nameInput: {
    flex: 2,
    color: theme.text
  },
  priceInput: {
    flex: 1,
    color: theme.text
  },
  assignmentLabel: {
    color: theme.primaryDark,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptyText: {
    color: theme.textSecondary,
    fontSize: 13,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: theme.chip,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginRight: 7,
    marginBottom: 7,
  },
  selectedChip: {
    backgroundColor: theme.primaryDark,
  },
  disabledChip: {
    opacity: 0.45,
  },
  chipText: {
    color: theme.textMuted,
  },
  selectedChipText: {
    color: theme.text,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: theme.primaryDark,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  addButtonText: {
    color: theme.textInverse,
    fontSize: 16,
    fontWeight: "700",
  },
  summary: {
    marginTop: 16,
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 10,
    padding: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryLabel: {
    color: theme.primary,
  },
  summaryAmount: {
    color: theme.primary,
    fontVariant: ["tabular-nums"],
  },
  summaryDivider: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
    marginVertical: 6,
  },
  emphasizedText: {
    color: theme.primaryDark,
    fontWeight: "700",
  },
});