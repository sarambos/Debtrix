import { environment } from "../config/environment";
import type { CalculateSplitResult, Receipt } from "../types/types";

type ApiErrorBody = {
    message?: string;
};

export async function calculateSplitOnAws(receipt: Receipt): Promise<CalculateSplitResult> {
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