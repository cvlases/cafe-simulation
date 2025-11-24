import { useState, useEffect } from "react";
import type { ExtraType } from "../types";
import { useAssets } from '../hooks/useAssets';
import DraggableImage from '../components/DraggableImage';
import DropZone from '../components/DropZone';


interface CoffeeMakerProps {
  onComplete:  (metrics: {
    coffeeLevel: number;
    overflowed: boolean;
  }) => void;
  onCancel: () => void;
  beansNeedRefill: boolean; // Passed from parent to track beans across drinks
  onBeansRefilled: () => void;
  onSwitchToHotChocolate?: () => void; // mocha switch
  hasOtherBase?: boolean; // true if hot chocie is alr made
  coffeesUsed: number;
}

const CoffeeMaker = ({ onComplete, onCancel, beansNeedRefill, onBeansRefilled, onSwitchToHotChocolate, hasOtherBase = false, coffeesUsed }: CoffeeMakerProps) => {
  const { assets } = useAssets();
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
        const maxLevel = hasOtherBase ? 50 : 100; // Only 50% if making mocha!
      const interval = setInterval(() => {
        setCoffeeLevel((prev) => {
          const newLevel = prev + 10; // Increase by 10 every interval
          if (newLevel >= 110) {
            setOverflowed(true); // Overflow!
            setBrewing(false);
            return maxLevel;
          }
          return newLevel;
        });
      }, 500); // Every 0.5 seconds

      return () => clearInterval(interval);
    }
  }, [brewing, hasOtherBase]);

  // Add milk
  const handleAddMilk = () => {
    if (coffeeLevel > 0 && coffeeLevel <= 100 && !overflowed) {
      setMilkAdded(true);
    }
  };



  // Complete
  const handleComplete = () => {
    if (milkAdded && !overflowed) {
        onComplete({
        coffeeLevel,
        overflowed
        });
    }
    };

  return (
  <div className="coffee-maker" style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    gap: '30px',
    padding: '20px',
    position: 'relative',
    minHeight: '600px'
  }}>
    <h2>Making Coffee</h2>
    
    {overflowed && (
      <p style={{color: 'red', fontWeight: 'bold', fontSize: '20px'}}>
        ☕ COFFEE OVERFLOWED! You need to start over.
      </p>
    )}

    {beansNeedRefill && (
      <p style={{color: 'orange', fontWeight: 'bold', fontSize: '18px'}}>
        ⚠️ Need to refill beans before brewing!
      </p>
    )}

    {/* Main Layout */}
    <div style={{ 
      display: 'flex', 
      gap: '80px', 
      alignItems: 'flex-start',
      width: '100%',
      justifyContent: 'center'
    }}>
      
      {/* LEFT: Cup Stack (Always Visible - Draggable Source) */}
    <div style={{ textAlign: 'center' }}>
      <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Cup Stack</p>
      <DraggableImage
        src={assets.objects.cup.stack || assets.objects.cup.empty}
        draggingSrc={assets.objects.cup.empty} // Show single cup while dragging
        alt="Cup Stack"
        dragData={{ type: 'cup' }}
        style={{ 
          width: '120px', 
          cursor: 'grab',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' // Add shadow for depth
        }}
      />
      <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
        Drag cup to machine
      </p>
    </div>

      {/* CENTER: Coffee Machine & Drop Zone */}
      <div style={{ textAlign: 'center' }}>
        {/* Coffee Machine - Clickable when cup is placed */}
        <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Coffee Machine</p>
        <img
          src={brewing ? assets.objects.coffeeMaker.brewing : assets.objects.coffeeMaker.idle}
          alt="Coffee Machine"
          onClick={handleStartBrewing}
          style={{
            width: '200px',
            cursor: !cupPlaced || brewing || beansNeedRefill || overflowed ? 'not-allowed' : 'pointer',
            opacity: !cupPlaced || beansNeedRefill ? 0.5 : 1,
            border: brewing ? '3px solid orange' : '3px solid transparent',
            borderRadius: '10px',
            transition: 'all 0.3s',
            filter: brewing ? 'brightness(1.2)' : 'none'
          }}
        />
        {brewing && (
          <button 
            onClick={handleStopBrewing} 
            style={{ 
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            STOP Brewing ⚠️
          </button>
        )}

        {/* Drop Zone for Cup (under machine) */}
        <div style={{ marginTop: '20px' }}>
          <DropZone
            onDrop={(data) => {
              if (data.type === 'cup' && !cupPlaced) {
                setCupPlaced(true);
              }
            }}
            accepts={['cup']}
            style={{
              width: '150px',
              height: '200px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: cupPlaced ? '0' : '3px',
              borderStyle: cupPlaced ? 'none' : 'dashed',
              borderColor: cupPlaced ? 'transparent' : '#4c77af',
              borderRadius: '10px',
              backgroundColor: cupPlaced ? 'transparent' : 'rgba(76, 119, 175, 0.1)',
              transition: 'all 0.3s'
            }}
            highlightStyle={{
              backgroundColor: 'rgba(76, 119, 175, 0.3)',
              borderColor: '#4c77af',
              borderStyle: 'solid',
              borderWidth: '3px'
            }}
          >
            {cupPlaced ? (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={
                    overflowed ? assets.objects.cup.overflow :
                    coffeeLevel >= 90 ? assets.objects.cup.coffee_full :
                    assets.objects.cup.empty
                  }
                  alt="Coffee Cup"
                  style={{ width: '100%', height: 'auto' }}
                />
                
                {/* Progress Bar */}
                {coffeeLevel > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{
                      width: '100%',
                      height: '15px',
                      backgroundColor: '#ddd',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(coffeeLevel, 100)}%`,
                        height: '100%',
                        backgroundColor: coffeeLevel > 100 ? '#e74c3c' : '#6b4423',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <p style={{ margin: '5px 0', fontSize: '12px' }}>
                      {coffeeLevel}%
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <span style={{ color: '#4c77af', textAlign: 'center' }}>
                ☕<br/>
                <small>Drag cup here</small>
              </span>
            )}
          </DropZone>
        </div>
      </div>

      {/* RIGHT: Beans Jar (Clickable to refill) */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Coffee Beans</p>
        <img
          src={
            beansNeedRefill ? assets.objects.beans.empty :
            coffeesUsed >= 2 ? assets.objects.beans.half :
            assets.objects.beans.full
          }
          alt="Coffee Beans"
          onClick={() => beansNeedRefill && onBeansRefilled()}
          style={{
            width: '120px',
            cursor: beansNeedRefill ? 'pointer' : 'default',
            opacity: beansNeedRefill ? 1 : 0.7,
            border: beansNeedRefill ? '3px solid orange' : '3px solid transparent',
            borderRadius: '10px',
            transition: 'all 0.3s',
            filter: beansNeedRefill ? 'brightness(1.1)' : 'none'
          }}
        />
        {beansNeedRefill && (
          <p style={{ 
            color: 'orange', 
            fontSize: '14px', 
            marginTop: '5px',
            fontWeight: 'bold'
          }}>
            👆 Click to refill!
          </p>
        )}
      </div>
    </div>

    {/* Add Milk Button */}
    {coffeeLevel > 0 && coffeeLevel <= 100 && !overflowed && !milkAdded && (
      <button 
        onClick={handleAddMilk}
        style={{
          padding: '15px 35px',
          fontSize: '18px',
          cursor: 'pointer',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Add Milk 🥛
      </button>
    )}

    {/* Mocha Option */}
    {milkAdded && onSwitchToHotChocolate && (
      <button 
        onClick={onSwitchToHotChocolate}
        style={{
          padding: '12px 30px',
          fontSize: '16px',
          backgroundColor: '#8b4513',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Add Hot Chocolate (for Mocha) →
      </button>
    )}

    {/* Action Buttons */}
    <div style={{ display: 'flex', gap: '20px' }}>
      <button 
        onClick={handleComplete}
        disabled={!milkAdded || overflowed}
        style={{
          padding: '15px 40px',
          fontSize: '18px',
          backgroundColor: !milkAdded || overflowed ? '#ccc' : '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: !milkAdded || overflowed ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          boxShadow: !milkAdded || overflowed ? 'none' : '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        Done! ✓
      </button>
      
      <button 
        onClick={onCancel}
        style={{
          padding: '15px 40px',
          fontSize: '18px',
          backgroundColor: '#95a5a6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Cancel / Start Over
      </button>
    </div>
  </div>
);
};

export default CoffeeMaker;