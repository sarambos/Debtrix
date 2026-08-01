import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { getReceipts } from '../../api/debtrixApi';
import type { Receipt } from '../../types/receipt';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function ReceiptDetailsScreen() {
    const { receiptId } = useLocalSearchParams<{
        receiptId: string;
    }>();
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loadReceipt = useCallback(async () => {
        if (!receiptId) {
            setErrorMessage("A receipt ID was not provided.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const receipts = await getReceipts();
            const matchingReceipt = receipts.find(
                (savedReceipt) => savedReceipt.receiptId === receiptId
            );

            if (!matchingReceipt) {
                throw new Error("This receipt could not be found.");
            }

            setReceipt(matchingReceipt);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to load this receipt.";
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }, [receiptId]);

    useEffect(() => {
        void loadReceipt();
    }, [loadReceipt]);

    if (isLoading) {
        return (
            <>
                <Stack.Screen options={{ title: "Receipt Details" }} />
                <View style={styles.centeredContainer}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.statusText}>
                        Loading receipt details...
                    </Text>
                </View>
            </>
        );
    }

    if (errorMessage || !receipt) {
        return (
            <>
                <Stack.Screen options={{ title: "Receipt Details" }} />
                <View style={styles.centeredContainer}>
                    <Text style={styles.errorTitle}>
                        Unable to load receipt
                    </Text>
                    <Text style={styles.errorMessage}>
                        {errorMessage ?? "This receipt could not be found."}
                    </Text>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => void loadReceipt()}
                        style={styles.retryButton}
                    >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </Pressable>
                </View>
            </>
        );
    }

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).format(new Date(receipt.createdAt));

    return (
        <>
            <Stack.Screen options={{ title: "Receipt Details" }} />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
            >
                <Text style={styles.date}>{formattedDate}</Text>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items</Text>
                    {receipt.items.map((item) => (
                        <View key={item.id} style={styles.row}>
                            <View style={styles.flex}>
                                <Text style={styles.itemName}>
                                    {item.name}
                                </Text>
                                {item.assignedTo.length > 0 ? (
                                    <Text style={styles.secondaryText}>
                                        Assigned to:{" "}
                                        {item.assignedTo.join(", ")}
                                    </Text>
                                ) : null}
                            </View>
                            <Text style={styles.amount}>
                                {currencyFormatter.format(item.price)}
                            </Text>
                        </View>
                    ))}
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Receipt Summary</Text>
                    <SummaryRow
                        label="Subtotal"
                        amount={receipt.subtotal}
                    />
                    <SummaryRow label="Tax" amount={receipt.tax} />
                    <SummaryRow label="Tip" amount={receipt.tip} />
                    <View style={styles.divider} />
                    <SummaryRow
                        label="Total"
                        amount={receipt.total}
                        emphasized
                    />
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Split Breakdown</Text>
                    {receipt.people.map((person) => (
                        <View
                            key={person.person}
                            style={styles.personCard}
                        >
                            <View style={styles.row}>
                                <Text style={styles.personName}>
                                    {person.person}
                                </Text>
                                <Text style={styles.personTotal}>
                                    {currencyFormatter.format(person.total)}
                                </Text>
                            </View>
                            {person.items.map((item) => (
                                <View
                                    key={`${person.person}-${item.id}`}
                                    style={styles.personItemRow}
                                >
                                    <Text style={styles.secondaryText}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.secondaryText}>
                                        {currencyFormatter.format(item.amount)}
                                    </Text>
                                </View>
                            ))}
                            <View style={styles.personSummary}>
                                <SummaryRow
                                    label="Item subtotal"
                                    amount={person.itemSubtotal}
                                />
                                <SummaryRow
                                    label="Tax share"
                                    amount={person.taxShare}
                                />
                                <SummaryRow
                                    label="Tip share"
                                    amount={person.tipShare}
                                />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </>
    );
}

interface SummaryRowProps {
    label: string;
    amount: number;
    emphasized?: boolean;
}

function SummaryRow({ label, amount, emphasized = false }: SummaryRowProps) {
    return (
        <View style={styles.summaryRow}>
            <Text
                style={[
                    styles.summaryLabel,
                    emphasized && styles.emphasizedText
                ]}
            >
                {label}
            </Text>
            <Text
                style={[
                    styles.summaryAmount,
                    emphasized && styles.emphasizedText
                ]}
            >
                {currencyFormatter.format(amount)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7"
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40
    },
    centeredContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24
    },
    statusText: {
        marginTop: 12,
        fontSize: 16,
        textAlign: "center"
    },
    errorTitle: {
        marginBottom: 8,
        fontSize: 20,
        fontWeight: "700"
    },
    errorMessage: {
        marginBottom: 20,
        fontSize: 15,
        textAlign: "center"
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: "#222222"
    },
    retryButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600"
    },
    date: {
        marginBottom: 18,
        color: "#555555",
        fontSize: 15
    },
    section: {
        marginBottom: 18,
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#ffffff"
    },
    sectionTitle: {
        marginBottom: 14,
        color: "#0c7489",
        fontSize: 20,
        fontWeight: "700"
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 12
    },
    flex: {
        flex: 1,
        marginRight: 16
    },
    itemName: {
        fontSize: 16,
        fontWeight: "600"
    },
    secondaryText: {
        marginTop: 3,
        color: "#666666",
        fontSize: 14
    },
    amount: {
        fontSize: 16,
        fontWeight: "600"
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8
    },
    summaryLabel: {
        fontSize: 15
    },
    summaryAmount: {
        fontSize: 15
    },
    emphasizedText: {
        fontSize: 18,
        fontWeight: "700"
    },
    divider: {
        height: 1,
        marginVertical: 8,
        backgroundColor: "#dddddd"
    },
    personCard: {
        marginBottom: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 10
    },
    personName: {
        fontSize: 17,
        fontWeight: "700"
    },
    personTotal: {
        fontSize: 17,
        fontWeight: "700"
    },
    personItemRow: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    personSummary: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#eeeeee"
    }
});