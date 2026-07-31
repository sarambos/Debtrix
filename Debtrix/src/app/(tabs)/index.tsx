import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getReceipts } from "../../api/debtrixApi";
import type { Receipt } from "../../types/receipt";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadReceipts = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setErrorMessage(null);

    try {
      const savedReceipts = await getReceipts();
      setReceipts(savedReceipts);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to retrieve receipts.";

      setErrorMessage(message);
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadReceipts();
    }, [loadReceipts])
  );

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading receipts...</Text>
      </View>
    );
  }

  if (errorMessage && receipts.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorTitle}>Unable to load receipts</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => void loadReceipts()}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt History</Text>
      {errorMessage ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{errorMessage}</Text>
        </View>
      ) : null}
      <FlatList
        data={receipts}
        keyExtractor={(receipt) => receipt.receiptId}
        contentContainerStyle={
          receipts.length === 0
            ? styles.emptyListContainer
            : styles.listContainer
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void loadReceipts(true)}
          />
        }
        ListEmptyComponent={
          <View style={styles.centeredContainer}>
            <Text style={styles.emptyTitle}>No receipts yet</Text>
            <Text style={styles.statusText}>
              Expenses you split will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ReceiptCard
            receipt={item}
            onPress={() =>
              router.push({
                pathname: "/receipt/[receiptId]",
                params: {
                  receiptId: item.receiptId,
                },
              })
            }
          />
        )}
      />
    </View>
  );
}

interface ReceiptCardProps {
  receipt: Receipt;
  onPress: () => void;
}

function ReceiptCard({ receipt, onPress }: ReceiptCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(receipt.createdAt));

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(receipt.total);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View receipt from ${formattedDate}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.receiptCard,
        pressed && styles.receiptCardPressed,
      ]}
    >
      <View>
        <Text style={styles.receiptDate}>{formattedDate}</Text>
        <Text style={styles.receiptDetails}>
          {receipt.items.length} {receipt.items.length === 1 ? "item" : "items"}
          {" . "}
          {receipt.people.length}{" "}
          {receipt.people.length === 1 ? "person" : "people"}
        </Text>
      </View>
      <View style={styles.receiptRightSide}>
        <Text style={styles.receiptTotal}>{formattedTotal}</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    marginBottom: 16,
    fontSize: 28,
    fontWeight: "700",
  },
  statusText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
  },
  errorTitle: {
    marginBottom: 8,
    fontSize: 20,
    fontWeight: "700",
  },
  errorMessage: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 15,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#222222",
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorBanner: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f5dddd",
  },
  errorBannerText: {
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 24,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyTitle: {
    marginBottom: 4,
    fontSize: 20,
    fontWeight: "700",
  },
  receiptCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 12,
  },
  receiptCardPressed: {
    opacity: 0.65,
  },
  receiptRightSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  receiptDate: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "600",
  },
  receiptDetails: {
    fontSize: 14,
  },
  receiptTotal: {
    fontSize: 18,
    fontWeight: "700",
  },
  chevron: {
    fontSize: 20,
    fontWeight: "700",
  },
});
