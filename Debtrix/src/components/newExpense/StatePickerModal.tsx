import { useMemo, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { STATE_TAX_RATES } from '../../data/stateTaxRates';
import { AppTheme } from "../../theme/colors";
import { useThemeContext } from "../../theme/themeContext";

type Props = {
  visible: boolean;
  selectedState: string;
  onSelect: (stateName: string) => void;
  onClose: () => void;
};

export default function StatePickerModal({ visible, selectedState, onSelect, onClose }: Props) {
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStates = useMemo(() => {
    const normQuery = searchQuery.trim().toLowerCase();

    if (!normQuery) return STATE_TAX_RATES;

    return STATE_TAX_RATES.filter((state) =>
      state.name.toLowerCase().includes(normQuery));
  }, [searchQuery]);

  const closeModal = () => {
    setSearchQuery("");
    onClose();
  };

  const selectState = (stateName: string) => {
    setSearchQuery("");
    onSelect(stateName);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Select State</Text>
            <TouchableOpacity 
              onPress={closeModal}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
            >
              <Text style={styles.close}>x</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a state..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Text style={styles.clearSearch}>x</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filteredStates}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isSelected = selectedState === item.name;
              return (
                <TouchableOpacity
                  onPress={() => selectState(item.name)}
                  style={[
                    styles.stateItem,
                    isSelected && styles.selectedStateItem,
                  ]}
                >
                  <Text
                    style={[
                      styles.stateName,
                      isSelected && styles.selectedStateText,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text style={[styles.stateTax, isSelected && styles.selectedStateText]}>
                    {item.taxRate.toFixed(2)}%
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No states found.</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (theme: AppTheme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.primaryDark,
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "50%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    color: theme.text,
    fontSize: 20,
    fontWeight: "700",
  },
  close: {
    color: theme.danger,
    fontSize: 24,
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.surfaceSecondary,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.border,
    color: theme.text
  },
  clearSearch: {
    color: theme.danger,
    fontSize: 18,
    padding: 10,
    marginLeft: 5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  stateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 8,
    backgroundColor: theme.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectedStateItem: {
    backgroundColor: theme.primaryDark,
    borderColor: theme.primary,
  },
  stateName: {
    color: theme.text,
    fontSize: 16,
  },
  stateTax: {
    color: theme.text,
    fontSize: 14,
  },
  selectedStateText: {
    color: theme.text,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: theme.text,
    fontSize: 16,
  },
});