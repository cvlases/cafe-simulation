export interface Transaction {
  customerId: number;
  score: number;
  amount: number;
  tip: number;
  refunded: boolean;
}

export const calculateEarnings = (score: number): { amount: number; tip: number; refunded: boolean } => {
  const basePrice = 5.00;
  
  if (score < 50) {
    // Refund - customer gets money back
    return {
      amount: 0,
      tip: 0,
      refunded: true
    };
  }
  
  // Calculate tip based on score
  // 50% = no tip, 100% = full $5 tip
  const tipPercentage = (score - 50) / 50; // 0 to 1
  const tip = basePrice * tipPercentage;
  
  return {
    amount: basePrice,
    tip: parseFloat(tip.toFixed(2)),
    refunded: false
  };
};

export const formatMoney = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};