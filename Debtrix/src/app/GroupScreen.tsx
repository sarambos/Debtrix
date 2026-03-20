import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Receipt, ReceiptItem } from '../types/types';
import BalanceList from '../components/BalanceList';
import { useRouter } from 'expo-router';


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
  const router = useRouter();
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});