// logic flow: 
// in terms of state, 
// 0. Cup placed? (yes/no) [this needs to happen before pouring the milk, but can be before or after heating the milk]
// 1. Milk in kettle? (yes, user will need to select the milk, drag it to the kettle]
// 2. Kettle heated? (yes, and user will need to turn on the stove in order to start the heating process, and if they forget to turn it off once its done , it should start a fire] 
// 3. Milk poured into cup? (yes)
// 4. Chocolate mix added? (yes)
// 5. Stirred? (yes)
// 6. Toppings added? (later!!)

import { useState, useEffect } from "react";
import type { ExtraType } from "../types";

interface HotChocolateMakerProps {
  onComplete: (toppings: ExtraType[]) => void;
  onCancel: () => void;
  onSwitchToCoffee?: () => void; // for mocha making!
  hasOtherBase?: boolean;
}

const HotChocolateMaker = ({ onComplete, onCancel, onSwitchToCoffee,  hasOtherBase = false }: HotChocolateMakerProps) => {
  const [cupPlaced, setCupPlaced] = useState(false);
  const [milkInKettle, setMilkInKettle] = useState(false);
  const [stoveOn, setStoveOn] = useState(false);
  const [kettleHeated, setKettleHeated] = useState(false);
  const [pouring, setPouring] = useState(false); 
  const [milkLevel, setMilkLevel] = useState(0); 
  const [overflowed, setOverflowed] = useState(false);
  const [chocolateMixAdded, setChocolateMixAdded] = useState(false);
  const [stirred, setStirred] = useState(false);
  const [onFire, setOnFire] = useState(false);

  const handleStoveToggle = () => {
    if (stoveOn) {
        // Turning off stove
        setStoveOn(false);
        setOnFire(false); // Put out the fire
    } else {
        // Turning on stove
        setStoveOn(true);
    }
    };
  
  // Heat the kettle (only works if stove is on and milk is in kettle)
  const handleHeatKettle = () => {
    if (stoveOn && milkInKettle) {
      setKettleHeated(true);
    }
  };

  // Pour milk into cup (only works if kettle is heated and cup is placed)
  const handleStartPouring = () => {
    if (kettleHeated && cupPlaced && !pouring && !overflowed) {
      setPouring(true);
    }
  };

    // Stop pouring
  const handleStopPouring = () => {
    setPouring(false);
  };

   // Milk fills up while pouring
  useEffect(() => {
    if (pouring) {
      const maxLevel = hasOtherBase ? 50 : 100; // Only 50% if making mocha!
      
      const interval = setInterval(() => {
        setMilkLevel((prev) => {
          const newLevel = prev + 10;
          if (newLevel >= maxLevel + 20) {
            setOverflowed(true);
            setPouring(false);
            return maxLevel;
          }
          return newLevel;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [pouring, hasOtherBase]);


  // Add chocolate mix - only if milk is in cup
  const handleAddChocolate = () => {
    if (milkLevel > 0 && !overflowed) {
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
  if (onFire) {
    return; // Can't complete if there's a fire!
  }
  if (stirred) {
    onComplete([]);
  }
};




// Fire timer - if stove stays on after kettle is heated
useEffect(() => {
  if (kettleHeated && stoveOn) {
    // Start a timer - if stove stays on for 5 seconds after heating, fire!
    const fireTimer = setTimeout(() => {
      setOnFire(true);
    }, 5000); // 5 seconds

    // Cleanup function - cancel timer if stove is turned off
    return () => clearTimeout(fireTimer);
  }
}, [kettleHeated, stoveOn]);
  

  return (
    <div className="hot-chocolate-maker">
      <h2>Base: Hot Chocolate</h2>
      
      {onFire && (
        <div style={{color: 'red', fontWeight: 'bold'}}>
            <p>🔥 THE KETTLE IS ON FIRE! 🔥</p>
            <p>Turn off the stove to put it out!</p>
        </div>
        )}

        {overflowed && (
        <p style={{color: 'red', fontWeight: 'bold'}}>
          🥛 MILK OVERFLOWED! Start over.
        </p>
      )}
      
      <div className="steps">
        <button onClick={() => setCupPlaced(true)} disabled={cupPlaced}>
          Place Cup {cupPlaced && "✓"}
        </button>
        
        <button onClick={() => setMilkInKettle(true)} disabled={milkInKettle}>
          Pour Milk in Kettle {milkInKettle && "✓"}
        </button>
        
        <button onClick={handleStoveToggle}>
        {stoveOn ? "Turn OFF Stove 🔥" : "Turn ON Stove"}
        </button>
        
        <button 
          onClick={handleHeatKettle}
          disabled={kettleHeated || !stoveOn || !milkInKettle}
        >
          Heat Kettle {kettleHeated && "✓"}
        </button>
        
        <button 
          onClick={handleStartPouring}
          disabled={!kettleHeated || !cupPlaced || pouring || overflowed || milkLevel > 0}
        >
          Start Pouring Milk
        </button>

        {pouring && (
          <button onClick={handleStopPouring}>
            STOP Pouring ⚠️
          </button>
        )}
        
        <button 
          onClick={handleAddChocolate}
          disabled={chocolateMixAdded || milkLevel === 0 || overflowed}
        >
          Add Chocolate Mix {chocolateMixAdded && "✓"}
        </button>
        
        <button 
          onClick={handleStir}
          disabled={stirred || !chocolateMixAdded}
        >
          Stir {stirred && "✓"}
        </button>


        {stirred && onSwitchToCoffee && (
        <button onClick={onSwitchToCoffee}>
            Add Coffee (for Mocha) →
        </button>
        )}
        
        <button 
          onClick={handleComplete}
          disabled={!stirred || overflowed}
        >
          Done!
        </button>
        
      </div>

      <div className="status">
        <p>Milk Level: {milkLevel}%</p>
        <p>Max Level: {hasOtherBase ? "50% (making mocha!)" : "100%"}</p>
        <p>Pouring: {pouring ? "YES 🥛" : "NO"}</p>
      </div>
      
      <button onClick={onCancel}>Cancel / Start Over</button>
    </div>
  );
};

export default HotChocolateMaker;