import './App.css'
import { useState } from "react";
import Customer from "./components/Customer";
import Station from "./components/Station";
import { customers } from "./data/customers";
import type { DrinkInProgress, DrinkType, ExtraType, Order } from "./types";

function App() {
    // Create state for the drink being made
  const [currentDrink, setCurrentDrink] = useState<DrinkInProgress>({
    base: [],
    extras: []
  });

   // ===============================================
   // customer progression
   // ===============================================
  // state to track what customer we are on
  const [currentCustomerIndex, setCurrentCustomerIndex] = useState<number>(0);
  


  // ===============================================
  // is the drink made correctly?
  // ===============================================
  const checkOrder = (drink: DrinkInProgress, order: Order): boolean => {
  // Check the base drink
  const orderedDrink = order.drink;
  // Determine what drink was made
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
  // Check if base matches
  if (madeDrink !== orderedDrink) {
    return false;
  }
  // Check if extras match (same items, regardless of order)
    const orderedExtras = [...order.extras].sort();
    const madeExtras = [...drink.extras].sort();
    if (orderedExtras.length !== madeExtras.length) {
      return false;
    } 
    for (let i = 0; i < orderedExtras.length; i++) {
      if (orderedExtras[i] !== madeExtras[i]) {
        return false;
      }
    }
    return true;
  };

    // ===============================================
    // clear the cup
    // ===============================================
  const handleClear = () => {
    setCurrentDrink({
      base: [],
      extras: []
    });
  };

  // ===============================================
  // Function to add a base drink
  // ===============================================
  const handleAddBase = (base: DrinkType) => {
    // Update currentDrink with the new base

    // Can't add base if extras already added
    if (currentDrink.extras.length > 0) {
      return;
    }

    // Don't add if already there
    if (currentDrink.base.includes(base)) {
      return;
    }
    
    // Don't allow more than 2 bases
    if (currentDrink.base.length >= 2) {
      return;
    }

    setCurrentDrink({ ...currentDrink, base: [...currentDrink.base, base] });
  };

  // ===============================================
  // Function to add an extra (topping)
  // ===============================================
  const handleAddExtra = (extra: ExtraType) => {
    // Add the extra to the extras array
    // Can't add extras if no base selected
    if (currentDrink.base.length === 0) {
      return;
    }
    // Only add if not already in the array
    if (!currentDrink.extras.includes(extra)) {
      setCurrentDrink({ ...currentDrink, extras: [...currentDrink.extras, extra] });
      }
  };





  
   // ===============================================
   // serve the drink 
   // ===============================================
  // show player if their order worked. 
  const [message, setMessage] = useState<string>("");

  const handleServe = () => {
    console.log("Served:", currentDrink);
    const currentCustomer = customers[currentCustomerIndex];
    // Check if it matches the order
    const isCorrect = checkOrder(currentDrink, currentCustomer.order);
  
    if (isCorrect) {
      console.log("Correct! Great job!");
      setMessage("Correct! Great job!");
    } else {
      console.log("Wrong order!");
      setMessage("Wrong order!");
    }
    handleClear(); // Reset for next drink

    // Move to next customer
    if (currentCustomerIndex < customers.length - 1) {
      setCurrentCustomerIndex(currentCustomerIndex + 1);
    } else {
      setMessage("Day complete! You served all customers!");
    }

  };



  

  return (
    <div>
      <h1>Café Simulator</h1>
      <Customer customer={customers[currentCustomerIndex]} />
      <Station 
        currentDrink={currentDrink}
        onAddBase={handleAddBase}
        onAddExtra={handleAddExtra}
        onServe={handleServe}
        onClear={handleClear}
      />
       {message && <p>{message}</p>}
    </div>
  );


}

export default App;