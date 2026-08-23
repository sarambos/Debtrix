export type ExpenseFieldLike = {
  Type?: {
    Text?: string;
  };
  ValueDetection?: {
    Text?: string;
    Confidence?: number;
  };
};

export type LineItemLike = {
  LineItemExpenseFields?: ExpenseFieldLike[];
};

export type ExpenseDocumentLike = {
  SummaryFields?: ExpenseFieldLike[];
  LineItemGroups?: {
    LineItems?: LineItemLike[];
  }[];
};

export type ScannedReceiptItem = {
  name: string;
  price: number;
  confidence: number;
};

export type ScannedReceipt = {
  vendorName?: string;
  date?: string;
  subtotal?: number;
  tax?: number;
  tip?: number;
  serviceCharge?: number;
  total?: number;
  items: ScannedReceiptItem[];
};

function parseMoney(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }

  const cleaned = value
    .replace(/[^\d,.-]/g, "")
    .replace(/,(?=\d{2}$)/, ".")
    .replace(/,/g, "");

  const number = Number.parseFloat(cleaned);

  return Number.isFinite(number) ? number : undefined;
}

function summaryValue(
  summaryFields: ExpenseFieldLike[],
  type: string,
): string | undefined {
  return summaryFields.find(
    (field) => field.Type?.Text === type,
  )?.ValueDetection?.Text;
}

function parseLineItem(
  lineItem: LineItemLike,
  index: number,
): ScannedReceiptItem | null {
  const fields = lineItem.LineItemExpenseFields ?? [];

  const itemField = fields.find(
    (field) => field.Type?.Text === "ITEM",
  );

  const rowField = fields.find(
    (field) => field.Type?.Text === "EXPENSE_ROW",
  );

  const priceField = fields.find(
    (field) => field.Type?.Text === "PRICE",
  );

  const price = parseMoney(
    priceField?.ValueDetection?.Text,
  );

  if (price === undefined) {
    return null;
  }

  return {
    name:
      itemField?.ValueDetection?.Text ??
      rowField?.ValueDetection?.Text ??
      `Item ${index + 1}`,
    price,
    confidence: Math.min(
      itemField?.ValueDetection?.Confidence ??
        rowField?.ValueDetection?.Confidence ??
        100,
      priceField?.ValueDetection?.Confidence ?? 100,
    ),
  };
}

export function processReceipt(
  expenseDocument?: ExpenseDocumentLike,
): ScannedReceipt {
  if (!expenseDocument) {
    throw new Error("Textract did not detect a receipt.");
  }

  const summaryFields =
    expenseDocument.SummaryFields ?? [];

  const items = (
    expenseDocument.LineItemGroups ?? []
  )
    .flatMap((group) => group.LineItems ?? [])
    .map(parseLineItem)
    .filter(
      (item): item is ScannedReceiptItem =>
        item !== null,
    );

  return {
    vendorName: summaryValue(
      summaryFields,
      "VENDOR_NAME",
    ),
    date: summaryValue(
      summaryFields,
      "INVOICE_RECEIPT_DATE",
    ),
    subtotal: parseMoney(
      summaryValue(summaryFields, "SUBTOTAL"),
    ),
    tax: parseMoney(
      summaryValue(summaryFields, "TAX"),
    ),
    tip: parseMoney(
      summaryValue(summaryFields, "GRATUITY"),
    ),
    serviceCharge: parseMoney(
      summaryValue(
        summaryFields,
        "SERVICE_CHARGE",
      ),
    ),
    total: parseMoney(
      summaryValue(summaryFields, "TOTAL"),
    ),
    items,
  };
}
