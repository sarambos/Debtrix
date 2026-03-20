import { Text, View, StyleSheet } from 'react-native';
import { Receipt } from '../types/types';

type PersonAmount = {
    person: string;
    amount: number;
};

type Props = {
    receipt: Receipt;
};

const calculateBalances = ( receipt: Receipt ): PersonAmount[] => {
        const balances: Record<string, number> = {};

        receipt.items.forEach((item) => {
            const split = item.price / item.assignedTo.length;

            item.assignedTo.forEach((person) => {
                if (!balances[person]) {
                    balances[person] = 0;
                }

                balances[person] += split;
            });
        });

        const subtotal = Object.values(balances).reduce((a, b) => a + b, 0);
        const totalExtra = (receipt.tax || 0) + (receipt.tip || 0);

        Object.keys(balances).forEach((person) => {
            const proportion = balances[person] / subtotal;
            balances[person] += totalExtra * proportion;
        });

        return Object.entries(balances).map(([person, amount]) => ({
            person,
            amount: parseFloat(amount.toFixed(2))
        }));;
    }

export default function BalanceList({receipt}: Props) { 
    const result = calculateBalances(receipt);

  return (
    <View style={styles.container}>
      {result.map(({person, amount}) => (
        <Text key={person} style={styles.card}>
          <Text style={styles.person}>{person}</Text>
          <Text style={styles.amount}> owes ${amount.toFixed(2)}</Text>
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#3b3f45',
    width: '90%',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  person: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});