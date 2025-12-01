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

  // 1. DRINK TYPE CORRECTNESS (40 points)
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
    // Wrong drink type = automatic fail
    return 0;
  }

  // 2. TOPPINGS CORRECTNESS (20 points)
  const orderedExtras = [...order.extras].sort();
  const madeExtras = [...drink.extras].sort();
  
  if (orderedExtras.length === madeExtras.length) {
    let correctToppings = 0;
    for (let i = 0; i < orderedExtras.length; i++) {
      if (orderedExtras[i] === madeExtras[i]) {
        correctToppings++;
      }
    }
    // Proportional score based on correct toppings
    score += Math.round((correctToppings / Math.max(orderedExtras.length, 1)) * 20);
  } else {
    // Wrong number of toppings = partial credit
    const correctCount = madeExtras.filter(e => orderedExtras.includes(e)).length;
    score += Math.round((correctCount / Math.max(orderedExtras.length, 1)) * 10);
  }

  // 3. OVERFLOW CHECK (automatic deduction)
  if (metrics.overflowed) {
    score -= 30;
  }

  // 4. DRINK QUALITY METRICS (40 points total)
  
  // Coffee Level (10 points) - for coffee and mocha
  if (drink.base.includes('coffee') && metrics.coffeeLevel !== undefined) {
    if (metrics.coffeeLevel >= 90 && metrics.coffeeLevel <= 100) {
      score += 10; // Perfect
    } else if (metrics.coffeeLevel >= 70) {
      score += 7; // Good
    } else if (metrics.coffeeLevel >= 50) {
      score += 4; // Okay
    }
  }

  // Hot Chocolate Temperature (10 points) - for hot chocolate and mocha
  if (drink.base.includes('hot-chocolate') && metrics.hotChocolateTemp !== undefined) {
    const temp = metrics.hotChocolateTemp;
    if (temp >= 160 && temp <= 180) {
      score += 10; // Perfect temperature
    } else if (temp >= 140 && temp < 200) {
      score += 7; // Good
    } else if (temp >= 120 && temp < 200) {
      score += 4; // Okay
    } else if (temp >= 200) {
      score -= 10; // Too hot! Dangerous
    }
  }

  // Milk Level (10 points) - for hot chocolate and mocha
  if (drink.base.includes('hot-chocolate') && metrics.milkLevel !== undefined) {
    if (metrics.milkLevel >= 80 && metrics.milkLevel <= 100) {
      score += 10; // Perfect
    } else if (metrics.milkLevel >= 60) {
      score += 7; // Good
    } else if (metrics.milkLevel >= 40) {
      score += 4; // Okay
    }
  }

  // Stirring Duration (10 points) - for hot chocolate and mocha
  if (drink.base.includes('hot-chocolate') && metrics.stirringDuration !== undefined) {
    if (metrics.stirringDuration >= 3) {
      score += 10; // Perfect - stirred for full 3 seconds
    } else if (metrics.stirringDuration >= 2) {
      score += 7; // Good
    } else if (metrics.stirringDuration >= 1) {
      score += 4; // Okay
    }
  }

  // 5. TOPPING QUALITY (bonus points if toppings ordered)
  if (order.extras.length > 0 && drink.extras.length > 0) {
    // Whipped Cream First (5 bonus points)
    if (order.extras.includes('whipped-cream') && metrics.whippedCreamFirst) {
      score += 5;
    }

    // Whipped Cream Duration (5 bonus points) - held for 2 seconds
    if (order.extras.includes('whipped-cream') && metrics.whippedCreamDuration !== undefined) {
      if (metrics.whippedCreamDuration >= 2000) {
        score += 5; // Perfect - held for 2 seconds
      } else if (metrics.whippedCreamDuration >= 1500) {
        score += 3; // Good
      } else if (metrics.whippedCreamDuration >= 1000) {
        score += 1; // Okay
      }
    }
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};