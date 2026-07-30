import { environment } from "../config/environment";
import type { ScannedReceipt } from "../types/types";

type ApiErrorBody = {
  message?: string;
};

export async function scanReceiptImage(
  imageBase64: string,
): Promise<ScannedReceipt> {
  if (!imageBase64.trim()) {
    throw new Error("Choose a receipt image before scanning.");
  }

  const response = await fetch(
    `${environment.apiURL}/scan-receipt`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageBase64 }),
    },
  );

  if (!response.ok) {
    let message = "Unable to scan the receipt.";

    try {
      const errorBody =
        (await response.json()) as ApiErrorBody;

      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Preserve the default message when the response is not JSON.
    }

    throw new Error(message);
  }

  const scannedReceipt =
    (await response.json()) as ScannedReceipt;

  if (!Array.isArray(scannedReceipt.items)) {
    throw new Error(
      "The scanner returned an invalid receipt.",
    );
  }

  return scannedReceipt;
}
