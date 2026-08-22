import { environment } from "../config/environment";
import type { CalculateSplitInput, CalculateSplitResult, Receipt, GetReceiptsResponse } from "../types/receipt";

type ApiErrorBody = {
    message?: string;
};

export async function calculateSplitOnAws(receipt: CalculateSplitInput): Promise<CalculateSplitResult> {
    const response = await fetch(`${environment.apiURL}/calculate-split`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items: receipt.items,
            tax: receipt.tax,
            tip: receipt.tip
        })
    });

    if (!response.ok) {
        let message = "Unable to calculate the split.";

        try {
            const errorBody = (await response.json()) as ApiErrorBody;

            if (errorBody.message) {
                message = errorBody.message;
            }
        } catch {
            // Preserve default message when the response is not JSON
        }

        throw new Error(message);
    }

    return (await response.json()) as CalculateSplitResult;
}

export async function getReceipts(): Promise<Receipt[]> {
    try {
        const response = await fetch(`${environment.apiURL}/receipts`, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });

        const body = (await response.json()) as GetReceiptsResponse | { message?: string };

        if (!response.ok) {
            const message = "message" in body && body.message
                ? body.message
                : "Unable to retrieve receipts.";

                throw new Error(message);
        }

        if (!("receipts" in body) || !Array.isArray(body.receipts)) {
            throw new Error("The server returned an invalid receipts response.");
        }

        return body.receipts;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error("Unable to connect to Debtrix. Check your internet connection and try again.");
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error("Unable to retrieve receipts.");
    }
}