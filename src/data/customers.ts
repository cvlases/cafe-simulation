

import type { Customer } from "../types";

export const customers: Customer[] = [
  // customers go here
  {
  id: 1,
  name: "Scott",
  order: {
    drink: "coffee",
    extras: []
  },
  patience: 100
},
{
  id: 2,
  name: "Nicole",
  order: {
    drink: "hot-chocolate",
    extras: ["whipped-cream", "marshmallows"]
  },
  patience: 90
},
{
  id: 3,
  name: "Trey",
  order: {
    drink: "mocha",
    extras: []
  },
  patience: 80
},
{
  id: 4,
  name: "Tomi",
  order: {
    drink: "coffee",
    extras: ["marshmallows"]
  },
  patience: 80
}



];