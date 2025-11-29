import { useState, useEffect } from "react";
import type { DrinkType, ExtraType } from "../types";

interface CombinedDrinkMakerProps {
  onComplete: (bases: DrinkType[], toppings: ExtraType[]) => void;
  onCancel: () => void;
  beansNeedRefill: boolean;
  onBeansRefilled: () => void;
}

const CombinedDrinkMaker = ({ onComplete, onCancel, beansNeedRefill, onBeansRefilled }: CombinedDrinkMakerProps) => {
  const [cupPlaced, setCupPlaced] = useState(false);
  const [coffeeLevel, setCoffeeLevel] = useState(0);
  const [hotChocolateLevel, setHotChocolateLevel] = useState(0);
  const [brewing, setBrewing] = useState<"coffee" | "hot-chocolate" | null>(null);
  const [overflowed, setOverflowed] = useState(false);
  const [milkAdded, setMilkAdded] = useState(false);

  const totalLevel = coffeeLevel + hotChocolateLevel;

  // Brewing timer
  useEffect(() => {
    if (brewing) {
      const interval = setInterval(() => {
        if (brewing === "coffee") {
          setCoffeeLevel((prev) => {
            const newLevel = prev + 5;
            if (totalLevel + 5 >= 100) {
              setOverflowed(true);
              setBrewing(null);
              return prev;
            }
            return newLevel;
          });
        } else if (brewing === "hot-chocolate") {
          setHotChocolateLevel((prev) => {
            const newLevel = prev + 5;
            if (totalLevel + 5 >= 100) {
              setOverflowed(true);
              setBrewing(null);
              return prev;
            }
            return newLevel;
          });
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [brewing, totalLevel]);

  const handleStartBrewing = (type: "coffee" | "hot-chocolate") => {
    if (cupPlaced && !brewing && !overflowed) {
      if (type === "coffee" && beansNeedRefill) return;
      setBrewing(type);
    }
  };

  const handleStopBrewing = () => {
    setBrewing(null);
  };

  const handleAddMilk = () => {
    if (totalLevel > 0 && !overflowed) {
      setMilkAdded(true);
    }
  };

    const handleComplete = () => {
    if (milkAdded && !overflowed && totalLevel > 0) {
        // Figure out what was made
        const bases: DrinkType[] = []; // Add type annotation here
        if (coffeeLevel > 0) bases.push("coffee");
        if (hotChocolateLevel > 0) bases.push("hot-chocolate");
        onComplete(bases, []);
    }
    };

  return (
    <div className="combined-maker">
      <h2>Make a Drink</h2>
      
      {overflowed && (
        <p style={{color: 'red', fontWeight: 'bold'}}>☕ OVERFLOWED!</p>
      )}

      {beansNeedRefill && (
        <p style={{color: 'orange'}}>⚠️ Coffee beans need refill!</p>
      )}
      
      <div className="steps">
        <button onClick={() => setCupPlaced(true)} disabled={cupPlaced}>
          Place Cup {cupPlaced && "✓"}
        </button>

        {beansNeedRefill && (
          <button onClick={onBeansRefilled}>Refill Beans</button>
        )}

        <div>
          <h3>Choose what to add:</h3>
          {!brewing ? (
            <>
              <button 
                onClick={() => handleStartBrewing("coffee")}
                disabled={!cupPlaced || beansNeedRefill || overflowed}
              >
                Start Coffee
              </button>
              <button 
                onClick={() => handleStartBrewing("hot-chocolate")}
                disabled={!cupPlaced || overflowed}
              >
                Start Hot Chocolate
              </button>
            </>
          ) : (
            <button onClick={handleStopBrewing}>
              STOP {brewing}!
            </button>
          )}
        </div>

        <button onClick={handleAddMilk} disabled={milkAdded || totalLevel === 0}>
          Add Milk {milkAdded && "✓"}
        </button>

        <button onClick={handleComplete} disabled={!milkAdded || overflowed}>
          Done!
        </button>
      </div>
      
      <div className="status">
        <p>Coffee: {coffeeLevel}%</p>
        <p>Hot Chocolate: {hotChocolateLevel}%</p>
        <p>Total: {totalLevel}%</p>
      </div>
      
      <button onClick={onCancel}>Start Over</button>
    </div>
  );
};

export default CombinedDrinkMaker;