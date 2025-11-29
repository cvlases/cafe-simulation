

import type { Customer } from "../../types";

export const customers: Customer[] = [
  // customers go here
  {
  id: 1,
  name: "Alex",
  order: {
    drink: "coffee",
    extras: []
  },
  patience: 100
},
{
  id: 2,
  name: "Scott",
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
    drink: "mocha",
    extras: []
  },
  patience: 80
},
{
  id: 4,
  name: "Claire",
  order: {
    drink: "coffee",
    extras: ["marshmallows"]
  },
  patience: 80
},
{
  id: 5,
  name: "Scoobers",
  order: {
    drink: "hot-chocolate",
    extras: ["whipped-cream", "marshmallows"]
  },
  patience: 90
}


];