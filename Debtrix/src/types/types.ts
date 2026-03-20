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

export type Receipt = {
    items: ReceiptItem[];
    tax: number;
    tip?: number;
}