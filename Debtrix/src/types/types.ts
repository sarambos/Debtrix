export type Transaction = {
    id: string;
    title: string;
    amount: number;
    date: string;
    paidBy: string;
    participants: string[];
    type: "paid" | "received";
}