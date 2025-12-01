import type { DrinkInProgress, Order } from "../types";

export const calculateScore = (
  drink: DrinkInProgress,
  order: Order,
  metrics: {
    coffeeLevel?: number;
    milkLevel?: number;
    hotChocolateTemp?: number;
    stirringDuration?: number;
    overflowed?: boolean;
    whippedCreamFirst?: boolean;
    whippedCreamDuration?: number;
  }
): number => {
  let score = 0;

  // 1. CORRECT DRINK TYPE (40 points)
  const orderedDrink = order.drink;
  let madeDrink: 'coffee' | 'hot-chocolate' | 'mocha' | null = null;
  
  if (drink.base.length === 1) {
    madeDrink = drink.base[0];
  } else if (
    drink.base.length === 2 && 
    drink.base.includes("coffee") && 
    drink.base.includes("hot-chocolate")
  ) {
    madeDrink = "mocha";
  }
  
  if (madeDrink === orderedDrink) {
    score += 40;
  } else {
    // Wrong drink = fail
    return 0;
  }

  // 2. FILLED CORRECTLY (30 points)
  if (metrics.overflowed) {
    // Overflow = 0 points for filling
    score += 0;
  } else {
    // Give points based on drink type
    if (drink.base.includes('coffee') && metrics.coffeeLevel !== undefined) {
      // Coffee: just needs to be brewed (any level > 0 is good)
      score += 30;
    } else if (drink.base.includes('hot-chocolate')) {
      // Hot chocolate/mocha: needs milk filled
      if (metrics.milkLevel !== undefined && metrics.milkLevel >= 50) {
        score += 30; // Good fill level
      } else if (metrics.milkLevel !== undefined && metrics.milkLevel >= 30) {
        score += 20; // Okay
      } else {
        score += 10; // Not enough
      }
    } else {
      // Default: no overflow = good
      score += 30;
    }
  }

  // 3. CORRECT TOPPINGS (30 points)
  const orderedExtras = [...order.extras].sort();
  const madeExtras = [...drink.extras].sort();
  
  // Check if toppings match exactly
  if (orderedExtras.length === madeExtras.length) {
    let allMatch = true;
    for (let i = 0; i < orderedExtras.length; i++) {
      if (orderedExtras[i] !== madeExtras[i]) {
        allMatch = false;
        break;
      }
    }
    
    if (allMatch) {
      score += 30; // Perfect toppings!
    } else {
      // Some are correct
      const correctCount = madeExtras.filter(e => orderedExtras.includes(e)).length;
      score += Math.round((correctCount / orderedExtras.length) * 30);
    }
  } else if (orderedExtras.length === 0 && madeExtras.length === 0) {
    // No toppings ordered, none added = perfect
    score += 30;
  } else {
    // Wrong number of toppings
    const correctCount = madeExtras.filter(e => orderedExtras.includes(e)).length;
    const maxCount = Math.max(orderedExtras.length, madeExtras.length);
    score += Math.round((correctCount / maxCount) * 15);
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};