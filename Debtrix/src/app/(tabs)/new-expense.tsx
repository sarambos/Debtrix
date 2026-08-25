import {ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
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
import { calculateSplitOnAws } from "../../api/debtrixApi";
import * as ImagePicker from "expo-image-picker";
import { uploadAndScanReceipt } from "../../api/receiptUploader";
import { AppTheme } from "../../theme/colors";
import { useThemeContext } from "../../theme/themeContext";

export default function NewExpense() {
  const router = useRouter();
  const form = useNewExpenseForm();
  const [statePickerVisible, setStatePickerVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptImage, setReceiptImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanReceipt = async () => {
    try {
      console.log("Starting receipt scan...");

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Photo access needed",
          "Allow access to your photos to choose a receipt.",
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 0.7,
        });

      if (result.canceled) {
        return;
      }

      const image = result.assets[0];

      if (!image) {
        throw new Error(
          "The selected image could not be read.",
        );
      }

      setReceiptImage(image);
      setIsScanning(true);

      const scannedReceipt =
        await uploadAndScanReceipt(image);
      
      console.log(
        "SCANNED RECEIPT RESULT:",
        JSON.stringify(scannedReceipt, null, 2),
      );

      form.applyScannedReceipt(scannedReceipt);

      Alert.alert(
        "Receipt scanned",
        scannedReceipt.items.length > 0
          ? "Review the detected details and assign each item."
          : "No line items were detected. You can add them manually.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The receipt could not be scanned.";

      Alert.alert(
        "Unable to scan receipt",
        message,
      );
    } finally {
      setIsScanning(false);
      console.log("Receipt scan process completed.");
    }
  };
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const formState = form.getFormState();
  const validationError = validateNewExpenseForm(formState);
  const canSubmit = !validationError && !isSubmitting && !isScanning;

  const handleSubmit = async () => {
    const formState = form.getFormState();
    const validationError = validateNewExpenseForm(formState);

    if (validationError) {
      Alert.alert("Unable to calculate split", validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const receipt = buildReceipt(formState);
      const splitResult = await calculateSplitOnAws(receipt);
      const expenseName = form.expenseName.trim();
      form.resetForm();
      setReceiptImage(null);

      router.push({
        pathname: "../Split",
        params: {
          expenseName: expenseName,
          splitResult: JSON.stringify(splitResult)
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to connect to the Debtrix server.";

      Alert.alert("Unable to calculate split", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>New Expense</Text>
        <Text style={styles.description}>Add the participants and receipt items to calculate each person's share.</Text>
        <View style={styles.scanCard}>
          <Text style={styles.scanTitle}>Scan a receipt</Text>
          <Text style={styles.scanDescription}>
            Choose a clear photo to fill in the merchant, total, tip,
            and line items automatically.
          </Text>

          {receiptImage && (
            <Image
              source={{ uri: receiptImage.uri }}
              style={styles.receiptPreview}
              resizeMode="contain"
              accessibilityLabel="Selected receipt"
            />
          )}

          <TouchableOpacity
            style={[
              styles.scanButton,
              (isScanning || isSubmitting) && styles.scanButtonDisabled,
            ]}
            onPress={handleScanReceipt}
            accessibilityRole="button"
            disabled={isScanning || isSubmitting}
          >
            {isScanning ? (
              <>
                <ActivityIndicator color={theme.textInverse} />
                <Text style={styles.scanButtonText}>Scanning...</Text>
              </>
            ) : (
              <Text style={styles.scanButtonText}>
                {receiptImage ? "Scan another receipt" : "Choose receipt photo"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
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
        {validationError ? (
          <Text style={styles.validationError} accessibilityElementsHidden>
            {validationError}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          accessibilityRole="button"
          disabled={!canSubmit}
        >
          <Text style={[
            styles.submitButtonText,
            !canSubmit && styles.submitButtonTextDisabled
          ]}>
            {isSubmitting ? "Calculating..." : "Calculate Split"}
          </Text>
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
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme: AppTheme) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: 20,
  },
  heading: {
    color: theme.primary,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },
  description: {
    color: theme.textSecondary,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 20,
  },
  scanCard: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scanTitle: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  scanDescription: {
    color: theme.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  receiptPreview: {
    width: "100%",
    height: 180,
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
    marginBottom: 14,
  },
  scanButton: {
    minHeight: 46,
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  scanButtonDisabled: {
    opacity: 0.65,
  },
  scanButtonText: {
    color: theme.textInverse,
    fontSize: 16,
    fontWeight: "700",
  },
  submitButton: {
    backgroundColor: theme.primaryDark,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 2,
    marginBottom: 20,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: theme.primaryMuted,
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  submitButtonText: {
    color: theme.textInverse,
    fontSize: 18,
    fontWeight: "700",
  },
  submitButtonTextDisabled: {
    color: theme.textMuted,
    fontSize: 18,
    fontWeight: "700",
  },
  validationError: {
    color: theme.danger,
    textAlign: "center",
    marginBottom: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});
