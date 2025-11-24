import './App.css'
import { useState } from "react";

import Customer from "./components/Customer";
import Station from "./components/Station";
import { customers } from "./data/customers";
import { calculateScore } from "./utils/scoring";
import type { DrinkInProgress, DrinkType, ExtraType, Order } from "./types";

import HotChocolateMaker from "./components/HotChocolateMaker";
import CoffeeMaker from "./components/CoffeeMaker";
import MochaMaker from "./components/MochaMaker";

import ToppingStation from "./components/ToppingStation";
import Scorecard from './components/Scorecard';

import { calculateEarnings, formatMoney } from "./utils/money";
import type { Transaction } from "./utils/money"

// ------

import sceneConfig from './data/sceneConfig.json';
import type { SceneConfig } from './types';

// ------

import { useAssets } from './hooks/useAssets';
import GameImage from './components/GameImage';
import GameButton from './components/GameButton';

function App() {
  const { assets, layouts, } = useAssets();
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


    //  keep track of beans across multiple drinks
    const [coffeesUsed, setCoffeesUsed] = useState(0);
    const beansNeedRefill = coffeesUsed >= 3; // Need refill every 3 coffees


    // keep track of both bases for mocha
    const [hasCoffeeBase, setHasCoffeeBase] = useState(false);
    const [hasHotChocolateBase, setHasHotChocolateBase] = useState(false);
    

    // topping station 
    const [showToppingStation, setShowToppingStation] = useState(false);
    const [currentToppings, setCurrentToppings] = useState<ExtraType[]>([]);

    // track the metrics
    const [drinkMetrics, setDrinkMetrics] = useState<{
      coffeeLevel?: number;
      hotChocolateTemp?: number;
      milkLevel?: number;
      stirringDuration?: number;
      overflowed?: boolean;
      whippedCreamFirst?: boolean;
      whippedCreamDuration?: number;
    }>({});

    // customer scores you
    const [showScorecard, setShowScorecard] = useState(false);
    const [lastScore, setLastScore] = useState(0);

    // get yer money
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [lastEarnings, setLastEarnings] = useState<{
      amount: number;
      tip: number;
      refunded: boolean;
    }>({ amount: 0, tip: 0, refunded: false });

    // configs
    const orderConfig = sceneConfig.orderScene as SceneConfig;
    const makingConfig = sceneConfig.makingScene as SceneConfig;
    
   // ===============================================
   // customer progression
   // ===============================================
  // state to track what customer we are on
  const [currentCustomerIndex, setCurrentCustomerIndex] = useState<number>(0);
  
  // image helper function:
    const getCustomerImage = (customerId: number): string => {
      const key = `customer${customerId}` as keyof typeof assets.customers;
      return assets.customers[key] || '';
    };

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
    setHasCoffeeBase(false);
    setHasHotChocolateBase(false);
    setCurrentToppings([]); 
    setShowToppingStation(false); 
    setDrinkMetrics({});
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
    console.log("Metrics:", drinkMetrics);
    
    const currentCustomer = customers[currentCustomerIndex];
    // // Check if it matches the order
    // const isCorrect = checkOrder(currentDrink, currentCustomer.order);
  
    // if (isCorrect) {
    //   console.log("Correct! Great job!");
    //   setMessage("Correct! Great job!");
    // } else {
    //   console.log("Wrong order!");
    //   setMessage("Wrong order!");
    // }

    const score = calculateScore(currentDrink, currentCustomer.order, drinkMetrics);
      
      console.log("Score:", score);
      
      

        // Calculate earnings
    const earnings = calculateEarnings(score);
    const totalFromOrder = earnings.amount + earnings.tip;
    
    // Update total earnings
    setTotalEarnings(totalEarnings + totalFromOrder);
    
    // Record transaction
    const transaction: Transaction = {
      customerId: currentCustomer.id,
      score,
      amount: earnings.amount,
      tip: earnings.tip,
      refunded: earnings.refunded
    };
    setTransactions([...transactions, transaction]);
  
    // Save earnings for scorecard
    setLastEarnings(earnings);
    setLastScore(score);
    setShowScorecard(true);

    // Set message based on score and earnings
    setLastScore(score);
    setShowScorecard(true);

  };

  const handleContinueAfterScore = () => {
    setShowScorecard(false);
    handleClear();
    
    // Move to next customer
    if (currentCustomerIndex < customers.length - 1) {
      setCurrentCustomerIndex(currentCustomerIndex + 1);
    } else {
      setMessage("Day complete! You served all customers!");
    }
  };

  // if (!isLoaded) {
  //   return (
  //     <div style={{ 
  //       display: 'flex', 
  //       flexDirection: 'column',
  //       alignItems: 'center', 
  //       justifyContent: 'center', 
  //       height: '100vh',
  //       backgroundColor: '#f0f0f0'
  //     }}>
  //       <h1>☕ Loading Café Simulator...</h1>
  //       <p>Getting everything ready...</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <h1>Café Simulator</h1>
      
      
      
      {currentScene === "order" && (
        <div 
          // className="order-scene"
          // style={{
          //   backgroundImage: `url(${orderBackground})`,
          //   backgroundSize: '100% 100%', // Stretch to fit container
          //   backgroundPosition: 'center',
          //   backgroundRepeat: 'no-repeat',
          //   height: '1000px', // Fixed height
          //   width: '1000px', // Fixed width (adjust to match your image ratio)
          //   margin: '0 auto', // Center the game
          //   position: 'relative'
          // }}
          className="order-scene"
                  style={{
                    backgroundImage: `url(${assets.backgrounds.orderScene})`,
                    height: `${layouts.orderScene.container.height}px`,
                    width: `${layouts.orderScene.container.width}px`,
                    margin: '0 auto',
                    position: 'relative',
                    backgroundSize: '100% 100%'
                  }}
        >


<div className="earnings-display">
      <h3>Total Earnings: {formatMoney(totalEarnings)}</h3>
    </div>

      {showScorecard && (
        <Scorecard 
          score={lastScore}
          customerName={customers[currentCustomerIndex].name}
          earnings={lastEarnings}
          onContinue={handleContinueAfterScore}
        />
      )}

        <div style={{
      position: 'absolute',
      left: `${orderConfig.elements.customer.x}px`,
      top: `${orderConfig.elements.customer.y}px`,
      width: `${orderConfig.elements.customer.width}px`,
      height: `${orderConfig.elements.customer.height}px`
    }}>
      
      <Customer 
        customer={customers[currentCustomerIndex]} 
        imageUrl={getCustomerImage(customers[currentCustomerIndex].id)}
      />
    </div>
    
    <button 
      onClick={() => setCurrentScene("making")}
      style={{
        position: 'absolute',
        left: `${orderConfig.elements.startButton.x}px`,
        top: `${orderConfig.elements.startButton.y}px`,
        width: `${orderConfig.elements.startButton.width}px`,
        height: `${orderConfig.elements.startButton.height}px`
      }}
    >

      Start Making →
    </button>
  </div>
)}
      
      {currentScene === "making" && (
        <div 
          className="making-scene"
          style={{

            backgroundImage: `url(${assets.backgrounds.makingScene})`,
            
            // Use layout dimensions:
            height: `${layouts.makingScene.container.height}px`,
            width: `${layouts.makingScene.container.width}px`,
            
            // Keep your existing styles:
            margin: '0 auto',
            position: 'relative',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >

          {/* Back button */}
          <button 
            onClick={() => setCurrentScene("order")}
            style={{
              position: 'absolute',
              top: 20,
              left: 20
            }}
          >
            ← Back to Order
          </button>
  
    {!isMaking && !showToppingStation ? (
      // show bases
      <div>
        <h2>Choose a base to start:</h2>
        
        <button onClick={() => {
          setIsMaking(true);
          setMakingDrinkType("coffee");
        }}>
          Coffee Base
        </button>
        
        <button onClick={() => {
          setIsMaking(true);
          setMakingDrinkType("hot-chocolate");
        }}>
          Hot Chocolate Base
        </button>
      </div>
    ) : showToppingStation ? (
      // Show topping station
      <ToppingStation 
        currentToppings={currentToppings}
        onAddTopping={(topping) => {
          setCurrentToppings([...currentToppings, topping]);
        }}
        onComplete={(metrics) => {

          // Save topping metrics
          setDrinkMetrics({
            ...drinkMetrics,
            whippedCreamFirst: metrics.whippedCreamFirst,
            whippedCreamDuration: metrics.whippedCreamDuration
          });

          // Add toppings to drink
          setCurrentDrink({
            ...currentDrink,
            extras: currentToppings
          });
          setShowToppingStation(false);
        }}
        onCancel={() => {
          // Clear everything and go back to base selection
          handleClear();
        }}
      />
    ) : (
      <>
        {makingDrinkType === "coffee" && (
          <CoffeeMaker 
            onComplete={(metrics) => {
              // Mark coffee as done
              setHasCoffeeBase(true);

              // Save coffee metrics
              setDrinkMetrics({
                ...drinkMetrics,
                coffeeLevel: metrics.coffeeLevel,
                overflowed: metrics.overflowed
              });
              
              // If they already made hot chocolate, it's a mocha
              if (hasHotChocolateBase) {
                setCurrentDrink({
                  base: ["coffee", "hot-chocolate"],
                  extras: []
                });
              } else {
                // Just coffee
                setCurrentDrink({
                  base: ["coffee"],
                  extras: []
                });
              }
              
              setCoffeesUsed(coffeesUsed + 1);
              setIsMaking(false);
              setMakingDrinkType(null);
              setShowToppingStation(true);
            }}
            onCancel={() => {
              setIsMaking(false);
              setMakingDrinkType(null);
            }}
            beansNeedRefill={beansNeedRefill}
            onBeansRefilled={() => setCoffeesUsed(0)}
            onSwitchToHotChocolate={() => {
              // Switch to hot chocolate maker
              setHasCoffeeBase(true);
              setCurrentDrink({
                base: ["coffee"],
                extras: []
              });
              setMakingDrinkType("hot-chocolate");
            }}
            hasOtherBase={hasHotChocolateBase}
            coffeesUsed={coffeesUsed}
          />
        )}
        
        {makingDrinkType === "hot-chocolate" && (
          <HotChocolateMaker 
            onComplete={(metrics) => {
              // Mark hot chocolate as done
              setHasHotChocolateBase(true);

              // Save hot chocolate metrics
              setDrinkMetrics({
                ...drinkMetrics,
                hotChocolateTemp: metrics.temperature,
                milkLevel: metrics.milkLevel,
                stirringDuration: metrics.stirringDuration,
                overflowed: metrics.overflowed
              });
              
              // If they already made coffee, it's a mocha
              if (hasCoffeeBase) {
                setCurrentDrink({
                  base: ["coffee", "hot-chocolate"],
                  extras: []
                });
              } else {
                // Just hot chocolate
                setCurrentDrink({
                  base: ["hot-chocolate"],
                  extras: []
                });
              }
              
              setIsMaking(false);
              setMakingDrinkType(null);
              setShowToppingStation(true);
            }}
            onCancel={() => {
              setIsMaking(false);
              setMakingDrinkType(null);
              setShowToppingStation(false);
            }}
            onSwitchToCoffee={() => {
              // Switch to coffee maker
              setHasHotChocolateBase(true);
              setCurrentDrink({
                base: ["hot-chocolate"],
                extras: []
              });
              setMakingDrinkType("coffee");
            }}
            hasOtherBase={hasCoffeeBase}
          />
        )}
      </>
    )}
    

    {!isMaking && !showToppingStation && currentDrink && currentDrink.base.length > 0 && (
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