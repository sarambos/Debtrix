import {
  calculateSplit,
  CalculateSplitInput,
} from "../../calculateSplit/calculateSplit";

describe("calculateSplit", () => {
  it("splits shared items and distributes tax and tip proportionally", () => {
    const input: CalculateSplitInput = {
      items: [
        {
          id: "pizza",
          name: "Pizza",
          price: 20,
          assignedTo: ["Stephanie", "Alex"],
        },
        {
          id: "drink",
          name: "Drink",
          price: 5,
          assignedTo: ["Stephanie"],
        },
      ],
      tax: 2.5,
      tip: 5,
    };

    const result = calculateSplit(input);

    expect(result.subtotal).toBe(25);
    expect(result.tax).toBe(2.5);
    expect(result.tip).toBe(5);
    expect(result.total).toBe(32.5);
    expect(result.people).toHaveLength(2);
  });

  it("rejects an empty item list", () => {
    expect(() =>
      calculateSplit({
        items: [],
        tax: 0,
        tip: 0,
      })
    ).toThrow("At least one item is required.");
  });

  it("rejects an item without participants", () => {
    expect(() =>
      calculateSplit({
        items: [
          {
            id: "1",
            name: "Pizza",
            price: 20,
            assignedTo: [],
          },
        ],
        tax: 0,
        tip: 0,
      })
    ).toThrow("must be assigned to at least one person");
  });
});