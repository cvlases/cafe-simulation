// logic flow: 
// in terms of state, 
// 0. Cup placed? (yes/no) [this needs to happen before pouring the milk, but can be before or after heating the milk]
// 1. Milk in kettle? (yes, user will need to select the milk, drag it to the kettle]
// 2. Kettle heated? (yes, and user will need to turn on the stove in order to start the heating process, and if they forget to turn it off once its done , it should start a fire] 
// 3. Milk poured into cup? (yes)
// 4. Chocolate mix added? (yes)
// 5. Stirred? (yes)
// 6. Toppings added? (later!!)

import { useState } from "react";
import type { ExtraType } from "../types";

interface HotChocolateMakerProps {
  onComplete: (toppings: ExtraType[]) => void;
  onCancel: () => void;
}

const HotChocolateMaker = ({ onComplete, onCancel }: HotChocolateMakerProps) => {
  const [cupPlaced, setCupPlaced] = useState(false);
  const [milkInKettle, setMilkInKettle] = useState(false);
  const [stoveOn, setStoveOn] = useState(false);
  const [kettleHeated, setKettleHeated] = useState(false);
  const [milkInCup, setMilkInCup] = useState(false);
  const [chocolateMixAdded, setChocolateMixAdded] = useState(false);
  const [stirred, setStirred] = useState(false);
  const [onFire, setOnFire] = useState(false);

  // Heat the kettle (only works if stove is on and milk is in kettle)
  const handleHeatKettle = () => {
    if (stoveOn && milkInKettle) {
      setKettleHeated(true);
      // TODO: Start a timer - if stove stays on too long after heating, catch fire
    }
  };

  // Pour milk into cup (only works if kettle is heated and cup is placed)
  const handlePourMilk = () => {
    if (kettleHeated && cupPlaced) {
      setMilkInCup(true);
      setStoveOn(false); // Auto turn off stove when pouring? Or leave it to player?
    }
  };

  // Add chocolate mix - only if milk is in cup
  const handleAddChocolate = () => {
    if (milkInCup) {
      setChocolateMixAdded(true);
    }
  };

  // Stir - only if chocolate is added
  const handleStir = () => {
    if (chocolateMixAdded) {
      setStirred(true);
    }
  };

  // Complete - only if stirred
  const handleComplete = () => {
    if (stirred) {
      onComplete([]); // Empty array for now, we'll add toppings later
    }
  };



  

  return (
    <div className="hot-chocolate-maker">
      <h2>Making Hot Chocolate</h2>
      
      {onFire && <p style={{color: 'red'}}>🔥 THE KETTLE IS ON FIRE! 🔥</p>}
      
      <div className="steps">
        <button onClick={() => setCupPlaced(true)} disabled={cupPlaced}>
          Place Cup {cupPlaced && "✓"}
        </button>
        
        <button onClick={() => setMilkInKettle(true)} disabled={milkInKettle}>
          Pour Milk in Kettle {milkInKettle && "✓"}
        </button>
        
        <button onClick={() => setStoveOn(!stoveOn)}>
          {stoveOn ? "Turn OFF Stove 🔥" : "Turn ON Stove"}
        </button>
        
        <button 
          onClick={handleHeatKettle}
          disabled={kettleHeated || !stoveOn || !milkInKettle}
        >
          Heat Kettle {kettleHeated && "✓"}
        </button>
        
        <button 
          onClick={handlePourMilk}
          disabled={milkInCup || !kettleHeated || !cupPlaced}
        >
          Pour Milk into Cup {milkInCup && "✓"}
        </button>
        
        <button 
          onClick={handleAddChocolate}
          disabled={chocolateMixAdded || !milkInCup}
        >
          Add Chocolate Mix {chocolateMixAdded && "✓"}
        </button>
        
        <button 
          onClick={handleStir}
          disabled={stirred || !chocolateMixAdded}
        >
          Stir {stirred && "✓"}
        </button>
        
        <button 
          onClick={handleComplete}
          disabled={!stirred}
        >
          Done!
        </button>
        
      </div>
      
      <button onClick={onCancel}>Cancel / Start Over</button>
    </div>
  );
};

export default HotChocolateMaker;