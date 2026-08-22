import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { CalculateSplitResult } from '../types/receipt';
import { useThemeContext } from '../theme/themeContext';
import { AppTheme } from '../theme/colors';

type Props = {
    result: CalculateSplitResult | null;
};

export default function BalanceList({ result }: Props) { 
  const { theme } = useThemeContext();
  const styles = getStyles(theme);
  
  if (!result) {
    return (
      <View style={styles.centered}>
        <Text>Split result is unavailable.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>
          Subtotal: ${result.subtotal.toFixed(2)}
        </Text>
        <Text style={styles.summaryText}>
          Tax: ${result.tax.toFixed(2)}
        </Text>
        <Text style={styles.summaryText}>
          Tip: ${result.tip.toFixed(2)}
        </Text>
        <Text style={styles.summaryText}>
          Total: ${result.total.toFixed(2)}
        </Text>
      </View>
      {result.people.map((personData) => (
        <View key={personData.person} style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.person}>{personData.person}</Text>
            <Text style={styles.total}>
              ${personData.total.toFixed(2)}
            </Text>
          </View>
          {personData.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemAmount}>
                ${item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>Tax</Text>
            <Text style={styles.itemAmount}>
              ${personData.taxShare.toFixed(2)}
            </Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>Tip</Text>
            <Text style={styles.itemAmount}>
              ${personData.tipShare.toFixed(2)}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const getStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.surface,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.surface,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.surfaceSecondary,
    marginBottom: 12
  },
  summaryText: {
    fontSize: 15,
    marginBottom: 4,
    color: theme.primaryDark
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4
  },
  card: {
    backgroundColor: theme.surfaceSecondary,
    width: '100%',
    padding: 14,
    marginVertical: 8,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: theme.surfaceSecondary,
  },
  person: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  total: {
    color: theme.success,
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  itemName: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  itemAmount: {
    color: theme.textSecondary,
    fontSize: 14,
  },
});
