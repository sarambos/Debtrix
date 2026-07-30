import {
  AnalyzeExpenseCommand,
  TextractClient,
} from "@aws-sdk/client-textract";

const textract = new TextractClient({});

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

function parseMoney(value) {
  if (!value) {
    return undefined;
  }

  // Handles values such as "$12.45" or "12.45".
  const cleaned = value
    .replace(/[^\d,.-]/g, "")
    .replace(/,(?=\d{2}$)/, ".")
    .replace(/,/g, "");

  const number = Number.parseFloat(cleaned);

  return Number.isFinite(number) ? number : undefined;
}

function summaryValue(summaryFields, type) {
  return summaryFields.find((field) => field.Type?.Text === type)
    ?.ValueDetection?.Text;
}

function parseLineItem(lineItem, index) {
  const fields = lineItem.LineItemExpenseFields ?? [];

  const itemField = fields.find((field) => field.Type?.Text === "ITEM");
  const rowField = fields.find(
    (field) => field.Type?.Text === "EXPENSE_ROW",
  );
  const priceField = fields.find((field) => field.Type?.Text === "PRICE");

  const name =
    itemField?.ValueDetection?.Text ??
    rowField?.ValueDetection?.Text ??
    `Item ${index + 1}`;

  const price = parseMoney(priceField?.ValueDetection?.Text);

  if (price === undefined) {
    return null;
  }

  return {
    name,
    price,
    confidence: Math.min(
      itemField?.ValueDetection?.Confidence ??
        rowField?.ValueDetection?.Confidence ??
        100,
      priceField?.ValueDetection?.Confidence ?? 100,
    ),
  };
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return response(204, {});
  }

  try {
    const request = JSON.parse(event.body ?? "{}");
    const imageBase64 = request.imageBase64;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return response(400, {
        message: "imageBase64 is required",
      });
    }

    // Allows either raw Base64 or a data URL.
    const cleanBase64 = imageBase64.replace(
      /^data:image\/[a-zA-Z0-9.+-]+;base64,/,
      "",
    );

    const imageBytes = Buffer.from(cleanBase64, "base64");

    if (imageBytes.length === 0) {
      return response(400, {
        message: "The uploaded image was empty",
      });
    }

    const textractResult = await textract.send(
      new AnalyzeExpenseCommand({
        Document: {
          Bytes: imageBytes,
        },
      }),
    );

    const expenseDocument = textractResult.ExpenseDocuments?.[0];

    if (!expenseDocument) {
      return response(422, {
        message: "No receipt information was detected",
      });
    }

    const summaryFields = expenseDocument.SummaryFields ?? [];

    const items = (expenseDocument.LineItemGroups ?? [])
      .flatMap((group) => group.LineItems ?? [])
      .map(parseLineItem)
      .filter((item) => item !== null);

    return response(200, {
      vendorName: summaryValue(summaryFields, "VENDOR_NAME"),
      date: summaryValue(summaryFields, "INVOICE_RECEIPT_DATE"),
      subtotal: parseMoney(summaryValue(summaryFields, "SUBTOTAL")),
      tax: parseMoney(summaryValue(summaryFields, "TAX")),
      tip: parseMoney(summaryValue(summaryFields, "GRATUITY")),
      serviceCharge: parseMoney(
        summaryValue(summaryFields, "SERVICE_CHARGE"),
      ),
      total: parseMoney(summaryValue(summaryFields, "TOTAL")),
      items,
    });
  } catch (error) {
    console.error("Receipt scanning failed:", error);

    return response(500, {
      message: "The receipt could not be scanned",
    });
  }
};