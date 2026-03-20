import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useMemo } from "react";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Receipt, ReceiptItem } from "../../types/types";

const states = [
  { name: "Alabama", taxRate: 4.0 },
  { name: "Alaska", taxRate: 0.0 },
  { name: "Arizona", taxRate: 5.6 },
  { name: "Arkansas", taxRate: 6.5 },
  { name: "California", taxRate: 7.25 },
  { name: "Colorado", taxRate: 2.9 },
  { name: "Connecticut", taxRate: 6.35 },
  { name: "Delaware", taxRate: 0.0 },
  { name: "Florida", taxRate: 6.0 },
  { name: "Georgia", taxRate: 4.0 },
  { name: "Hawaii", taxRate: 4.0 },
  { name: "Idaho", taxRate: 6.0 },
  { name: "Illinois", taxRate: 6.25 },
  { name: "Indiana", taxRate: 7.0 },
  { name: "Iowa", taxRate: 6.0 },
  { name: "Kansas", taxRate: 6.5 },
  { name: "Kentucky", taxRate: 6.0 },
  { name: "Louisiana", taxRate: 4.45 },
  { name: "Maine", taxRate: 5.5 },
  { name: "Maryland", taxRate: 6.0 },
  { name: "Massachusetts", taxRate: 6.25 },
  { name: "Michigan", taxRate: 6.0 },
  { name: "Minnesota", taxRate: 6.88 },
  { name: "Mississippi", taxRate: 7.0 },
  { name: "Missouri", taxRate: 4.23 },
  { name: "Montana", taxRate: 0.0 },
  { name: "Nebraska", taxRate: 5.5 },
  { name: "Nevada", taxRate: 6.85 },
  { name: "New Hampshire", taxRate: 0.0 },
  { name: "New Jersey", taxRate: 6.63 },
  { name: "New Mexico", taxRate: 5.13 },
  { name: "New York", taxRate: 4.0 },
  { name: "North Carolina", taxRate: 4.75 },
  { name: "North Dakota", taxRate: 5.0 },
  { name: "Ohio", taxRate: 5.75 },
  { name: "Oklahoma", taxRate: 4.5 },
  { name: "Oregon", taxRate: 0.0 },
  { name: "Pennsylvania", taxRate: 6.0 },
  { name: "Rhode Island", taxRate: 7.0 },
  { name: "South Carolina", taxRate: 6.0 },
  { name: "South Dakota", taxRate: 4.5 },
  { name: "Tennessee", taxRate: 7.0 },
  { name: "Texas", taxRate: 6.25 },
  { name: "Utah", taxRate: 4.85 },
  { name: "Vermont", taxRate: 6.0 },
  { name: "Virginia", taxRate: 5.3 },
  { name: "Washington", taxRate: 6.5 },
  { name: "West Virginia", taxRate: 6.0 },
  { name: "Wisconsin", taxRate: 5.0 },
  { name: "Wyoming", taxRate: 4.0 },
];

interface Person {
  name: string;
}

export default function NewExpense() {
  const router = useRouter();

  // Form state
  const [numPeople, setNumPeople] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [expenseName, setExpenseName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [receipt, setReceipt] = useState<ImagePicker.ImagePickerAsset | null>(
    null,
  );
  const [selectedState, setSelectedState] = useState("");
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [manualReceipt, setManualReceipt] = useState("");
  const [items, setItems] = useState<
    { name: string; price: string; assignedTo: string[] }[]
  >([]);

  // State picker modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states based on search query
  const filteredStates = useMemo(() => {
    if (!searchQuery.trim()) return states;
    return states.filter((state) =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const addItem = () => {
    setItems([...items, { name: "", price: "", assignedTo: [] }]);
  };

  const updateItem = (
    index: number,
    field: "name" | "price",
    value: string,
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const computedTotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  const toggleAssignPerson = (itemIndex: number, personName: string) => {
    const newItems = [...items];
    const assigned = newItems[itemIndex].assignedTo;

    if (assigned.includes(personName)) {
      newItems[itemIndex].assignedTo = assigned.filter((p) => p !== personName);
    } else {
      newItems[itemIndex].assignedTo.push(personName);
    }

    setItems(newItems);
  };

  // Handle number of people change
  const handleNumPeopleChange = (text: string) => {
    setNumPeople(text);
    const count = parseInt(text);
    if (!isNaN(count) && count > 0 && count <= 20) {
      const newPeople = Array(count)
        .fill(null)
        .map(() => ({ name: "" }));
      setPeople(newPeople);
    } else if (text === "") {
      setPeople([]);
    }
  };

  // Update person name
  const updatePersonName = (index: number, name: string) => {
    const newPeople = [...people];
    newPeople[index] = { name };
    setPeople(newPeople);
  };

  // Upload receipt functions
  // const takePhoto = async () => {
  //   const { status } = await ImagePicker.requestCameraPermissionsAsync();
  //   if (status !== 'granted') {
  //     Alert.alert('Permission needed', 'Camera access required');
  //     return;
  //   }

  //   const result = await ImagePicker.launchCameraAsync({
  //     allowsEditing: true,
  //     quality: 0.8,
  //   });

  //   if (!result.canceled) {
  //     setReceipt(result.assets[0]);
  //     setReceiptUploaded(true);
  //     Alert.alert('Success', 'Receipt uploaded!');
  //   }
  // };

  // const pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     quality: 0.8,
  //   });

  //   if (!result.canceled) {
  //     setReceipt(result.assets[0]);
  //     setReceiptUploaded(true);
  //     Alert.alert('Success', 'Receipt uploaded!');
  //   }
  // };

  // Get tax rate for selected state
  const getTaxRate = (stateName: string): number => {
    const state = states.find((s) => s.name === stateName);
    return state ? state.taxRate : 0;
  };

  // Select state handler
  const handleSelectState = (stateName: string) => {
    setSelectedState(stateName);
    setModalVisible(false);
    setSearchQuery("");
  };

  // Validate all fields before submitting
  const validateForm = () => {
    if (!numPeople || parseInt(numPeople) <= 0) {
      Alert.alert("Error", "Please enter number of people");
      return false;
    }

    if (people.some((person) => !person.name.trim())) {
      Alert.alert("Error", "Please enter all person names");
      return false;
    }

    if (!expenseName.trim()) {
      Alert.alert("Error", "Please enter expense name");
      return false;
    }

    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      Alert.alert("Error", "Please enter valid total amount");
      return false;
    }

    // if (!receiptUploaded) {
    //   Alert.alert('Error', 'Please upload a receipt');
    //   return false;
    // }

    if (!selectedState) {
      Alert.alert("Error", "Please select a state");
      return false;
    }

    if (items.length === 0) {
      Alert.alert("Error", "Please add at least one item");
      return false;
    }

    if (items.some((item) => !item.assignedTo.length)) {
      Alert.alert("Error", "Each item must be assigned to at least one person");
      return false;
    }

    return true;
  };

  const buildReceipt = (): Receipt => {
    const taxRate = getTaxRate(selectedState);
    const subtotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    const taxAmount = subtotal * (taxRate / 100);

    const receiptItems: ReceiptItem[] = items.map((item, index) => ({
      id: index.toString(),
      name: item.name,
      price: parseFloat(item.price),
      assignedTo: item.assignedTo,
    }));

    return {
      items: receiptItems,
      tax: taxAmount,
    };
  };

  // Calculate and show split
  const handleSubmit = () => {
    if (!validateForm()) return;

    const receiptData = buildReceipt();

    console.log("RECEIPT:", receiptData);

    router.push({
      pathname: "../GroupScreen",
      params: {
        receipt: JSON.stringify(receiptData),
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Form Content */}
      <View style={styles.form}>
        {/* Step 1: Number of People */}
        <View style={styles.section}>
          <Text style={styles.label}>
            How many people? <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number of people"
            keyboardType="numeric"
            value={numPeople}
            onChangeText={handleNumPeopleChange}
          />
        </View>

        {/* Step 2: People Names */}
        {people.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>
              Who's splitting? <Text style={styles.required}>*</Text>
            </Text>
            {people.map((person, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={`Person ${index + 1} name`}
                value={person.name}
                onChangeText={(text) => updatePersonName(index, text)}
              />
            ))}
          </View>
        )}

        {/* Step 3: Expense Details */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Expense name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Dinner at Pizza Place"
            value={expenseName}
            onChangeText={setExpenseName}
          />

          <Text style={styles.label}>
            Total amount <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="$0.00"
            keyboardType="decimal-pad"
            value={totalAmount}
            onChangeText={setTotalAmount}
          />
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.label}>
            Upload receipt 
          </Text>
          {receiptUploaded && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>✓ Receipt uploaded successfully!</Text>
            </View>
          )}

          <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="camera" size={24} color="white" />
              <Text style={styles.buttonText}> Take Photo</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="image" size={24} color="white" />
              <Text style={styles.buttonText}> Choose from Gallery</Text>
            </View>
          </TouchableOpacity>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.label}>Enter items manually</Text>

          {items.map((item, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
              {/* Item Inputs */}
              <View style={{ flexDirection: "row", marginBottom: 6 }}>
                <TextInput
                  style={[styles.input, { flex: 2, marginRight: 8 }]}
                  placeholder="Item name"
                  value={item.name}
                  onChangeText={(text) => updateItem(index, "name", text)}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="$0.00"
                  keyboardType="decimal-pad"
                  value={item.price}
                  onChangeText={(text) => updateItem(index, "price", text)}
                />
                <TouchableOpacity onPress={() => removeItem(index)}>
                  <Text style={{ color: "red", fontSize: 20, marginLeft: 8 }}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 🔥 Assign People */}
              <Text style={{ fontWeight: "600", marginBottom: 4 }}>
                Who got this?
              </Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {people.map((person, pIndex) => {
                  const selected = item.assignedTo.includes(person.name);

                  return (
                    <TouchableOpacity
                      key={pIndex}
                      onPress={() => toggleAssignPerson(index, person.name)}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        margin: 4,
                        borderRadius: 20,
                        backgroundColor: selected ? "#007AFF" : "#e0e0e0",
                      }}
                    >
                      <Text style={{ color: selected ? "#fff" : "#333" }}>
                        {person.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Text style={styles.submitButtonText}>+ Add Item</Text>
          </TouchableOpacity>

          <Text style={{ marginTop: 12, fontWeight: "600" }}>
            Computed Total: ${computedTotal.toFixed(2)}
          </Text>
        </View>

        {/* Step 5: Select State with Search */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Select your state <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.subtitle}>For tax calculation</Text>

          {/* Selected State Display */}
          <TouchableOpacity
            style={styles.stateSelector}
            onPress={() => setModalVisible(true)}
          >
            <Text
              style={
                selectedState
                  ? styles.selectedStateText
                  : styles.placeholderText
              }
            >
              {selectedState || "Tap to select a state"}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {selectedState ? (
            <View style={styles.selectedStateInfo}>
              <Text style={styles.selectedStateInfoText}>
                Tax rate: {getTaxRate(selectedState)}%
              </Text>
            </View>
          ) : null}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Calculate Split →</Text>
        </TouchableOpacity>

        {/* Spacing at bottom */}
        <View style={styles.bottomSpacing} />
      </View>

      {/* Modal for State Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSearchQuery("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery("");
                }}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a state..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Text style={styles.clearSearch}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* States List */}
            <FlatList
              data={filteredStates}
              keyExtractor={(item) => item.name}
              style={styles.statesList}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalStateItem,
                    selectedState === item.name
                      ? styles.modalStateItemSelected
                      : null,
                  ]}
                  onPress={() => handleSelectState(item.name)}
                >
                  <Text
                    style={[
                      styles.modalStateName,
                      selectedState === item.name
                        ? styles.modalStateNameSelected
                        : null,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.modalStateTax,
                      selectedState === item.name
                        ? styles.modalStateTaxSelected
                        : null,
                    ]}
                  >
                    {item.taxRate}% tax
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No states found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#119da4",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#d7d9ce",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    fontSize: 16,
    color: "#13505b",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  form: {
    padding: 20,
  },
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
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0c7489",
  },
  required: {
    color: "#FF3B30",
  },
  input: {
    backgroundColor: "#d7d9ce",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#808080",
  },
  cameraButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  galleryButton: {
    backgroundColor: "#34C759",
    padding: 14,
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#040404",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  successContainer: {
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  successText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 12,
    color: "#oc7489",
    marginBottom: 12,
  },
  stateSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#d7d9ce",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#808080",
  },
  selectedStateText: {
    fontSize: 16,
    color: "#040404",
    fontWeight: "500",
  },
  placeholderText: {
    fontSize: 16,
    color: "#808080",
  },
  dropdownIcon: {
    fontSize: 14,
    color: "#119da4",
  },
  selectedStateInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#d7d9ce",
    borderRadius: 8,
  },
  selectedStateInfoText: {
    fontSize: 14,
    color: "#119da4",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#119da4",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#13505b",
  },
  modalClose: {
    fontSize: 24,
    color: "#999",
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#d7d9ce",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  clearSearch: {
    fontSize: 18,
    color: "#999",
    padding: 10,
    marginLeft: 5,
  },
  statesList: {
    padding: 20,
  },
  modalStateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 8,
    backgroundColor: "#d7d9ce",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  modalStateItemSelected: {
    backgroundColor: "#13505b",
    borderColor: "#040404",
  },
  modalStateName: {
    fontSize: 16,
    color: "#333",
  },
  modalStateNameSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  modalStateTax: {
    fontSize: 14,
    color: "#666",
  },
  modalStateTaxSelected: {
    color: "#fff",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  submitButton: {
    backgroundColor: "#13505b",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
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
    fontWeight: "bold",
  },
  bottomSpacing: {
    height: 40,
  },
  addButton: {
    backgroundColor: "#13505b",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
});
