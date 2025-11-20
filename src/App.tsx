import './App.css'
import { useState } from "react";
import Customer from "./components/Customer";
import Station from "./components/Station";
import { customers } from "./data/customers";
import type { DrinkInProgress, DrinkType, ExtraType, Order } from "./types";

import HotChocolateMaker from "./components/HotChocolateMaker";



function App() {
    // Create state for the drink being made
  const [currentDrink, setCurrentDrink] = useState<DrinkInProgress>({
    base: [],
    extras: []
  });
  
    // create a state for the two scenes (ordering and making)
    type Scene = "order" | "making";
    const [currentScene, setCurrentScene] = useState<Scene>("order");


    // add a state to track if the player is actively making a hot chocolate
    const [isMaking, setIsMaking] = useState(false);
    const [makingDrinkType, setMakingDrinkType] = useState<DrinkType | null>(null);


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
      
      
      {currentScene === "order" && (
        <div className="order-scene">
          <Customer customer={customers[currentCustomerIndex]} />
          <button onClick={() => setCurrentScene("making")}>Start Making →</button>
        </div>
      )}
      
      {currentScene === "making" && (
  <div className="making-scene">
    <button onClick={() => setCurrentScene("order")}>← Back to Order</button>
    
    {!isMaking ? (
      // Show drink selection
      <div>
        <h2>What are you making?</h2>
        <button onClick={() => {
          setIsMaking(true);
          setMakingDrinkType("hot-chocolate");
        }}>
          Make Hot Chocolate
        </button>
        {/* You'll add Coffee and Mocha buttons later */}
      </div>
    ) : (
      // Show the appropriate maker based on makingDrinkType
      <>
        {makingDrinkType === "hot-chocolate" && (
          <HotChocolateMaker 
            onComplete={(toppings) => {
              // When done making, add to currentDrink
              setCurrentDrink({
                base: ["hot-chocolate"],
                extras: toppings
              });
              setIsMaking(false);
              setMakingDrinkType(null);
            }}
            onCancel={() => {
              setIsMaking(false);
              setMakingDrinkType(null);
            }}
          />
        )}
      </>
    )}
    
    {/* Only show serve/clear if a drink is made */}
    {!isMaking && currentDrink.base.length > 0 && (
      <div>
        <p>Current drink: {currentDrink.base.join(" + ")}</p>
        <button onClick={handleServe}>Serve</button>
        <button onClick={handleClear}>Clear</button>
      </div>
    )}
  </div>
)}
    </div>
  );


}

export default App;