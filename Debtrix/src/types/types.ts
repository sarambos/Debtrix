export type Transaction = {
    id: string;
    title: string;
    amount: number;
    date: string;
    paidBy: string;
    participants: string[];
    type: "paid" | "received";
}

export type TransactionItem = {
    id: string;
    name: string;
    price: number;
    participants: string[];
    taxRate?: number;
}

export type Expense = {
    id: string;
    numPeople: number;
    people: string[];
    type: string;
    totalAmount: number;
    receipt: Receipt;
    state: string;
}

export type ReceiptItem = {
    id: string;
    name: string;
    price: number;
    assignedTo: string[];
}

export type Receipt = {
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