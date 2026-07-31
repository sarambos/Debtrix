export type Transaction = {
    id: string;
    title: string;
    amount: number;
    date: string;
    paidBy: string;
    participants: string[];
    type: "paid" | "received";
}

export type ReceiptItem = {
    id: string;
    name: string;
    price: number;
    assignedTo: string[];
}

export type CalculateSplitInput = {
    items: ReceiptItem[];
    subtotal: number;
    tax: number;
    tip: number;
    total: number;
}

export type PersonBreakdown = {
  person: string;
  itemSubtotal: number;
  taxShare: number;
  tipShare: number;
  total: number;
  items: {
    id: string;
    name: string;
    amount: number;
  }[];
};

export type CalculateSplitResult = {
    subtotal: number;
    tax: number;
    tip: number;
    total: number;
    people: PersonBreakdown[];
};

export interface CalculateSplitResponse extends CalculateSplitResult {
    receiptId: string;
    createdAt: string;
}

export interface Receipt {
    receiptId: string;
    createdAt: string;
    subtotal: number;
    tax: number;
    tip: number;
    total: number;
    items: ReceiptItem[];
    people: PersonBreakdown[];
}

export interface GetReceiptsResponse {
    receipts: Receipt[];
}