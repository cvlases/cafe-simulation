

import type { Customer } from "../types";

export const customers: Customer[] = [
  // customers go here
  {
  id: 1,
  name: "Alex",
  order: {
    drink: "mocha",
    extras: ["whipped-cream"]
  },
  patience: 100
},
{
  id: 2,
  name: "Scoobers",
  order: {
    drink: "hot-chocolate",
    extras: ["whipped-cream", "marshmallows"]
  },
  patience: 90
},
{
  id: 3,
  name: "Toot Toot",
  order: {
    drink: "coffee",
    extras: []
  },
  patience: 80
}

];