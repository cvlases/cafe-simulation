import './App.css'
import { useState } from "react";

import Customer from "./components/Customer";
import { customers } from "./data/customers";
import { calculateScore } from "./utils/scoring";
import type { DrinkInProgress, DrinkType, ExtraType, Order } from "./types";

import DrinkMakingStation from './components/DrinkMakingStation';
import ToppingStation from "./components/ToppingStation";
import Scorecard from './components/Scorecard';

import { calculateEarnings, formatMoney } from "./utils/money";
import type { Transaction } from "./utils/money"

import sceneConfig from './data/sceneConfig.json';
import type { SceneConfig } from './types';

import { useAssets } from './hooks/useAssets';

function App() {
  const { assets, layouts } = useAssets();
  
  // Drink state
  const [currentDrink, setCurrentDrink] = useState<DrinkInProgress>({
    base: [],
    extras: []
  });
  
  // Scene state
  type Scene = "order" | "making";
  const [currentScene, setCurrentScene] = useState<Scene>("order");

  // buttons
  const [forwardButtonPressed, setForwardButtonPressed] = useState(false);
  const [backButtonPressed, setBackButtonPressed] = useState(false);

  // Beans tracking
  const [coffeesUsed, setCoffeesUsed] = useState(0);
  const beansNeedRefill = coffeesUsed >= 3;

  // Topping station 
  const [showToppingStation, setShowToppingStation] = useState(false);
  const [currentToppings, setCurrentToppings] = useState<ExtraType[]>([]);

  // Metrics
  const [drinkMetrics, setDrinkMetrics] = useState<{
    coffeeLevel?: number;
    hotChocolateTemp?: number;
    milkLevel?: number;
    stirringDuration?: number;
    overflowed?: boolean;
    whippedCreamFirst?: boolean;
    whippedCreamDuration?: number;
  }>({});

  // Scoring
  const [showScorecard, setShowScorecard] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  // Money
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lastEarnings, setLastEarnings] = useState<{
    amount: number;
    tip: number;
    refunded: boolean;
  }>({ amount: 0, tip: 0, refunded: false });

  // Configs
  const orderConfig = sceneConfig.orderScene as SceneConfig;
  
  // Customer progression
  const [currentCustomerIndex, setCurrentCustomerIndex] = useState<number>(0);
  
  const getCustomerImage = (customerId: number): string => {
    const key = `customer${customerId}` as keyof typeof assets.customers;
    return assets.customers[key] || '';
  };

  // Check order
  const checkOrder = (drink: DrinkInProgress, order: Order): boolean => {
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
    
    if (madeDrink !== orderedDrink) {
      return false;
    }
    
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

  // Clear drink
  const handleClear = () => {
    setCurrentDrink({
      base: [],
      extras: []
    });
    setCurrentToppings([]); 
    setShowToppingStation(false); 
    setDrinkMetrics({});
  };

  // Serve drink
  const [message, setMessage] = useState<string>("");

  const handleServe = () => {
    console.log("Served:", currentDrink);
    console.log("Metrics:", drinkMetrics);
    
    const currentCustomer = customers[currentCustomerIndex];
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

  return (
    <div>
      <h1>Café Simulator</h1>
      
      {currentScene === "order" && (
        <div 
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
          
          {/* Start Making Button */}
<img
  src={forwardButtonPressed ? assets.ui.buttons.forward.pressed : assets.ui.buttons.forward.normal}
  alt="Start Making"
  onMouseDown={() => setForwardButtonPressed(true)}
  onMouseUp={() => {
    setForwardButtonPressed(false);
    setCurrentScene("making");
  }}
  onMouseLeave={() => setForwardButtonPressed(false)}
  onTouchStart={() => setForwardButtonPressed(true)}
  onTouchEnd={() => {
    setForwardButtonPressed(false);
    setCurrentScene("making");
  }}
  style={{
    position: 'absolute',
    left: `${orderConfig.elements.startButton.x}px`,
    top: `${orderConfig.elements.startButton.y}px`,
    width: `${orderConfig.elements.startButton.width}px`,
    cursor: 'pointer',
    transition: 'transform 0.1s',
    transform: forwardButtonPressed ? 'scale(0.95)' : 'scale(1)',
    userSelect: 'none'
  }}
/>
        </div>
      )}
      
      {currentScene === "making" && (
        <div 
          className="making-scene"
          style={{
            backgroundImage: `url(${assets.backgrounds.makingScene})`,
            height: `${layouts.makingScene.container.height}px`,
            width: `${layouts.makingScene.container.width}px`,
            margin: '0 auto',
            position: 'relative',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Back button */}
<img
  src={backButtonPressed ? assets.ui.buttons.back.pressed : assets.ui.buttons.back.normal}
  alt="Back to Order"
  onMouseDown={() => setBackButtonPressed(true)}
  onMouseUp={() => {
    setBackButtonPressed(false);
    setCurrentScene("order");
  }}
  onMouseLeave={() => setBackButtonPressed(false)}
  onTouchStart={() => setBackButtonPressed(true)}
  onTouchEnd={() => {
    setBackButtonPressed(false);
    setCurrentScene("order");
  }}
  style={{
    position: 'absolute',
    top: 20,
    left: 20,
    width: '150px',
    cursor: 'pointer',
    transition: 'transform 0.1s',
    transform: backButtonPressed ? 'scale(0.95)' : 'scale(1)',
    userSelect: 'none',
    zIndex: 1000
  }}
/>
  
         {showToppingStation ? (
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
      
      // Serve the drink and go back to order scene
      handleServe();
      setCurrentScene("order");
      setShowToppingStation(false);
    }}
    onCancel={() => {
      handleClear();
    }}
    drinkType={
      currentDrink.base.includes('coffee') && currentDrink.base.includes('hot-chocolate') ? 'mocha' :
      currentDrink.base.includes('coffee') ? 'coffee' : 'hot-chocolate'
    }
  />
) : (
  <DrinkMakingStation
    onComplete={() => {
      setShowToppingStation(true);
    }}
    onSkipToppings={() => {
      // Serve directly without going to toppings
      handleServe();
      setCurrentScene("order");
    }}
    onCancel={() => {
      handleClear();
    }}
    beansNeedRefill={beansNeedRefill}
    onBeansRefilled={() => setCoffeesUsed(0)}
    coffeesUsed={coffeesUsed}
    onDrinkMade={(drinkData) => {
      console.log("Drink made:", drinkData);
      
      // Update drink
      setCurrentDrink({
        base: drinkData.bases,
        extras: []
      });
      
      // Save metrics
      setDrinkMetrics({
        coffeeLevel: drinkData.coffeeLevel,
        milkLevel: drinkData.milkLevel,
        hotChocolateTemp: drinkData.temperature,
        stirringDuration: drinkData.stirringDuration,
        overflowed: drinkData.overflowed
      });
      
      // Update coffee counter if coffee was used
      if (drinkData.bases.includes('coffee')) {
        setCoffeesUsed(coffeesUsed + 1);
      }
    }}
  />
)}
        </div>
      )}
    </div>
  );
}

export default App;