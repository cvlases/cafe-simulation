


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

// calculate the drink scoring system
export interface DrinkScore {
  coffeeLevel?: number;      // 0-100 score based on fill level
  hotChocolateTemp?: number; // 0-100 score based on temp
  milkLevel?: number;        // 0-100 score based on milk level
  stirringDuration?: number; // 0-100 score based on stir time
  mochaRatio?: number;       // 0-100 score based on 50/50 ratio
  overflow?: boolean;        // true = major penalty
  whippedCreamFirst?: boolean; // false if added after others
  whippedCreamDuration?: number; // 0-100 based on hold time
  toppingsCorrect?: number;  // 0-100 based on matching order
  totalScore?: number;       // Final percentage
}

// use 'export' on these types so that other files can access them

export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SceneConfig {
  background: string;
  elements: {
    [key: string]: ElementPosition;
  };
}