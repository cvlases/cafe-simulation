import { useState, useEffect } from "react";
import { useAssets } from '../hooks/useAssets';
import { useLayouts } from '../hooks/useLayouts';
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
  const { layouts } = useLayouts();
  
  // Shorthand for coffee maker layout
  const layout = layouts.makingScene.coffeeMakerScene;
  
  // Component state
  const [cupLocation, setCupLocation] = useState<'stack' | 'machine' | 'counter' | null>(null);
  const [brewing, setBrewing] = useState(false);
  const [coffeeLevel, setCoffeeLevel] = useState(0);
  const [overflowed, setOverflowed] = useState(false);
  const [milkAdded, setMilkAdded] = useState(false);
  const [pouringMilk, setPouringMilk] = useState(false);
  const [brewingFrame, setBrewingFrame] = useState<'idle' | 'start' | 'brewing1' | 'brewing2' | 'brewing3' | 'end'>('idle');

  // Start brewing coffee
  const handleStartBrewing = () => {
    if (cupLocation === 'machine' && !brewing && !beansNeedRefill && !overflowed) {
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
      setPouringMilk(true);
      
      // Animate pouring for 2 seconds
      setTimeout(() => {
        setPouringMilk(false);
        setMilkAdded(true);
      }, 2000);
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
      setBrewingFrame('start');
      
      const timeline = [
        { frame: 'start', delay: 500 },
        { frame: 'brewing1', delay: 1000 },
        { frame: 'brewing2', delay: 1000 },
        { frame: 'brewing3', delay: 1000 },
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

      {/* Main Layout - ABSOLUTE POSITIONING */}
      <div style={{ 
        position: 'relative',
        width: `${layouts.makingScene.container.width}px`,
        height: `${layouts.makingScene.container.height}px`,
        margin: '0 auto'
      }}>
        
        {/* LEFT: Cup Stack */}
        <div style={{ 
          position: 'absolute',
          left: `${layout.cupStack.x}px`,
          top: `${layout.cupStack.y}px`,
          textAlign: 'center' 
        }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Cup Stack</p>
          <DraggableImage
            src={assets.objects.cup.stack || assets.objects.cup.empty}
            draggingSrc={assets.objects.cup.empty}
            alt="Cup Stack"
            dragData={{ type: 'cup' }}
            style={{ 
              width: `${layout.cupStack.width}px`,
              cursor: 'grab',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
            }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Drag cup to machine
          </p>
        </div>

        {/* CENTER: Coffee Machine & Drop Zone */}
        <div style={{ 
          position: 'absolute',
          left: `${layout.coffeeMachine.x}px`,
          top: `${layout.coffeeMachine.y}px`,
          textAlign: 'center'
        }}>
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
              width: `${layout.coffeeMachine.width}px`,
              cursor: cupLocation !== 'machine' || brewing || beansNeedRefill || overflowed ? 'not-allowed' : 'pointer',
              opacity: cupLocation !== 'machine' || beansNeedRefill ? 0.5 : 1,
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

          {/* Drop Zone for Cup - positioned relative to machine */}
          <div style={{ 
            position: 'absolute',
            top: `${layout.coffeeMachine.dropZone.top}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10
          }}>
            <DropZone
              onDrop={(data) => {
                if (data.type === 'cup' || data.type === 'filled-cup') {
                  setCupLocation('machine');
                }
              }}
              accepts={['cup', 'filled-cup']}
              style={{
                width: `${layout.coffeeMachine.dropZone.width}px`,
                height: `${layout.coffeeMachine.dropZone.height}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: cupLocation === 'machine' ? '0' : '2px',
                borderStyle: cupLocation === 'machine' ? 'none' : 'dashed',
                borderColor: cupLocation === 'machine' ? 'transparent' : '#4c77af',
                borderRadius: '10px',
                backgroundColor: cupLocation === 'machine' ? 'transparent' : 'rgba(76, 119, 175, 0.1)',
                transition: 'all 0.3s'
              }}
              highlightStyle={{
                backgroundColor: 'rgba(76, 119, 175, 0.3)',
                borderColor: '#4c77af',
                borderStyle: 'solid',
                borderWidth: '3px'
              }}
            >
              {cupLocation === 'machine' ? (
                <DraggableImage
                  src={
                    overflowed ? assets.objects.cup.overflow :
                    coffeeLevel >= 90 ? assets.objects.cup.coffee_full :
                    assets.objects.cup.empty
                  }
                  alt="Coffee Cup"
                  dragData={{ type: 'filled-cup' }}
                  style={{ 
                    width: `${layout.coffeeMachine.cupOnMachine.width}px`,
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                    cursor: 'grab'
                  }}
                />
              ) : (
                <span style={{ color: '#4c77af', textAlign: 'center', fontSize: '12px' }}>
                  ☕<br/>
                  <small>Drop here</small>
                </span>
              )}
              
              {/* Progress Bar */}
              {cupLocation === 'machine' && coffeeLevel > 0 && (
                <div style={{ 
                  position: 'absolute',
                  bottom: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px'
                }}>
                  <div style={{
                    width: '100%',
                    height: '10px',
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
            </DropZone>
          </div>
        </div>

        {/* RIGHT: Beans Jar */}
        <div style={{ 
          position: 'absolute',
          left: `${layout.beansJar.x}px`,
          top: `${layout.beansJar.y}px`,
          textAlign: 'center' 
        }}>
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
              width: `${layout.beansJar.width}px`,
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

        {/* Milk Container */}
        <div style={{ 
          position: 'absolute',
          left: `${layout.counter.milk.x}px`,
          top: `${layout.counter.milk.y}px`,
          textAlign: 'center' 
        }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Milk</p>
          <DraggableImage
            src={assets.objects.milk.container}
            draggingSrc={assets.objects.milk.pouring}
            alt="Milk Container"
            dragData={{ type: 'milk' }}
            style={{
              width: `${layout.counter.milk.width}px`,
              cursor: milkAdded ? 'not-allowed' : 'grab',
              filter: milkAdded ? 'grayscale(100%) opacity(0.5)' : 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
            }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            {milkAdded ? '✓ Milk added' : 'Drag to cup'}
          </p>
        </div>

        {/* Counter - positioned absolutely */}
        <div style={{ 
          position: 'absolute',
          left: `${layout.counter.x}px`,
          top: `${layout.counter.y}px`,
          padding: '20px',
          backgroundColor: 'rgba(139, 69, 19, 0.1)',
          borderRadius: '15px',
          border: '2px solid #8b4513',
          width: '100%',
          maxWidth: `${layout.counter.maxWidth}px`
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>
            🪵 Counter - Place cup here to add milk & toppings
          </p>
          
          <DropZone
            onDrop={(data) => {
              if ((data.type === 'cup' || data.type === 'filled-cup') && coffeeLevel > 0) {
                setCupLocation('counter');
              }
              // Handle milk drop
              if (data.type === 'milk' && cupLocation === 'counter' && !milkAdded) {
                handleAddMilk();
              }
            }}
            accepts={['cup', 'filled-cup', 'milk']}
            style={{
              width: `${layout.counter.dropZone.width}px`,
              height: `${layout.counter.dropZone.height}px`,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: '3px',
              borderStyle: 'dashed',
              borderColor: cupLocation === 'counter' ? '#27ae60' : '#8b4513',
              borderRadius: '10px',
              backgroundColor: cupLocation === 'counter' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(139, 69, 19, 0.05)',
              transition: 'all 0.3s',
              position: 'relative'
            }}
            highlightStyle={{
              backgroundColor: 'rgba(139, 69, 19, 0.2)',
              borderColor: '#8b4513',
              borderStyle: 'solid',
              borderWidth: '3px'
            }}
          >
            {cupLocation === 'counter' ? (
              <>
                <DraggableImage
                  src={
                    overflowed ? assets.objects.cup.overflow :
                    coffeeLevel >= 90 ? assets.objects.cup.coffee_full :
                    assets.objects.cup.empty
                  }
                  alt="Coffee Cup on Counter"
                  dragData={{ type: 'filled-cup' }}
                  style={{ 
                    width: `${layout.counter.cupOnCounter.width}px`,
                    filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))',
                    cursor: 'grab'
                  }}
                />
                
                {/* Pouring Milk Animation Overlay */}
                {pouringMilk && (
                  <img
                    src={assets.objects.milk.pouring}
                    alt="Pouring Milk"
                    style={{
                      position: 'absolute',
                      top: '-270px', //above cup
                      left: '30%', // centered horizontally
                      transform: 'translateX(-50%)',
                      width: '400px',
                      zIndex: 20,
                      pointerEvents: 'none',
                      animation: 'pour 2s ease-in-out' 
                    }}
                  />
                )}
                
                {/* Progress Bar */}
                {coffeeLevel > 0 && (
                  <div style={{ marginTop: '10px', width: `${layout.counter.cupOnCounter.width}px` }}>
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
                    <p style={{ margin: '5px 0', fontSize: '12px', fontWeight: 'bold' }}>
                      {coffeeLevel}%
                    </p>
                  </div>
                )}
              </>
            ) : (
              <span style={{ color: '#8b4513', textAlign: 'center' }}>
                {coffeeLevel > 0 ? (
                  <>☕<br/><small>Drag filled cup here</small></>
                ) : (
                  <>🪵<br/><small>Counter (brew coffee first)</small></>
                )}
              </span>
            )}
          </DropZone>
        </div>
      </div> {/* END OF MAIN LAYOUT DIV */}

      {/* Mocha Option */}
      {milkAdded && cupLocation === 'counter' && onSwitchToHotChocolate && (
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