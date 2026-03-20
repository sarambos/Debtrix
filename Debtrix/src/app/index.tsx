import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GetTransactionHistory from '../components/GetTransactionHistory';
import { Transaction } from '../types/types';

const history: Transaction[] = [
  {
    id: "1",
    title: "Dinner",
    amount: 45.50,
    date: "2026-03-18T19:30:00Z",
    paidBy: "Stephanie",
    participants: ["Stephanie", "Alex"],
    type: "paid",
  },
  {
    id: "2",
    title: "Uber",
    amount: 18.20,
    date: "2026-03-17T22:00:00Z",
    paidBy: "Alex",
    participants: ["Stephanie", "Alex"],
    type: "received",
  },
]

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <GetTransactionHistory transactions={history}/>
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
