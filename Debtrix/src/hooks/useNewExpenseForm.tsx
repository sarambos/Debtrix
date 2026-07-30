import { useMemo, useState } from "react";

import {
  ExpenseItemInput,
  NewExpenseFormState,
  PersonInput,
  TipOption,
} from "../types/newExpense";

import {
  calculateItemsSubtotal,
  calculateTipAmount,
  createId,
  getTaxRate,
} from "../lib/newExpense";

import type { ScannedReceipt } from "../types/types";

export function useNewExpenseForm() {
  const [numPeople, setNumPeople] = useState("");
  const [people, setPeople] = useState<PersonInput[]>([]);
  const [expenseName, setExpenseName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [items, setItems] = useState<ExpenseItemInput[]>([]);
  const [tipOption, setTipOption] = useState<TipOption>(18);
  const [customTipAmount, setCustomTipAmount] = useState("");

  const subtotal = useMemo(
    () => calculateItemsSubtotal(items),
    [items],
  );

  const taxRate = useMemo(
    () => getTaxRate(selectedState),
    [selectedState],
  );

  const estimatedTax = useMemo(
    () => subtotal * (taxRate / 100),
    [subtotal, taxRate],
  );

  const tipAmount = useMemo(
    () =>
      calculateTipAmount(
        subtotal,
        tipOption,
        customTipAmount,
      ),
    [subtotal, tipOption, customTipAmount],
  );

  const estimatedTotal =
    subtotal + estimatedTax + tipAmount;

  const handleNumPeopleChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    setNumPeople(digits);

    if (!digits) {
      setPeople([]);

      setItems((currentItems) =>
        currentItems.map((item) => ({
          ...item,
          assignedTo: [],
        })),
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
            name: "",
          }
        );
      }),
    );
  };

  const updatePersonName = (
    personId: string,
    name: string,
  ) => {
    setPeople((currentPeople) => {
      const previousPerson = currentPeople.find(
        (person) => person.id === personId,
      );

      const previousName = previousPerson?.name ?? "";

      const updatedPeople = currentPeople.map((person) =>
        person.id === personId
          ? {
              ...person,
              name,
            }
          : person,
      );

      if (previousName !== name) {
        setItems((currentItems) =>
          currentItems.map((item) => ({
            ...item,
            assignedTo: item.assignedTo.map(
              (assignedName) =>
                assignedName === previousName
                  ? name
                  : assignedName,
            ),
          })),
        );
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
        assignedTo: [],
      },
    ]);
  };

  const updateItem = (
    itemId: string,
    field: "name" | "price",
    value: string,
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const removeItem = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== itemId,
      ),
    );
  };

  const toggleAssignedPerson = (
    itemId: string,
    personName: string,
  ) => {
    if (!personName.trim()) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const isAssigned =
          item.assignedTo.includes(personName);

        return {
          ...item,
          assignedTo: isAssigned
            ? item.assignedTo.filter(
                (name) => name !== personName,
              )
            : [...item.assignedTo, personName],
        };
      }),
    );
  };

  const getFormState = (): NewExpenseFormState => ({
    numPeople,
    people,
    expenseName,
    totalAmount,
    selectedState,
    items,
    tipOption,
    customTipAmount,
  });

  const applyScannedReceipt = (
    scannedReceipt: ScannedReceipt,
  ) => {
    if (scannedReceipt.vendorName) {
      setExpenseName(scannedReceipt.vendorName);
    }

    if (scannedReceipt.total !== undefined) {
      setTotalAmount(
        scannedReceipt.total.toFixed(2),
      );
    }

    setItems(
      scannedReceipt.items.map((item) => ({
        id: createId(),
        name: item.name,
        price: item.price.toFixed(2),
        assignedTo: [],
      })),
    );

    const detectedTip =
      scannedReceipt.tip ??
      scannedReceipt.serviceCharge;

    if (detectedTip !== undefined) {
      setTipOption("custom");
      setCustomTipAmount(
        detectedTip.toFixed(2),
      );
    }
  };

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
    setTotalAmount,
    setSelectedState,
    setTipOption,
    setCustomTipAmount,

    handleNumPeopleChange,
    updatePersonName,
    addItem,
    updateItem,
    removeItem,
    toggleAssignedPerson,
    getFormState,
    applyScannedReceipt,
  };
}