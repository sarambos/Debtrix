import type { APIGatewayProxyResult } from "aws-lambda";
import { listReceipts } from "../repositories/receiptRepo";

export async function handler(): Promise<APIGatewayProxyResult> {
    try {
        const receipts = await listReceipts();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({receipts})
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({message: "Unable to retrieve receipts."})
        };
    }
}