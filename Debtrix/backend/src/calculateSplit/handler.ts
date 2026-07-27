import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { calculateSplit, CalculateSplitInput } from "./calculateSplit";
import { saveReceipt, ReceiptRecord } from "../repositories/receiptRepo";

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
};

function response(statusCode: number, body: unknown): APIGatewayProxyResultV2 {
    return {
        statusCode,
        headers,
        body: JSON.stringify(body)
    };
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    try {
        if (!event.body) {
            return response(400, { message: "Request body is required" });
        }

        const input = JSON.parse(event.body) as CalculateSplitInput;

        const result = calculateSplit(input);

        const receipt: ReceiptRecord = {
            receiptId: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            items: input.items,
            ...result
        };

        await saveReceipt(receipt);

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(receipt)
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to calculate split";

        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message })
        };
    }
}