

import type { DrinkInProgress, DrinkType, ExtraType } from "../types";

interface StationProps {
  currentDrink: DrinkInProgress;
  onAddBase: (base: DrinkType) => void;
  onAddExtra: (extra: ExtraType) => void;
  onServe: () => void;
  onClear: () => void;
}

const Station = ({ currentDrink, onAddBase, onAddExtra, onServe, onClear }: StationProps) => {
    // Figure out what drink is being made
  const getDrinkName = () => {
    const bases = currentDrink.base;
    
    if (bases.length === 0) {
      return "Empty";
    }
    
    if (bases.length === 2 && bases.includes("coffee") && bases.includes("hot-chocolate")) {
      return "Mocha";
    }
    
    if (bases.length === 1) {
      return bases[0];
    }
    
    // Invalid combo (shouldn't happen with our rules, but just in case)
    return bases.join(" + ");
  };

  return (
    <div className="station">
      <h2>Station</h2>
      
      <div className="bases">
        <h3>Base Drinks</h3>
        <button onClick={() => onAddBase("coffee")}>Coffee</button>
        <button onClick={() => onAddBase("hot-chocolate")}>Hot Chocolate</button>
      </div>
      
      <div className="extras">
        <h3>Extras</h3>
        <button onClick={() => onAddExtra("whipped-cream")}>Whipped Creme</button>
        <button onClick={() => onAddExtra("marshmallows")}>Marshmallows</button>
        <button onClick={() => onAddExtra("sprinkles")}>Sprinkles</button>
      </div>
      
      <div className="cup">
        <h3>Current Cup</h3>
        <p>Base: {currentDrink.base.join(", ") || "Empty"}</p>
        <p>Making: {getDrinkName()}</p>
        <p>Extras: {currentDrink.extras.length > 0 ? currentDrink.extras.join(", ") : "None"}</p>
        </div>

      <div className="actions">
        <button onClick={onClear}>Clear</button>
        <button onClick={onServe}>Serve</button>
        </div>
    
    </div>


  );
};

export default Station;