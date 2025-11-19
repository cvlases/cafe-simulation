


// drinks and extras (union-types)
export type DrinkType = "coffee" | "hot-chocolate" | "mocha";
export type ExtraType = "whipped-cream" | "sprinkles" | "marshmallows";

export interface DrinkInProgress {
  base: DrinkType[];  // array of bases added (for mocha creation)
  extras: ExtraType[];
}

// what the customer orders
export interface Order {
  drink: DrinkType; // have to pick a drink
  extras: ExtraType[];  // array because they might want multiple (or none)
}

// A customer in the cafe
export interface Customer {
  id: number;           // unique identifier
  name: string;
  order: Order;         // uses the Order interface (customer --> orders)
  patience: number;     // a number like 100 that counts down
}

// use 'export' on these types so that other files can access them