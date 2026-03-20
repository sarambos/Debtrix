import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import GetTransactionHistory from '../../components/GetTransactionHistory';
import { Transaction } from '../../types/types';

export default function HomeScreen() {
  // Start with empty history
  const [history, setHistory] = useState<Transaction[]>([]);

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <Text style={styles.emptyText}>No history available yet</Text>
      ) : (
        <GetTransactionHistory transactions={history} />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#119da4',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#040404',
    marginTop: 50,
  },
});