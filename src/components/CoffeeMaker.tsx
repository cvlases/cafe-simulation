import { useState, useEffect } from "react";
import type { ExtraType } from "../types";
import { useAssets } from '../hooks/useAssets';
import DraggableImage from './DraggableImage';
import DropZone from './DropZone';

interface CoffeeMakerProps {
  onComplete: (metrics: {
    coffeeLevel: number;
    overflowed: boolean;
  }) => void;
  onCancel: () => void;
  beansNeedRefill: boolean;
  onBeansRefilled: () => void;
  onSwitchToHotChocolate?: () => void;
  hasOtherBase?: boolean;
  coffeesUsed: number;
}

const CoffeeMaker = ({ 
  onComplete, 
  onCancel, 
  beansNeedRefill, 
  onBeansRefilled, 
  onSwitchToHotChocolate, 
  hasOtherBase = false, 
  coffeesUsed 
}: CoffeeMakerProps) => {
  const { assets } = useAssets();


  
  // Component state
  const [cupPlaced, setCupPlaced] = useState(false);
  const [brewing, setBrewing] = useState(false);
  const [coffeeLevel, setCoffeeLevel] = useState(0);
  const [overflowed, setOverflowed] = useState(false);
  const [milkAdded, setMilkAdded] = useState(false);
  const [brewingFrame, setBrewingFrame] = useState<'idle' | 'brewing1' | 'brewing2' | 'brewing3' | 'end'>('idle');
  const [cupOnCounter, setCupOnCounter] = useState(false)

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

  // Coffee fills up while brewing
  useEffect(() => {
    if (brewing) {
      const maxLevel = hasOtherBase ? 50 : 100;
      const interval = setInterval(() => {
        setCoffeeLevel((prev) => {
          const newLevel = prev + 10;
          if (newLevel >= 110) {
            setOverflowed(true);
            setBrewing(false);
            return maxLevel;
          }
          return newLevel;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [brewing, hasOtherBase]);

  // Animate brewing states
  useEffect(() => {
    if (brewing) {
      setBrewingFrame('brewing1');
      
      const timeline = [
        { frame: 'brewing1', delay: 1000 },
        { frame: 'brewing2', delay: 1000 },
        { frame: 'brewing3', delay: 2000 },
        { frame: 'end', delay: 500 }
      ];
      
      const timeouts: number[] = [];
      let totalDelay = 0;
      
      timeline.forEach(({ frame, delay }) => {
        totalDelay += delay;
        const timeout = window.setTimeout(() => {
          setBrewingFrame(frame as any);
        }, totalDelay);
        timeouts.push(timeout);
      });
      
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    } else {
      setBrewingFrame('idle');
    }
  }, [brewing]);

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
        
        {/* LEFT: Cup Stack */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Cup Stack</p>
          <DraggableImage
            src={assets.objects.cup.stack || assets.objects.cup.empty}
            draggingSrc={assets.objects.cup.empty}
            alt="Cup Stack"
            dragData={{ type: 'cup' }}
            style={{ 
              width: '280px', 
              cursor: 'grab',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
            }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Drag cup to machine
          </p>
        </div>

        {/* CENTER: Coffee Machine & Drop Zone */}
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Coffee Machine</p>
          
          {/* Coffee Machine */}
          <img
            src={
              brewingFrame === 'idle' ? assets.objects.coffeeMaker.idle :
              brewingFrame === 'brewing1' ? assets.objects.coffeeMaker.brewing1 :
              brewingFrame === 'brewing2' ? assets.objects.coffeeMaker.brewing2 :
              brewingFrame === 'brewing3' ? assets.objects.coffeeMaker.brewing3 :
              assets.objects.coffeeMaker.end
            }
            alt="Coffee Machine"
            onClick={handleStartBrewing}
            style={{
              width: '400px',
              cursor: !cupPlaced || brewing || beansNeedRefill || overflowed ? 'not-allowed' : 'pointer',
              opacity: !cupPlaced || beansNeedRefill ? 0.5 : 1,
              borderRadius: '10px',
              transition: 'opacity 0.3s',
              filter: brewing ? 'drop-shadow(0 0 15px rgba(255, 140, 0, 0.6))' : 'none',
              border: brewing ? '3px solid rgba(255, 140, 0, 0.5)' : '3px solid transparent',
              display: 'block'
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

      {/* Drop Zone for Cup - POSITIONED ON TOP */}
      <div style={{ 
        position: 'absolute',
        top: '175px',        // Adjust this to move up/down
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10
      }}>
        <DropZone
          onDrop={(data) => {
            if (data.type === 'cup' && !cupPlaced) {
              setCupPlaced(true);
            }
          }}
          accepts={['cup']}
          style={{
            width: '100px',    // Smaller drop zone
            height: '130px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: cupPlaced ? '0' : '2px',
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
              <DraggableImage
                src={
                  overflowed ? assets.objects.cup.overflow :
                  coffeeLevel >= 90 ? assets.objects.cup.coffee_full :
                  assets.objects.cup.empty
                }
                alt="Coffee Cup"
                dragData={{ type: 'filled-cup' }}
                style={{ 
                  width: '80px',
                  height: '80px',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                  cursor: 'grab'
                }}
              />
              
              {/* Progress Bar */}
              {coffeeLevel > 0 && (
                <div style={{ marginTop: '5px' }}>
                  <div style={{
                    width: '80px',
                    backgroundColor: '#ddd',
                    borderRadius: '5px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(coffeeLevel, 100)}%`,
                      height: '100%',
                      backgroundColor: coffeeLevel > 100 ? '#e74c3c' : '#6b4423',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <p style={{ margin: '2px 0', fontSize: '10px', fontWeight: 'bold' }}>
                    {coffeeLevel}%
                  </p>
                </div>
              )}
            </div>
          ) : (
            <span style={{ color: '#4c77af', textAlign: 'center', fontSize: '12px' }}>
              ☕<br/>
              <small>Drop here</small>
            </span>
          )}
        </DropZone>
      </div>
    </div>

        {/* RIGHT: Beans Jar */}
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

    {/* COUNTER AREA - For adding milk and toppings */}
    {cupPlaced && !cupOnCounter && coffeeLevel > 0 && (
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        borderRadius: '15px',
        border: '2px dashed #8b4513'
      }}>
        <p style={{ fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
          Counter - Drag cup here to add milk & toppings
        </p>
        <DropZone
          onDrop={(data) => {
            if (data.type === 'filled-cup' && coffeeLevel > 0) {
              setCupOnCounter(true);
            }
          }}
          accepts={['filled-cup']}
          style={{
            width: '200px',
            height: '150px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: '3px',
            borderStyle: 'dashed',
            borderColor: '#8b4513',
            borderRadius: '10px',
            backgroundColor: 'rgba(139, 69, 19, 0.05)',
            transition: 'all 0.3s'
          }}
          highlightStyle={{
            backgroundColor: 'rgba(139, 69, 19, 0.2)',
            borderColor: '#8b4513',
            borderStyle: 'solid',
            borderWidth: '3px'
          }}
        >
          <span style={{ color: '#8b4513', textAlign: 'center' }}>
            🪵<br/>
            <small>Place cup on counter</small>
          </span>
        </DropZone>
      </div>
    )}

    {/* CUP ON COUNTER - Show with milk & topping options */}
    {cupOnCounter && (
      <div style={{
        marginTop: '20px',
        padding: '30px',
        backgroundColor: 'rgba(139, 69, 19, 0.15)',
        borderRadius: '15px',
        border: '3px solid #8b4513',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '20px' }}>☕ Cup on Counter</h3>
        
        {/* Cup Display */}
        <div style={{ marginBottom: '20px' }}>
          <img
            src={
              overflowed ? assets.objects.cup.overflow :
              coffeeLevel >= 90 ? assets.objects.cup.coffee_full :
              assets.objects.cup.empty
            }
            alt="Coffee Cup on Counter"
            style={{ 
              width: '120px',
              filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))'
            }}
          />
          
          {/* Progress Bar */}
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
            <div>
              <div style={{
                width: '120px',
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
              <p style={{ margin: '5px 0', fontSize: '12px', fontWeight: 'bold' }}>
                Coffee: {coffeeLevel}%
              </p>
            </div>
          </div>
        </div>

        {/* Put cup back button */}
        <button
          onClick={() => setCupOnCounter(false)}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Put Cup Back Under Machine
        </button>
      </div>
    )}


      {/* Add Milk Button */}
      {cupOnCounter && !overflowed && !milkAdded && (
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