import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import BalanceList from '../components/BalanceList';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

export default function Split() {
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