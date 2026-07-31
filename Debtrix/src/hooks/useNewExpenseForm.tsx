import { useMemo, useState } from 'react';
import { ExpenseItemInput, NewExpenseFormState, PersonInput, TipOption } from '../types/newExpense';
import { calculateItemsSubtotal, calculateTipAmount, createId, getTaxRate, sanitizeCurrencyInput } from '../lib/newExpense';

export function useNewExpenseForm() {
    const [numPeople, setNumPeople] = useState("");
    const [people, setPeople] = useState<PersonInput[]>([]);
    const [expenseName, setExpenseName] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [items, setItems] = useState<ExpenseItemInput[]>([]);
    const [tipOption, setTipOption] = useState<TipOption>(18);
    const [customTipAmount, setCustomTipAmount] = useState("");

    const subtotal = useMemo(() => calculateItemsSubtotal(items), [items]);
    const taxRate = useMemo(() => getTaxRate(selectedState), [selectedState]);
    const estimatedTax = useMemo(() => subtotal * (taxRate / 100), [subtotal, taxRate]);
    const tipAmount = useMemo(() => calculateTipAmount(subtotal, tipOption, customTipAmount), [subtotal, tipOption, customTipAmount]);

    const estimatedTotal = subtotal + estimatedTax + tipAmount;

    const handleTotalAmountChange = (value: string) => {
        setTotalAmount(sanitizeCurrencyInput(value));
    };

    const handleCustomTipAmountChange = (value: string) => {
        setCustomTipAmount(sanitizeCurrencyInput(value));
    };

    const handleNumPeopleChange = (value: string) => {
        const digits = value.replace(/\D/g, "");
        setNumPeople(digits);

        if (!digits) {
            setPeople([]);
            setItems((currentItems) =>
                currentItems.map((item) => ({
                    ...item,
                    assignedTo: []
                }))
            );
            return;
        }

        const count = Number.parseInt(digits, 10);

        if (count < 1 || count > 20) {
            return;
        }

        setPeople((currentPeople) => 
            Array.from({ length: count }, (_, index) => {
                return (
                    currentPeople[index] ?? {
                        id: createId(),
                        name: ""
                    }
                );
            })
        );
    };

    const updatePersonName = (personId: string, name: string) => {
        setPeople((currentPeople) => {
            const prevPerson = currentPeople.find((person) => person.id === personId);
            const prevName = prevPerson?.name ?? "";

            const updatedPeople = currentPeople.map((person) => person.id === personId ? { ...person, name } : person);

            if (prevName !== name) {
                setItems((currentItems) => currentItems.map((item) => ({
                    ...item,
                    assignedTo: item.assignedTo.map((assignedName) => assignedName === prevName ? name : assignedName)
                })));
            }

            return updatedPeople;
        });
    };

    const addItem = () => {
        setItems((currentItems) => [
            ...currentItems,
            {
                id: createId(),
                name: "",
                price: "",
                assignedTo: []
            }
        ]);
    };

    const updateItem = (itemId: string, field: "name" | "price", value: string) => {
        const nextValue = field === "price"
            ? sanitizeCurrencyInput(value)
            : value;
        
        setItems((currentItems) => 
            currentItems.map((item) =>
             item.id === itemId ? { ...item, [field]: nextValue } : item
            )
        );
    };

    const removeItem = (itemId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
    };

    const toggleAssignedPerson = (itemId: string, personName: string) => {
        if (!personName.trim()) {
            return;
        }

        setItems((currentItems) => currentItems.map((item) => {
            if (item.id !== itemId) {
                return item;
            }

            const isAssigned = item.assignedTo.includes(personName);

            return {
                ...item,
                assignedTo: isAssigned
                    ? item.assignedTo.filter(
                        (name) => name !== personName
                    )
                    : [...item.assignedTo, personName]
            };
        })
    )};

    const getFormState = (): NewExpenseFormState => ({
        numPeople,
        people,
        expenseName,
        totalAmount,
        selectedState,
        items,
        tipOption,
        customTipAmount
    });

    return {
        numPeople,
        people,
        expenseName,
        totalAmount,
        selectedState,
        items,
        subtotal,
        taxRate,
        estimatedTax,
        tipOption,
        customTipAmount,
        tipAmount,
        estimatedTotal,

        setExpenseName,
        setTotalAmount: handleTotalAmountChange,
        setSelectedState,
        handleNumPeopleChange,
        updatePersonName,
        addItem,
        updateItem,
        removeItem,
        toggleAssignedPerson,
        setTipOption,
        setCustomTipAmount: handleCustomTipAmountChange,
        getFormState
    }
}