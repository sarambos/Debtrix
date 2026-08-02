import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Transaction } from '../types/receipt';
import { useThemeContext } from '../theme/themeContext';
import { AppTheme } from '../theme/colors';

type Props = {
    transactions: Transaction[];
}

const getPaymentText = (item: Transaction, currentUser: string) => {
    if (item.type === "paid") {
        const recipient = item.participants.filter(p => p != currentUser);
        return `to ${recipient}`;
    } else {
        return `from ${item.paidBy}`;
    }
}

export default function GetTransactionHistory({ transactions }: Props) {
    const { theme } = useThemeContext();
    const styles = getStyles(theme);
    
    const renderItem = ({ item }: { item: Transaction }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{new Date(item.date).toLocaleDateString()}</Text>
            <Text style={{ color: item.type === "paid" ? "red" : "green" }}>
                {item.type === "paid" ? "-" : "+"}${item.amount.toFixed(2)}
            </Text>
            <Text>{getPaymentText(item, "Stephanie")}</Text>
        </View>
    );
  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const getStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: 16,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 2,
    width: "90%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});