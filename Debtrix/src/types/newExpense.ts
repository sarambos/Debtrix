export type PersonInput = {
    id: string;
    name: string;
};

export type ExpenseItemInput = {
    id: string;
    name: string;
    price: string;
    assignedTo: string[];
};

export type StateTaxRate = {
    name: string;
    taxRate: number;
};

export type TipOption = 0 | 10 | 15 | 18 | 20 | "custom";

export type NewExpenseFormState = {
    numPeople: string;
    people: PersonInput[];
    expenseName: string;
    totalAmount: string;
    selectedState: string;
    items: ExpenseItemInput[];
    tipOption: TipOption;
    customTipAmount: string;
};