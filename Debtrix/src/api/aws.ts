type ReceiptItem = {
  price: number;
  assignedTo: string[];
};

type Receipt = {
  items: ReceiptItem[];
  tax?: number;
  tip?: number;
};

export const handler = async (event: any) => {
  const receipt: Receipt = JSON.parse(event.body);

  const balances: Record<string, number> = {};

  // 1. Item splitting
  receipt.items.forEach((item) => {
    const split = item.price / item.assignedTo.length;

    item.assignedTo.forEach((person) => {
      if (!balances[person]) balances[person] = 0;
      balances[person] += split;
    });
  });

  // 2. Tax + tip proportional distribution
  const subtotal = Object.values(balances).reduce((a, b) => a + b, 0);
  const totalExtra = (receipt.tax || 0) + (receipt.tip || 0);

  Object.keys(balances).forEach((person) => {
    const proportion = balances[person] / subtotal;
    balances[person] += totalExtra * proportion;
  });

  // 3. Format response
  const result = Object.entries(balances).map(([person, amount]) => ({
    person,
    amount: parseFloat(amount.toFixed(2)),
  }));

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  };
};