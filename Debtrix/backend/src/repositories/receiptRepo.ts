import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { CalculateSplitInput, CalculateSplitResult } from '../calculateSplit/calculateSplit';

const dynamoDBClient = new DynamoDBClient({});

const documentClient = DynamoDBDocumentClient.from(dynamoDBClient, {
    marshallOptions: {
        removeUndefinedValues: true
    }
});

export interface ReceiptRecord extends CalculateSplitResult {
    receiptId: string;
    createdAt: string;
    items: CalculateSplitInput["items"];
}

export async function saveReceipt(receipt: ReceiptRecord): Promise<void> {
    const tableName = process.env.RECEIPTS_TABLE_NAME;

    if (!tableName) {
        throw new Error('RECEIPTS_TABLE_NAME is not configured.');
    }

    await documentClient.send(new PutCommand({
        TableName: tableName,
        Item: receipt,
        ConditionExpression: "attribute_not_exists(receiptId)"
    }));
}

export async function listReceipts(): Promise<ReceiptRecord[]> {
    const tableName = process.env.RECEIPTS_TABLE_NAME;

    if (!tableName) {
        throw new Error ("RECEIPTS_TABLE_NAME is not configured.");
    }

    const receipts: ReceiptRecord[] = [];
    let lastEvaluatedKey: Record<string, unknown> | undefined;

    do {
        const response = await documentClient.send(
            new ScanCommand({
                TableName: tableName,
                ExclusiveStartKey: lastEvaluatedKey
            })
        );

        if (response.Items) {
            receipts.push(...(response.Items as ReceiptRecord[]));
        }

        lastEvaluatedKey = response.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return receipts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}