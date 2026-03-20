import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Receipt, ReceiptItem } from '../types/types';
import BalanceList from '../components/BalanceList';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

// const receiptItems: ReceiptItem[] = [
//   { id: "1", name: "Burger", price: 12, assignedTo: ["Stephanie"] },
//   { id: "2", name: "Fries", price: 6, assignedTo: ["Stephanie", "Alex"] },
//   { id: "3", name: "Drink", price: 4, assignedTo: ["Alex"] },
// ];

// const receipt: Receipt = {
//   items: [
//     { id: "1", name: "Burger", price: 12, assignedTo: ["Stephanie"] },
//     { id: "2", name: "Fries", price: 6, assignedTo: ["Stephanie", "Alex"] },
//     { id: "3", name: "Drink", price: 4, assignedTo: ["Alex"] },
//   ],
//   tax: 2.2,
//   tip: 3,
// };

export default function Split() {
  const router = useRouter();
  const { receipt } = useLocalSearchParams();
  const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Split Report',
            headerTitleAlign: "center"
        });
    }, [navigation]);

    const parsedReceipt = receipt
        ? JSON.parse(receipt as string)
        : null;

  return (
      <View style={styles.container}>
        <BalanceList receipt={parsedReceipt}/>
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});