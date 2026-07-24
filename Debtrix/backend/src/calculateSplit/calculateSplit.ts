export type ReceiptItem = {
    id: string;
    name: string;
    price: number;
    assignedTo: string[];
};

export type CalculateSplitInput = {
    items: ReceiptItem[];
    tax: number;
    tip: number;
};

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

function roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateSplit(input: CalculateSplitInput): CalculateSplitResult {
    if (!Array.isArray(input.items) || input.items.length === 0) {
        throw new Error("At least one item in required.");
    }

    if (!Number.isFinite(input.tax) || input.tax < 0) {
        throw new Error("Tax must be a non-negative number.");
    }

    if (!Number.isFinite(input.tip) || input.tip < 0) {
        throw new Error("Tip must be a non-negative number.");
    }

    const itemSubtotals: Record<string, number> = {};
    const personItems: Record<string, PersonBreakdown["items"]> = {};

    for (const item of input.items) {
        if (!item.name.trim()) {
            throw new Error("Every item must have a name.");
        }

        if (!Number.isFinite(item.price) || item.price <= 0) {
            throw new Error(`Item "${item.name}" must have a positive price.`);
        }

        if (!Array.isArray(item.assignedTo) || item.assignedTo.length === 0) {
            throw new Error(`Item "${item.name}" must be assigned to at least one person.`);
        }

        const uniquePeople = [...new Set(item.assignedTo)];
        const splitAmount = item.price / uniquePeople.length;

        for (const person of uniquePeople) {
            const normPerson = person.trim();

            if (!normPerson) {
                throw new Error(`Item "${item.name}" has an invalid participant.`);
            }

            itemSubtotals[normPerson] = (itemSubtotals[normPerson] ?? 0) + splitAmount;

            personItems[normPerson] ??= [];
            personItems[normPerson].push({
                id: item.id,
                name: item.name,
                amount: roundMoney(splitAmount)
            });
        }
    }

    const subtotal = Object.values(itemSubtotals).reduce((sum, amount) => sum + amount, 0);

    if (subtotal <= 0) {
        throw new Error("Receipt subtotal must be greater than zero.");
    }

    const people = Object.entries(itemSubtotals).map(
        ([person, itemSubtotal]) => {
            const proportion = itemSubtotal / subtotal;
            const taxShare = input.tax * proportion;
            const tipShare = input.tip * proportion;

            return {
                person,
                itemSubtotal: roundMoney(itemSubtotal),
                taxShare: roundMoney(taxShare),
                tipShare: roundMoney(tipShare),
                total: roundMoney(itemSubtotal + taxShare + tipShare),
                items: personItems[person]
            };
        }
    );

    return {
        subtotal: roundMoney(subtotal),
        tax: roundMoney(input.tax),
        tip: roundMoney(input.tip),
        total: roundMoney(subtotal + input.tax + input.tip),
        people
    };
}