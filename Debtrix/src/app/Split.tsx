import { StatusBar } from 'expo-status-bar';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import BalanceList from '../components/BalanceList';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { CalculateSplitResult } from '../types/receipt';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../theme/themeContext';
import { AppTheme } from '../theme/colors';

export default function Split() {
  const { splitResult } = useLocalSearchParams<{ splitResult?: string;}>();
  const navigation = useNavigation();
  const router = useRouter();
  const { theme } = useThemeContext();
  const styles = getStyles(theme);

  const goHome = useCallback(() => {
    router.replace("/");
  }, [router]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Split Report',
            headerTitleAlign: "center",
            gestureEnabled: false,
            headerLeft: () => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Home"
                onPress={goHome}
                hitSlop={12}
                style={styles.backButton}
              >
                <Ionicons
                  name="chevron-back"
                  size={26}
                  color={theme.primaryDark}
                />
              </Pressable>
            )
        });
    }, [goHome, navigation]);

    useEffect(() => {
      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          goHome();
          return true;
        }
      )
      return () => {
        sub.remove();
      }
    }, [goHome])

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

const getStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.surface,
    justifyContent: 'center',
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: theme.textSecondary
  }
});