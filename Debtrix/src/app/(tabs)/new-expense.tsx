import { Text, View, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import ExpenseDetailsSection from "../../components/newExpense/ExpenseDetailsSection";
import ItemsSection from "../../components/newExpense/ItemSection";
import PeopleSection from "../../components/newExpense/PeopleSection";
import StatePickerModal from "../../components/newExpense/StatePickerModal";
import StateSection from "../../components/newExpense/StateSection";
import TipSection from "../../components/newExpense/TipSection";
import { useNewExpenseForm } from "../../hooks/useNewExpenseForm";
import { buildReceipt, validateNewExpenseForm } from '../../lib/newExpense'

export default function NewExpense() {
  const router = useRouter();
  const form = useNewExpenseForm();
  const [statePickerVisible, setStatePickerVisible] = useState(false);

  const handleSubmit = () => {
    const formState = form.getFormState();
    const validationError = validateNewExpenseForm(formState);

    if (validationError) {
      Alert.alert("Unable to calculate split", validationError);
      return;
    }

    const receipt = buildReceipt(formState);

    router.push({
      pathname: "../GroupScreen",
      params: {
        expenseName: form.expenseName.trim(),
        receipt: JSON.stringify(receipt)
      }
    });
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>New Expense</Text>
        <Text style={styles.description}>Add the participants and receipt items to calculate each person's share.</Text>
        <PeopleSection 
          numPeople={form.numPeople}
          people={form.people}
          onNumPeopleChange={form.handleNumPeopleChange}
          onPersonNameChange={form.updatePersonName}
        />
        <ExpenseDetailsSection 
          expenseName={form.expenseName}
          totalAmount={form.totalAmount}
          onExpenseNameChange={form.setExpenseName}
          onTotalAmountChange={form.setTotalAmount}
        />
        <ItemsSection
          items={form.items}
          people={form.people}
          subtotal={form.subtotal}
          estimatedTax={form.estimatedTax}
          tipAmount={form.tipAmount}
          estimatedTotal={form.estimatedTotal}
          onAddItem={form.addItem}
          onUpdateItem={form.updateItem}
          onRemoveItem={form.removeItem}
          onToggleAssignedPerson={form.toggleAssignedPerson}
        />
        <StateSection 
          selectedState={form.selectedState}
          taxRate={form.taxRate}
          onOpenPicker={() => setStatePickerVisible(true)}
        />
        <TipSection
          selectedOption={form.tipOption}
          customTipAmount={form.customTipAmount}
          calculatedTip={form.tipAmount}
          onOptionChange={(option) => {
            form.setTipOption(option);

            if (option !== "custom") {
              form.setCustomTipAmount("");
            }
          }}
          onCustomTipChange={form.setCustomTipAmount}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          accessibilityRole="button"
        >
          <Text style={styles.submitButtonText}>Calculate Split</Text>
        </TouchableOpacity>
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <StatePickerModal 
        visible={statePickerVisible}
        selectedState={form.selectedState}
        onSelect={(stateName) => {
          form.setSelectedState(stateName);
          setStatePickerVisible(false);
        }}
        onClose={() => setStatePickerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#119da4",
  },
  content: {
    padding: 20,
  },
  heading: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },
  description: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#13505b",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 2,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  bottomSpacing: {
    height: 40,
  },
});