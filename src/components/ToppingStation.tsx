import { useState, useEffect, useRef } from "react";
import type { ExtraType } from "../types";

interface ToppingStationProps {
  currentToppings: ExtraType[];
  onAddTopping: (topping: ExtraType) => void;
  onComplete: () => void;
  onCancel: () => void;
}

const ToppingStation = ({ currentToppings, onAddTopping, onComplete, onCancel }: ToppingStationProps) => {
  const [holdingWhippedCream, setHoldingWhippedCream] = useState(false);
  const [whippedCreamProgress, setWhippedCreamProgress] = useState(0);
  const hasAddedRef = useRef(false); // Track if we already added it

  const hasWhippedCream = currentToppings.includes("whipped-cream");
  const hasOtherToppings = currentToppings.includes("marshmallows") || currentToppings.includes("sprinkles");

  // Timer for whipped cream hold
  useEffect(() => {
    if (holdingWhippedCream && !hasWhippedCream && !hasOtherToppings) {
      const interval = setInterval(() => {
        setWhippedCreamProgress((prev) => {
          const newProgress = prev + 4;
          if (newProgress >= 100 && !hasAddedRef.current) {
            // Mark as added and schedule the state update
            hasAddedRef.current = true;
            setHoldingWhippedCream(false);
            // Use setTimeout to defer the state update
            setTimeout(() => {
              onAddTopping("whipped-cream");
              hasAddedRef.current = false;
            }, 0);
            return 100;
          }
          return newProgress;
        });
      }, 200);

      return () => clearInterval(interval);
    } else if (!holdingWhippedCream) {
      // Reset if they let go before finishing
      setWhippedCreamProgress(0);
    }
  }, [holdingWhippedCream, hasWhippedCream, hasOtherToppings, onAddTopping]);

  return (
    <div className="topping-station">
      <h2>Add Toppings</h2>
      
      <div className="toppings">
        {/* Whipped Cream - Press and Hold */}
        <div>
          <button
            onMouseDown={() => setHoldingWhippedCream(true)}
            onMouseUp={() => setHoldingWhippedCream(false)}
            onMouseLeave={() => setHoldingWhippedCream(false)}
            onTouchStart={() => setHoldingWhippedCream(true)}
            onTouchEnd={() => setHoldingWhippedCream(false)}
            disabled={hasWhippedCream || hasOtherToppings}
          >
            {hasWhippedCream ? "Whipped Cream ✓" : hasOtherToppings ? "Too late for whipped cream!" : "HOLD for Whipped Cream"}
          </button>
          {holdingWhippedCream && !hasWhippedCream && (
            <div className="progress-bar" style={{
              width: '200px',
              height: '20px',
              border: '1px solid black',
              marginTop: '5px'
            }}>
              <div 
                style={{
                  width: `${whippedCreamProgress}%`, 
                  height: '100%', 
                  backgroundColor: 'lightblue',
                  transition: 'width 0.2s'
                }}
              />
            </div>
          )}
        </div>

        {/* Marshmallows - Simple Click */}
        <button
          onClick={() => onAddTopping("marshmallows")}
          disabled={currentToppings.includes("marshmallows")}
        >
          {currentToppings.includes("marshmallows") ? "Marshmallows ✓" : "Add Marshmallows"}
        </button>

        {/* Sprinkles - Simple Click */}
        <button
          onClick={() => onAddTopping("sprinkles")}
          disabled={currentToppings.includes("sprinkles")}
        >
          {currentToppings.includes("sprinkles") ? "Sprinkles ✓" : "Add Sprinkles"}
        </button>
      </div>

      <div className="current-toppings">
        <p>Current Toppings: {currentToppings.length > 0 ? currentToppings.join(", ") : "None"}</p>
      </div>

          
      <button onClick={onComplete}>Finish Drink</button>
      <button onClick={onCancel}>Cancel / Start Over</button>
    </div>
  );
};

export default ToppingStation;