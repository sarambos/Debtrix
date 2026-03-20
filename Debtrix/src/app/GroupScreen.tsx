import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Receipt, ReceiptItem } from '../types/types';
import BalanceList from '../components/BalanceList';

const receiptItems: ReceiptItem[] = [
  { id: "1", name: "Burger", price: 12, assignedTo: ["Stephanie"] },
  { id: "2", name: "Fries", price: 6, assignedTo: ["Stephanie", "Alex"] },
  { id: "3", name: "Drink", price: 4, assignedTo: ["Alex"] },
];

const receipt: Receipt = {
  items: [
    { id: "1", name: "Burger", price: 12, assignedTo: ["Stephanie"] },
    { id: "2", name: "Fries", price: 6, assignedTo: ["Stephanie", "Alex"] },
    { id: "3", name: "Drink", price: 4, assignedTo: ["Alex"] },
  ],
  tax: 2.2,
  tip: 3,
};

export default function Split() {
  return (
    <View style={styles.container}>
      <BalanceList receipt={receipt}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
