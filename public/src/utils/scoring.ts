import type { DrinkInProgress, Order, DrinkType } from "../types";

interface DrinkMetrics {
  coffeeLevel?: number;
  hotChocolateTemp?: number;
  milkLevel?: number;
  stirringDuration?: number;
  overflowed?: boolean;
  whippedCreamFirst?: boolean;
  whippedCreamDuration?: number;
}

export const calculateScore = (
  drink: DrinkInProgress,
  order: Order,
  metrics: DrinkMetrics
): number => {
  let totalScore = 0;
  let maxScore = 0;

  // Check if base drink is correct (this is pass/fail)
  const orderedDrink = order.drink;
  let madeDrink: DrinkType | null = null;
  
  if (drink.base.length === 1) {
    madeDrink = drink.base[0];
  } else if (
    drink.base.length === 2 && 
    drink.base.includes("coffee") && 
    drink.base.includes("hot-chocolate")
  ) {
    madeDrink = "mocha";
  }
  
  // Wrong drink = 0 score
  if (madeDrink !== orderedDrink) {
    return 0;
  }

  // Coffee scoring
  if (drink.base.includes("coffee") && metrics.coffeeLevel !== undefined) {
    maxScore += 30;
    const level = metrics.coffeeLevel;
    if (level >= 90 && level <= 100) {
      totalScore += 30; // Perfect
    } else if (level >= 80 && level < 90) {
      totalScore += 25; // Good
    } else if (level >= 70 && level < 80) {
      totalScore += 20; // Okay
    } else {
      totalScore += 10; // Poor
    }
  }

  // Hot Chocolate scoring
  if (drink.base.includes("hot-chocolate")) {
    // Temperature score (30 points)
    if (metrics.hotChocolateTemp !== undefined) {
      maxScore += 30;
      const temp = metrics.hotChocolateTemp;
      if (temp >= 160 && temp <= 180) {
        totalScore += 30; // Perfect - hot but not burning
      } else if (temp >= 140 && temp < 160) {
        totalScore += 20; // Warm
      } else if (temp > 180) {
        totalScore += 15; // Too hot
      } else {
        totalScore += 5; // Too cold
      }
    }

    // Milk level score (20 points)
    if (metrics.milkLevel !== undefined) {
      maxScore += 20;
      const level = metrics.milkLevel;
      if (level >= 90 && level <= 100) {
        totalScore += 20; // Perfect
      } else if (level >= 80 && level < 90) {
        totalScore += 15; // Good
      } else if (level >= 70 && level < 80) {
        totalScore += 10; // Okay
      } else {
        totalScore += 5; // Poor
      }
    }

    // Stirring duration score (20 points)
    if (metrics.stirringDuration !== undefined) {
      maxScore += 20;
      const duration = metrics.stirringDuration;
      if (duration >= 5 && duration <= 8) {
        totalScore += 20; // Perfect
      } else if (duration >= 3 && duration < 5) {
        totalScore += 15; // Good
      } else if (duration > 8) {
        totalScore += 10; // Over-stirred
      } else {
        totalScore += 5; // Under-stirred
      }
    }
  }

  // Mocha ratio scoring (if both bases present)
  if (drink.base.length === 2) {
    maxScore += 20;
    totalScore += 20;
  }

  // Overflow penalty
  if (metrics.overflowed) {
    totalScore -= 20; // Major penalty
  }

  // Toppings scoring (30 points)
  const orderedExtras = [...order.extras].sort();
  const madeExtras = [...drink.extras].sort();
  
  maxScore += 30;
  
  // Check if toppings match
  let toppingsMatch = true;
  if (orderedExtras.length === madeExtras.length) {
    for (let i = 0; i < orderedExtras.length; i++) {
      if (orderedExtras[i] !== madeExtras[i]) {
        toppingsMatch = false;
        break;
      }
    }
  } else {
    toppingsMatch = false;
  }

  if (toppingsMatch) {
    totalScore += 20; // Correct toppings
    
    // Whipped cream bonus/penalty
    if (order.extras.includes("whipped-cream")) {
      // Check if added first
      if (metrics.whippedCreamFirst === false) {
        totalScore -= 5; // Penalty for wrong order
      }
      
      // Check hold duration (should be ~5000ms)
      if (metrics.whippedCreamDuration !== undefined) {
        if (metrics.whippedCreamDuration >= 4500 && metrics.whippedCreamDuration <= 5500) {
          totalScore += 10; // Perfect hold
        } else if (metrics.whippedCreamDuration >= 3500) {
          totalScore += 5; // Good enough
        }
      }
    } else {
      totalScore += 10; // No whipped cream needed, full points
    }
  } else {
    totalScore += 5; // Wrong toppings, small consolation
  }

  // Calculate percentage
  const percentage = Math.max(0, Math.min(100, (totalScore / maxScore) * 100));
  return Math.round(percentage);
};