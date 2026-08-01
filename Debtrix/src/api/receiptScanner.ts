import { environment } from "../config/environment";
import type { ScannedReceipt } from "../types/receipt";

type ApiErrorBody = {
  message?: string;
};

export async function scanReceiptImage(
  imageBase64: string,
): Promise<ScannedReceipt> {
  if (!imageBase64.trim()) {
    throw new Error("Choose a receipt image before scanning.");
  }

  if (
    process.env.EXPO_PUBLIC_USE_MOCK_SCANNER === "true"
  ) {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000),
    );

    return {
      vendorName: "Pizza Palace",
      subtotal: 24,
      tax: 1.84,
      tip: 3,
      total: 28.84,
      items: [
        {
          name: "Large Pizza",
          price: 16,
          confidence: 98,
        },
        {
          name: "Garlic Knots",
          price: 5,
          confidence: 96,
        },
        {
          name: "Soda",
          price: 3,
          confidence: 97,
        },
      ],
    };
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
