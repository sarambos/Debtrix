import { STATE_TAX_RATES } from '../data/stateTaxRates';
import { ExpenseItemInput, NewExpenseFormState, TipOption } from '../types/newExpense';
import { Receipt, ReceiptItem } from '../types/types';

export function createId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function parseCurrency(value: string): number {
    const norm = value.replace(/[$,\s]/g, '');
    const parsed = Number.parseFloat(norm);

    return Number.isFinite(parsed) ? parsed : 0;
}

export function calculateItemsSubtotal( items: ExpenseItemInput[]): number {
    return items.reduce((sum, item) => sum + parseCurrency(item.price), 0);
}

export function getTaxRate(stateName: string): number {
    return (
        STATE_TAX_RATES.find((state) => state.name === stateName) ?.taxRate ?? 0
    );
}

export function calculateTaxAmount(subtotal: number, taxRate: number): number {
    return subtotal * (taxRate / 100);
}

export function calculateTipAmount(subtotal: number, tipOption: TipOption, customTipAmount: string): number {
    if (tipOption === "custom") {
        return parseCurrency(customTipAmount);
    }

    return subtotal * (tipOption / 100);
}

export function validateNewExpenseForm(form: NewExpenseFormState): string | null {
    const numOfPeople = Number.parseInt(form.numPeople, 10);

    if (!Number.isInteger(numOfPeople) || numOfPeople < 1 || numOfPeople > 20) {
        return "Number of people must be an integer between 1 and 20";
    }

    const trimmedNames = form.people.map((person) => person.name.trim());

    if (trimmedNames.some((name) => name.length === 0)) {
        return "Enter a name for every person.";
    }

    const normNames = trimmedNames.map((name) => name.toLowerCase());

    if (new Set(normNames).size !== normNames.length) {
        return "Each person must have a unique name.";
    }

    if (!form.selectedState) {
        return "Please select a state.";
    }

    if (form.items.length === 0) {
        return "Please add at least one expense item.";
    }

    for (const item of form.items) {
        if (!item.name.trim()) {
            return "Every expense item must have a name.";
        }

        if (parseCurrency(item.price) <= 0) {
            return `Enter a valid price for "${item.name || "each item"}".`;
        }

        if (item.assignedTo.length === 0) {
            return `Assign "${item.name}" to at least one person.`;
        }

        const invalidAssignment = item.assignedTo.some((person) => !trimmedNames.includes(person));

        if (invalidAssignment) {
            return `Review the assignments for "${item.name}".`;
        }
    }

    if (form.tipOption === "custom" && parseCurrency(form.customTipAmount) < 0) {
        return "Enter a valid custom tip amount.";
    }

    const enteredTotal = parseCurrency(form.totalAmount);
    const subtotal = calculateItemsSubtotal(form.items);
    const tax = calculateTaxAmount(subtotal, getTaxRate(form.selectedState));
    const tip = calculateTipAmount(subtotal, form.tipOption, form.customTipAmount);
    const computedTotal = subtotal + tax + tip;

    if (form.totalAmount.trim() && enteredTotal <= 0) {
        return "Enter a valid reciept total or leave it blank.";
    }

    if (form.totalAmount.trim() && Math.abs(enteredTotal - computedTotal) > 0.02) {
        return `The entered total ($${enteredTotal.toFixed(2)}) does not match the calculated total ($${computedTotal.toFixed(2)}).`;
    }

    return null;
}

export function buildReceipt(form: NewExpenseFormState): Receipt {
    const subtotal = calculateItemsSubtotal(form.items);
    const taxRate = getTaxRate(form.selectedState);
    const tax = calculateTaxAmount(subtotal, taxRate);
    const tip = calculateTipAmount(subtotal, form.tipOption, form.customTipAmount);

    const receiptItems: ReceiptItem[] = form.items.map(
        (item) => ({
            id: item.id,
            name: item.name.trim(),
            price: parseCurrency(item.price),
            assignedTo: [...item.assignedTo]
        })
    );

    return {
        items: receiptItems,
        subtotal: subtotal,
        tax: tax,
        tip: tip,
        total: subtotal + tax + tip
    };
}