import { processReceipt } from "../../processReceipt/processReceipt";

describe("processReceipt", () => {
  test("extracts summary fields and line items", () => {
    const result = processReceipt({
      SummaryFields: [
        {
          Type: { Text: "VENDOR_NAME" },
          ValueDetection: { Text: "Demo Cafe" },
        },
        {
          Type: { Text: "SUBTOTAL" },
          ValueDetection: { Text: "$18.50" },
        },
        {
          Type: { Text: "TAX" },
          ValueDetection: { Text: "$1.39" },
        },
        {
          Type: { Text: "GRATUITY" },
          ValueDetection: { Text: "$3.00" },
        },
        {
          Type: { Text: "TOTAL" },
          ValueDetection: { Text: "$22.89" },
        },
      ],
      LineItemGroups: [
        {
          LineItems: [
            {
              LineItemExpenseFields: [
                {
                  Type: { Text: "ITEM" },
                  ValueDetection: {
                    Text: "Sandwich",
                    Confidence: 97,
                  },
                },
                {
                  Type: { Text: "PRICE" },
                  ValueDetection: {
                    Text: "$12.50",
                    Confidence: 95,
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    expect(result).toEqual({
      vendorName: "Demo Cafe",
      date: undefined,
      subtotal: 18.5,
      tax: 1.39,
      tip: 3,
      serviceCharge: undefined,
      total: 22.89,
      items: [
        {
          name: "Sandwich",
          price: 12.5,
          confidence: 95,
        },
      ],
    });
  });

  test("uses the expense row when an item name is unavailable", () => {
    const result = processReceipt({
      LineItemGroups: [
        {
          LineItems: [
            {
              LineItemExpenseFields: [
                {
                  Type: { Text: "EXPENSE_ROW" },
                  ValueDetection: { Text: "Coffee 4.25" },
                },
                {
                  Type: { Text: "PRICE" },
                  ValueDetection: { Text: "4.25" },
                },
              ],
            },
            {
              LineItemExpenseFields: [
                {
                  Type: { Text: "ITEM" },
                  ValueDetection: { Text: "No price" },
                },
              ],
            },
          ],
        },
      ],
    });

    expect(result.items).toEqual([
      {
        name: "Coffee 4.25",
        price: 4.25,
        confidence: 100,
      },
    ]);
  });

  test("rejects an empty Textract result", () => {
    expect(() => processReceipt()).toThrow(
      "Textract did not detect a receipt.",
    );
  });
});
