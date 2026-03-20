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
    tax: number;
    tip?: number;
}