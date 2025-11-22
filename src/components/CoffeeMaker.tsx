import { useState, useEffect } from "react";
import type { ExtraType } from "../types";

interface CoffeeMakerProps {
  onComplete: (toppings: ExtraType[]) => void;
  onCancel: () => void;
  beansNeedRefill: boolean; // Passed from parent to track beans across drinks
  onBeansRefilled: () => void;
  onSwitchToHotChocolate?: () => void; // mocha switch
}

const CoffeeMaker = ({ onComplete, onCancel, beansNeedRefill, onBeansRefilled, onSwitchToHotChocolate }: CoffeeMakerProps) => {
  const [cupPlaced, setCupPlaced] = useState(false);
  const [brewing, setBrewing] = useState(false);
  const [coffeeLevel, setCoffeeLevel] = useState(0); // 0-100
  const [overflowed, setOverflowed] = useState(false);
  const [milkAdded, setMilkAdded] = useState(false);

  // Start brewing coffee
  const handleStartBrewing = () => {
    if (cupPlaced && !brewing && !beansNeedRefill && !overflowed) {
      setBrewing(true);
    }
  };

  // Stop brewing
  const handleStopBrewing = () => {
    setBrewing(false);
  };

  // Coffee fills up while brewing
  useEffect(() => {
    if (brewing) {
      const interval = setInterval(() => {
        setCoffeeLevel((prev) => {
          const newLevel = prev + 10; // Increase by 10 every interval
          if (newLevel >= 110) {
            setOverflowed(true); // Overflow!
            setBrewing(false);
            return 100;
          }
          return newLevel;
        });
      }, 500); // Every 0.5 seconds

      return () => clearInterval(interval);
    }
  }, [brewing]);

  // Add milk
  const handleAddMilk = () => {
    if (coffeeLevel > 0 && coffeeLevel <= 100 && !overflowed) {
      setMilkAdded(true);
    }
  };



  // Complete
  const handleComplete = () => {
    if (milkAdded && !overflowed) {
      onComplete([]);
    }
  };

  return (
    <div className="coffee-maker">
      <h2>Making Coffee</h2>
      
      {overflowed && (
        <p style={{color: 'red', fontWeight: 'bold'}}>
          ☕ COFFEE OVERFLOWED! You need to start over.
        </p>
      )}

      {beansNeedRefill && (
        <p style={{color: 'orange', fontWeight: 'bold'}}>
          ⚠️ Need to refill beans before brewing!
        </p>
      )}
      
      <div className="steps">
        <button 
          onClick={() => setCupPlaced(true)} 
          disabled={cupPlaced || overflowed}
        >
          Place Cup Under Maker {cupPlaced && "✓"}
        </button>

        {beansNeedRefill && (
          <button onClick={onBeansRefilled}>
            Refill Coffee Beans
          </button>
        )}

        <button 
          onClick={handleStartBrewing}
          disabled={!cupPlaced || brewing || beansNeedRefill || overflowed}
        >
          Start Brewing
        </button>

        {brewing && (
          <button onClick={handleStopBrewing}>
            STOP Brewing ⚠️
          </button>
        )}

        <button 
          onClick={handleAddMilk}
          disabled={milkAdded || coffeeLevel === 0 || overflowed}
        >
          Add Milk {milkAdded && "✓"}
        </button>

            {milkAdded && onSwitchToHotChocolate && (
        <button onClick={onSwitchToHotChocolate}>
            Add Hot Chocolate (for Mocha) →
        </button>
        )}

        <button 
          onClick={handleComplete}
          disabled={!milkAdded || overflowed}
        >
          Done!
        </button>
      </div>
      
      <div className="status">
        <p>Coffee Level: {coffeeLevel}%</p>
        <p>Brewing: {brewing ? "YES 🔥" : "NO"}</p>
      </div>
      
      <button onClick={onCancel}>Cancel / Start Over</button>
    </div>
  );
};

export default CoffeeMaker;