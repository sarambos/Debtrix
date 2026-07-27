import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import BalanceList from '../components/BalanceList';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { CalculateSplitResult } from '../types/types';

export default function Split() {
  const { splitResult } = useLocalSearchParams<{ splitResult?: string;}>();
  const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Split Report',
            headerTitleAlign: "center"
        });
    }, [navigation]);

    const parsedResult: CalculateSplitResult | null =
      typeof splitResult === "string"
        ? JSON.parse(splitResult)
        : null;

  return (
      <View style={styles.container}>
        <BalanceList result={parsedResult}/>
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