import { Text, View, StyleSheet } from 'react-native';
import { PersonBreakdown, Receipt } from '../types/types';
import calculateBalances from '../lib/calculateBalances';

type Props = {
    receipt: Receipt;
};

export default function BalanceList({receipt}: Props) { 
  const result = calculateBalances(receipt);

  return (
    <View style={styles.container}>
      {result.map((personData: PersonBreakdown) => (
        <View key={personData.person} style={styles.card}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.person}>{personData.person}</Text>
            <Text style={styles.total}>
              ${personData.total.toFixed(2)}
            </Text>
          </View>

          {/* Item Breakdown */}
          {personData.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemAmount}>
                ${item.amount.toFixed(2)}
              </Text>
            </View>
          ))}

        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  card: {
    backgroundColor: '#3b3f45',
    width: '100%',
    padding: 14,
    marginVertical: 8,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  person: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  total: {
    color: '#00ff94',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  itemName: {
    color: '#ccc',
    fontSize: 14,
  },
  itemAmount: {
    color: '#ccc',
    fontSize: 14,
  },
});
