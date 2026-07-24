import { Receipt, PersonBreakdown } from "../types/types";

export default function calculateBalances(receipt: Receipt): PersonBreakdown[] {
  const balances: Record<string, number> = {};
  const itemMap: Record<string, { name: string; amount: number }[]> = {};

  receipt.items.forEach((item) => {
    if (item.assignedTo.length === 0) return;

    const split = item.price / item.assignedTo.length;

    item.assignedTo.forEach((person) => {
      if (!balances[person]) balances[person] = 0;
      if (!itemMap[person]) itemMap[person] = [];
      balances[person] += split;

      itemMap[person].push({
        name: item.name,
        amount: split,
      });
    });
  });

  const subtotal = Object.values(balances).reduce((sum, amount) => sum + amount, 0);

  if (subtotal === 0) return [];

  return Object.entries(balances).map(([person, itemSubtotal]) => {
    const proportion = itemSubtotal / subtotal;
    const taxShare = receipt.tax * proportion;
    const tipShare = receipt.tip * proportion;

    return {
      person,
      total: Number((itemSubtotal + taxShare + tipShare).toFixed(2)),
      items: [
        ...itemMap[person],
        {
          name: "Tax",
          amount: Number(taxShare.toFixed(2))
        },
        {
          name: "Tip",
          amount: Number(tipShare.toFixed(2))
        }
      ]
    }
  });
};