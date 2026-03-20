import { Text, View, StyleSheet } from 'react-native';
import { Receipt } from '../types/types';

type Props = {
    receipt: Receipt;
};

type PersonBreakdown = {
  person: string;
  total: number;
  items: {
    name: string;
    amount: number;
  }[];
};

const calculateBalances = (receipt: Receipt): PersonBreakdown[] => {
  const balances: Record<string, number> = {};
  const itemMap: Record<string, { name: string; amount: number }[]> = {};

  receipt.items.forEach((item) => {
    const split = item.price / item.assignedTo.length;

    item.assignedTo.forEach((person) => {
      if (!balances[person]) balances[person] = 0;
      if (!itemMap[person]) itemMap[person] = [];
      balances[person] += split;

      itemMap[person].push({
        name: item.name,
        amount: split,
      });
    });
  });

  const subtotal = Object.values(balances).reduce((a, b) => a + b, 0);

  Object.keys(balances).forEach((person) => {
    const proportion = balances[person] / subtotal;
    const taxShare = (receipt.tax || 0) * proportion;

    balances[person] += taxShare;

    itemMap[person].push({
      name: "Tax",
      amount: taxShare,
    });
  });

  if (receipt.tip) {
    Object.keys(balances).forEach((person) => {
      const proportion = balances[person] / subtotal;
      const tipShare = receipt.tip! * proportion;

      balances[person] += tipShare;

      itemMap[person].push({
        name: "Tip",
        amount: tipShare,
      });
    });
  }

  return Object.keys(balances).map((person) => ({
    person,
    total: parseFloat(balances[person].toFixed(2)),
    items: itemMap[person].map((item) => ({
      name: item.name,
      amount: parseFloat(item.amount.toFixed(2)),
    })),
  }));
};

export default function BalanceList({receipt}: Props) { 
  const result = calculateBalances(receipt);

  return (
    <View style={styles.container}>
      {result.map((personData) => (
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