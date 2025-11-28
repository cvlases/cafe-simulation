import { useState, useEffect } from "react";
import { useAssets } from '../hooks/useAssets';
import { useLayouts } from '../hooks/useLayouts';
import DraggableImage from './DraggableImage';
import DropZone from './DropZone';

interface DrinkMakingStationProps {
  onComplete: () => void;
  onSkipToppings?: () => void;
  onCancel: () => void;
  beansNeedRefill: boolean;
  onBeansRefilled: () => void;
  coffeesUsed: number;
  onDrinkMade: (drinkData: {
    bases: ('coffee' | 'hot-chocolate')[];
    coffeeLevel?: number;
    milkLevel?: number;
    temperature?: number;
    stirringDuration?: number;
    overflowed: boolean;
  }) => void;
}

const DrinkMakingStation = ({ 
  onComplete, 
  onSkipToppings,
  onCancel,
  beansNeedRefill,
  onBeansRefilled,
  coffeesUsed,
  onDrinkMade
}: DrinkMakingStationProps) => {
  const { assets } = useAssets();
  const { layouts } = useLayouts();
  
  const layout = layouts.makingScene.coffeeMakerScene;
  
  // Cup state
  const [cupLocation, setCupLocation] = useState<'stack' | 'counter' | 'machine' | null>(null);
  const [overflowed, setOverflowed] = useState(false);
  
  // Coffee states
  const [brewing, setBrewing] = useState(false);
  const [coffeeLevel, setCoffeeLevel] = useState(0);
  const [brewingFrame, setBrewingFrame] = useState<'idle' | 'brewing1' | 'brewing2' | 'brewing3' | 'end'>('idle');
  
  // button states
  const [forwardButtonPressed, setForwardButtonPressed] = useState(false);
 
  // Hot chocolate states
  const [kettleLocation, setKettleLocation] = useState<'counter' | 'stove' | null>('counter');
  const [kettleState, setKettleState] = useState<'regular' | 'hot' | 'pouring'>('regular');
  const [kettleTemperature, setKettleTemperature] = useState(0); // 0-200°F
  const [stoveOn, setStoveOn] = useState(false);
  const [stoveState, setStoveState] = useState<'off' | 'on' | 'fire'>('off');
  const [heatingTime, setHeatingTime] = useState(0);
  const [hotMilkLevel, setHotMilkLevel] = useState(0);
  const [pouringHotMilk, setPouringHotMilk] = useState(false);
  const [readyToPour, setReadyToPour] = useState(false); 
  const [isPouring, setIsPouring] = useState(false);
  const [trashHover, setTrashHover] = useState(false);

  // Chocolate & Spoon states
  const [spoonState, setSpoonState] = useState<'empty' | 'full'>('empty');
  const [chocolateAdded, setChocolateAdded] = useState(false);
  const [pouringChocolate, setPouringChocolate] = useState(false);
  
  // Cold milk (for coffee)
  const [coldMilkAdded, setColdMilkAdded] = useState(false);
  const [pouringColdMilk, setPouringColdMilk] = useState(false);
  
  // Stirring
  const [isStirring, setIsStirring] = useState(false);
  const [stirringDuration, setStirringDuration] = useState(0);
  const [stirringFrame, setStirringFrame] = useState<'left' | 'center' | 'right'>('center');

  // Determine what was made
  const getDrinkType = (): 'coffee' | 'hot-chocolate' | 'mocha' | null => {
    const hasCoffee = coffeeLevel > 0;
    const hasHotChocolate = hotMilkLevel > 0 && chocolateAdded && stirringDuration >= 3;
    
    if (hasCoffee && hasHotChocolate) return 'mocha';
    if (hasCoffee) return 'coffee';
    if (hasHotChocolate) return 'hot-chocolate';
    return null;
  };

  // Coffee machine handlers
  const handleStartBrewing = () => {
    if (cupLocation === 'machine' && !brewing && !beansNeedRefill && !overflowed) {
      setBrewing(true);
    }
  };

  const handleStopBrewing = () => {
    setBrewing(false);
  };

  // Stove handlers
  const handleStoveToggle = () => {
    if (stoveState === 'off') {
      setStoveOn(true);
      setStoveState('on');
    } else {
      setStoveOn(false);
      setStoveState('off');
      setHeatingTime(0);
      setKettleTemperature(0); // Reset temperature when stove is turned off
    }
  };

  const handleReadyToPour = () => {
    console.log("Ready to pour triggered!", { kettleState, cupLocation, hotMilkLevel, kettleTemperature }); // ← Add kettleTemperature
    if (kettleTemperature >= 140 && cupLocation === 'counter' && !overflowed && hotMilkLevel < 100) {
        console.log("✅ Setting readyToPour to TRUE!");
        setReadyToPour(true);
        setKettleState('hot');
  } else {
    console.log("❌ Condition failed!"); // ← Add this
  }
};

    const handleStartPouring = () => {
        console.log("Starting pour!");
    if (readyToPour && !overflowed && hotMilkLevel < 100) {
        setIsPouring(true);
        setPouringHotMilk(true);
        setKettleState('pouring');
    }
    };

    const handleStopPouring = () => {
    setIsPouring(false);
    setPouringHotMilk(false);
    
    // If they poured enough, reset everything
    if (hotMilkLevel > 0) {
        setReadyToPour(false);
        setKettleState('regular');
        setKettleTemperature(0);
    }
    };

  // Chocolate handlers
  const handleFillSpoon = () => {
    if (spoonState === 'empty') {
      setSpoonState('full');
    }
  };

  const handleAddChocolate = () => {
    if (spoonState === 'full' && cupLocation === 'counter' && hotMilkLevel > 0 && !chocolateAdded) {
      setPouringChocolate(true);
      
      setTimeout(() => {
        setPouringChocolate(false);
        setChocolateAdded(true);
        setSpoonState('empty');
      }, 1500);
    }
  };

  // Cold milk handler (for coffee)
  const handleAddColdMilk = () => {
    if (coffeeLevel > 0 && coffeeLevel <= 100 && !overflowed && !coldMilkAdded && cupLocation === 'counter') {
      setPouringColdMilk(true);
      
      setTimeout(() => {
        setPouringColdMilk(false);
        setColdMilkAdded(true);
      }, 2000);
    }
  };

  // Complete handler
const handleComplete = () => {
  if (overflowed || stoveState === 'fire' || totalLiquidLevel === 0) return;

  // Determine bases - flexible for any combination
  let bases: ('coffee' | 'hot-chocolate')[] = [];
  
  // Both coffee and hot chocolate = mocha
  if (coffeeLevel > 0 && hotMilkLevel > 0 && chocolateAdded && stirringDuration >= 3) {
    bases = ['coffee', 'hot-chocolate'];
  }
  // Just hot chocolate (hot milk + chocolate + stirred)
  else if (hotMilkLevel > 0 && chocolateAdded && stirringDuration >= 3) {
    bases = ['hot-chocolate'];
  }
  // Just coffee
  else if (coffeeLevel > 0) {
    bases = ['coffee'];
  }

  // Pass drink data back
  onDrinkMade({
    bases,
    coffeeLevel: coffeeLevel > 0 ? coffeeLevel : undefined,
    milkLevel: hotMilkLevel > 0 ? hotMilkLevel : undefined,
    temperature: kettleTemperature > 0 ? kettleTemperature : undefined,
    stirringDuration: stirringDuration > 0 ? stirringDuration : undefined,
    overflowed
  });

  onComplete();
};

  // Coffee brewing animation
  useEffect(() => {
    if (brewing) {
      setBrewingFrame('idle');
      
      const timeline = [
        { frame: 'brewing1', delay: 500 },
        { frame: 'brewing2', delay: 2000 },
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


        // Coffee fills up while brewing
        useEffect(() => {
        if (brewing) {
            const interval = setInterval(() => {
            setCoffeeLevel((prev) => {
                const newLevel = prev + 10;
                
                // If making mocha, cap based on existing hot milk
                const maxLevel = hotMilkLevel > 0 
                ? Math.min(50, 100 - hotMilkLevel)  // ← CHANGED: account for existing hot milk
                : 100;
                
                if (newLevel >= maxLevel + 10) {
                setOverflowed(true);
                setBrewing(false);
                return maxLevel;
                }
                
                // Auto-stop at target level
                if (newLevel >= maxLevel) {
                setBrewing(false);
                return maxLevel;
                }
                
                return newLevel;
            });
            }, 500);

            return () => clearInterval(interval);
        }
        }, [brewing, hotMilkLevel]);

  // Kettle heating with temperature
  useEffect(() => {
    if (stoveOn && kettleLocation === 'stove') {
      const interval = setInterval(() => {
        setKettleTemperature((prev) => {
          const newTemp = prev + 20; // Increase by 20°F every half second
          
          // Kettle becomes hot at 160°F
          if (newTemp >= 160 && kettleState === 'regular') {
            setKettleState('hot');
          }
          
          // Cap at 200°F
          if (newTemp >= 200) {
            return 200;
          }
          
          return newTemp;
        });
      }, 500); // Every 0.5 seconds
      
      return () => clearInterval(interval);
    } else if (!stoveOn || kettleLocation !== 'stove') {
      // Slowly cool down when not on stove
      const coolInterval = setInterval(() => {
        setKettleTemperature((prev) => {
          const newTemp = prev - 10;
          
          // Reset state when cooled below 160°F
          if (newTemp < 160 && kettleState === 'hot') {
            setKettleState('regular');
          }
          
          if (newTemp <= 0) return 0;
          return newTemp;
        });
      }, 1000);
      
      return () => clearInterval(coolInterval);
    }
  }, [stoveOn, kettleLocation, kettleState]);

  // Fire timer - if stove stays on too long after kettle is hot
    useEffect(() => {
    if (kettleTemperature === 200 && stoveOn && kettleLocation === 'stove' && stoveState === 'on') {
        // Start fire timer when kettle reaches max temp
        const fireTimer = setTimeout(() => {
        setStoveState('fire');
        }, 3000); // 10 seconds after reaching 200°F

        return () => clearTimeout(fireTimer);
    }
    }, [kettleTemperature, stoveOn, kettleLocation, stoveState]);

    
// Hot milk fills while actively pouring
        useEffect(() => {
        if (isPouring && pouringHotMilk) {
            const interval = setInterval(() => {
            setHotMilkLevel((prev) => {
                const newLevel = prev + 8;
                
                // If making mocha, cap based on existing coffee
                const maxLevel = coffeeLevel > 0 
                ? Math.min(50, 100 - coffeeLevel)  // ← CHANGED: account for existing coffee
                : 100;
                
                if (newLevel >= maxLevel + 10) {
                setOverflowed(true);
                setIsPouring(false);
                setPouringHotMilk(false);
                setReadyToPour(false);
                return maxLevel;
                }
                
                // Auto-stop at target level
                if (newLevel >= maxLevel) {
                setIsPouring(false);
                setPouringHotMilk(false);
                setReadyToPour(false);
                return maxLevel;
                }
                
                return newLevel;
            });
            }, 200);

            return () => clearInterval(interval);
        }
        }, [isPouring, pouringHotMilk, coffeeLevel]);

  // Stirring timer
useEffect(() => {
  if (isStirring) {
    const interval = setInterval(() => {
      setStirringDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }
}, [isStirring]);

// Auto-stop stirring at 3 seconds ← ADD THIS
useEffect(() => {
  if (stirringDuration >= 3 && isStirring) {
    setIsStirring(false);
  }
}, [stirringDuration, isStirring]);


  // Stirring animation
  useEffect(() => {
  if (isStirring) {
    const frameSequence: ('left' | 'center' | 'right')[] = ['center', 'left', 'center', 'right'];
    let frameIndex = 0;
    
    const interval = setInterval(() => {
      frameIndex = (frameIndex + 1) % frameSequence.length;
      setStirringFrame(frameSequence[frameIndex]);
    }, 200); // Change frame every 200ms
    
    return () => clearInterval(interval);
  } else {
    setStirringFrame('center');
  }
}, [isStirring]);

  const totalLiquidLevel = coffeeLevel + hotMilkLevel;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '20px',
      padding: '20px',
      position: 'relative'
    }}>
      
      {stoveState === 'fire' && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 0, 0, 0.9)',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontSize: '18px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(255, 0, 0, 0.5)'
        }}>
          <p style={{ margin: 0 }}>🔥 FIRE! Click stove to turn off! 🔥</p>
        </div>
      )}

      {overflowed && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: 'rgba(231, 76, 60, 0.9)',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontSize: '18px',
          boxShadow: '0 4px 12px rgba(231, 76, 60, 0.5)'
        }}>
          Overflowed! Start over.
        </div>
      )}

      {/* Mocha Indicator */}
{((coffeeLevel > 0 && hotMilkLevel > 0) || 
  (coffeeLevel > 0 && readyToPour) || 
  (hotMilkLevel > 0 && cupLocation === 'machine' )) && (
  <div style={{
    position: 'absolute',
    top: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    backgroundColor: 'rgba(139, 111, 71, 0.95)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
  }}>
    🍫☕ Making a Mocha! (50/50 mix)
  </div>
)}

      {/* Main Layout */}
      <div style={{ 
        position: 'relative',
        width: `${layouts.makingScene.container.width}px`,
        height: `${layouts.makingScene.container.height}px`,
        margin: '0 auto'
      }}>
        
        {/* TOP ROW */}
        
        {/* Cup Stack */}
        <div style={{ 
          position: 'absolute',
          left: `${layout.cupStack.x}px`,
          top: `${layout.cupStack.y}px`,
          textAlign: 'center' 
        }}>
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
        </div>

        {/* Coffee Machine */}
        <div style={{ 
          position: 'absolute',
          left: `${layout.coffeeMachine.x}px`,
          top: `${layout.coffeeMachine.y}px`,
          textAlign: 'center'
        }}>
          
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
                marginTop: '-10px',
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            >
              STOP ⚠️
            </button>
          )}

          {/* Drop Zone under Coffee Machine */}
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
                <span style={{ color: '#4c77af', textAlign: 'center', fontSize: '11px' }}>
                  ☕<br/>
                  <small>Place cup</small>
                </span>
              )}
              
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

        {/* Beans Jar */}
        <div style={{ 
          position: 'absolute',
          left: `${layout.beansJar.x}px`,
          top: `${layout.beansJar.y}px`,
          textAlign: 'center' 
        }}>

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
              fontSize: '11px', 
              marginTop: '5px',
              fontWeight: 'bold'
            }}>
              👆 Click to refill
            </p>
          )}
        </div>

        {/* Milk Container (top right) */}
        {layout.milk && (
          <div style={{ 
            position: 'absolute',
            left: `${layout.milk.x}px`,
            top: `${layout.milk.y}px`,
            textAlign: 'center' 
          }}>
            <DraggableImage
              src={assets.objects.milk.container}
              draggingSrc={assets.objects.milk.pouring}
              alt="Milk Container"
              dragData={{ type: 'milk' }}
              style={{
                width: `${layout.milk.width}px`,
                cursor: coldMilkAdded ? 'not-allowed' : 'grab',
                filter: coldMilkAdded ? 'grayscale(100%) opacity(0.5)' : 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
              }}
            />
            <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
              {coldMilkAdded ? '✓ Used' : 'For coffee'}
            </p>
          </div>
        )}

        {/* STOVE */}
        <div style={{
          position: 'absolute',
          left: `${layout.stove.x}px`,
          top: `${layout.stove.y}px`,
          textAlign: 'center'
        }}>
         
          
          {/* Clickable button overlay */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={
                stoveState === 'fire' ? assets.objects.stove.fire :
                stoveState === 'on' ? assets.objects.stove.on :
                assets.objects.stove.off
              }
              alt="Stove"
              style={{
                width: `${layout.stove.width}px`,
                display: 'block',
                filter: stoveState === 'on' ? 'drop-shadow(0 0 10px rgba(255, 100, 0, 0.8))' : 
                        stoveState === 'fire' ? 'drop-shadow(0 0 20px rgba(255, 0, 0, 1))' : 'none',
                transition: 'all 0.3s',
                animation: stoveState === 'fire' ? 'shake 0.3s infinite' : 'none',
                border: stoveState === 'fire' ? '3px solid red' : '3px solid transparent',
                borderRadius: '10px',
                pointerEvents: 'none'
              }}
            />
            
            {/* Big obvious button */}
            <button
              onClick={handleStoveToggle}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              style={{
                position: 'absolute',
                bottom: '60px',
                left: '40%',
                transform: 'translateX(-50%)',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: stoveState === 'off' ? '#d9d249ff' : 
                                 stoveState === 'fire' ? '#c0ac2bff' : '#c1a54bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                // boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                zIndex: 100
              }}
            >
              {stoveState === 'off' ? '🔘 Turn ON' : 
               stoveState === 'fire' ? '🚨 PUT OUT FIRE!' : 
               'Turn OFF'}
            </button>
            
            {/* Kettle Drop Zone on Stove */}
            <DropZone
              onDrop={(data) => {
                if (data.type === 'kettle') {
                  setKettleLocation('stove');
                  setHeatingTime(0);
                }
              }}
              accepts={['kettle']}
              style={{
                position: 'absolute',
                left: `${layout.stove.kettleOnStove.x}px`,
                top: `${layout.stove.kettleOnStove.y}px`,
                width: '100px',
                height: '100px',
                borderWidth: kettleLocation === 'stove' ? '0' : '3px',
                borderStyle: kettleLocation === 'stove' ? 'none' : 'dashed',
                borderColor: stoveOn ? '#ff6b35' : 'orange',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: kettleLocation === 'stove' ? 'transparent' : 'rgba(255, 165, 0, 0.1)',
                animation: stoveOn && kettleLocation !== 'stove' ? 'pulse 1s infinite' : 'none'
              }}
              highlightStyle={{
                backgroundColor: 'rgba(255, 165, 0, 0.4)',
                borderColor: '#ff6b35',
                borderStyle: 'solid',
                borderWidth: '4px'
              }}
            >
              {kettleLocation === 'stove' ? (
                <>
                  {!readyToPour && (
                <DraggableImage
                  src={
                    kettleState === 'hot' ? assets.objects.kettle.hot :
                    assets.objects.kettle.regular
                  }
                  draggingSrc={
                    kettleState === 'hot' ? assets.objects.kettle.pouring :
                    assets.objects.kettle.regular
                  }
                  alt="Kettle on Stove"
                  dragData={{ type: kettleState === 'hot' ? 'hot-kettle' : 'kettle' }}
                  style={{
                    width: '380px',
                    marginLeft: '120px',
                    marginTop: '0px',
                    filter: kettleTemperature >= 160 ? 'drop-shadow(0 0 15px rgba(255, 100, 0, 0.9))' : 
                            kettleTemperature > 80 ? 'drop-shadow(0 0 8px rgba(255, 165, 0, 0.6))' :
                            stoveOn ? 'drop-shadow(0 0 4px rgba(255, 200, 100, 0.4))' : 'none',
                    cursor: kettleState === 'hot' ? 'grab' : 'not-allowed',
                    animation: kettleTemperature > 80 ? 'shake 0.5s infinite' : 'none'
                  }}
                />
                )} 
                </>
              ) : (
                <span style={{ 
                  fontSize: '11px', 
                  color: stoveOn ? '#ff6b35' : 'orange',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  {stoveOn ? 'Drop kettle here!' : 'Place kettle'}
                </span>
              )}
            </DropZone>
            
            {/* Temperature Display */}
            {kettleLocation === 'stove' && kettleTemperature > 0 && (
              <div style={{
                position: 'absolute',
                bottom: '-50px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: kettleTemperature >= 160 ? 'rgba(231, 76, 60, 0.9)' : 
                               kettleTemperature >= 100 ? 'rgba(243, 156, 18, 0.9)' :
                               'rgba(52, 152, 219, 0.9)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                minWidth: '80px'
              }}>
                {kettleTemperature}°F
                {kettleTemperature >= 200 && <div style={{ fontSize: '10px' }}>MAX HEAT! 🔥</div>}
                {kettleTemperature >= 160 && kettleTemperature < 200 && <div style={{ fontSize: '10px' }}>♨️ HOT!</div>}
                {kettleTemperature < 160 && <div style={{ fontSize: '10px' }}>Heating...</div>}
              </div>
            )}

            
            
          </div>
        </div>

        {/* KETTLE - when on counter */}
        {kettleLocation === 'counter' && (
          <div style={{
            position: 'absolute',
            left: `${layout.kettle.x}px`,
            top: `${layout.kettle.y}px`,
            textAlign: 'center'
          }}>
            
            <DraggableImage
              src={
                kettleState === 'hot' ? assets.objects.kettle.hot :
                assets.objects.kettle.regular
              }
              draggingSrc={
                kettleState === 'hot' ? assets.objects.kettle.pouring :
                assets.objects.kettle.regular
              }
              alt="Kettle"
              dragData={{ type: kettleState === 'hot' ? 'hot-kettle' : 'kettle' }}
              style={{
                width: `${layout.kettle.width}px`,
                cursor: 'grab',
                filter: kettleTemperature >= 160 ? 'drop-shadow(0 0 12px rgba(255, 100, 0, 0.8))' :
                        kettleTemperature > 0 ? 'drop-shadow(2px 2px 6px rgba(255, 165, 0, 0.5))' :
                        'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
              }}
            />
            
            <p style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
              {kettleState === 'hot' ? '✓ Ready to pour!' : 'Place on stove'}
            </p>
          </div>
        )}

        {/* CHOCOLATE BOWL */}
        <div style={{
          position: 'absolute',
          left: `${layout.chocolate.bowl.x}px`,
          top: `${layout.chocolate.bowl.y}px`,
          textAlign: 'center'
        }}>

          
          <DropZone
            onDrop={(data) => {
              if (data.type === 'spoon-empty') {
                handleFillSpoon();
              }
            }}
            accepts={['spoon-empty']}
            style={{
              display: 'inline-block',
              position: 'relative'
            }}
            highlightStyle={{
              filter: 'brightness(1.2)'
            }}
          >
            <img
              src={assets.objects.chocolate.bowl}
              alt="Chocolate Bowl"
              style={{
                width: `${layout.chocolate.bowl.width}px`,
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
              }}
            />
          </DropZone>
        </div>

        {/* SPOON */}
        <div style={{
          position: 'absolute',
          left: `${layout.chocolate.spoon.x}px`,
          top: `${layout.chocolate.spoon.y}px`,
          textAlign: 'center'
        }}>

          <DraggableImage
            src={
              spoonState === 'full' ? assets.objects.spoon.full :
              assets.objects.spoon.empty
            }
            alt="Spoon"
            dragData={{ 
              type: spoonState === 'full' ? 'spoon-full' : 'spoon-empty'
            }}
            style={{
              width: `${layout.chocolate.spoon.width}px`,
              cursor: 'grab',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
            }}
          />
          <p style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
            {spoonState === 'full' ? 'To cup' : 'To bowl'}
          </p>
        </div>

        {/* Trash Can - INSIDE the main layout div */}
  <div style={{
    position: 'absolute',
    left: `${layout.trash.x}px`,
    top: `${layout.trash.y}px`,
    textAlign: 'center'
  }}>
    <DropZone
      onDrop={(data) => {
        if (data.type === 'cup-to-trash' || data.type === 'filled-cup') {
          console.log("Cup thrown in trash - restarting!");
          setCupLocation(null);
          setTimeout(() => {
            onCancel();
          }, 300);
        }
      }}
      onDragEnter={() => setTrashHover(true)}
      onDragLeave={() => setTrashHover(false)}
      accepts={['cup-to-trash', 'filled-cup']}
      style={{
        width: `${layout.trash.width}px`,
        height: `${layout.trash.width}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        transition: 'all 0.3s'
      }}
      highlightStyle={{
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        transform: 'scale(1.1)'
      }}
    >
      <img
        src={assets.objects.trash.empty}
        alt="Trash"
        style={{
          width: '100%',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
          transition: 'all 0.3s',
          pointerEvents: 'none'
        }}
      />
    </DropZone>
    <p style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
      Drag cup here to restart
    </p>
  </div>

        
        {/* Cup Drop Zone - standalone, no box */}
        <div style={{
          position: 'absolute',
          left: `${layout.cupDropZone.x}px`,
          top: `${layout.cupDropZone.y}px`,
          textAlign: 'center'
        }}>

          <DropZone
            onDrop={(data) => {
                console.log("Coffee machine received:", data);
              if (data.type === 'cup' || data.type === 'filled-cup') {
                setCupLocation('counter');
              }
              if (data.type === 'hot-kettle' && cupLocation === 'counter') {
                handleReadyToPour();
                }
              
              if (data.type === 'milk' && cupLocation === 'counter' && coffeeLevel > 0 && !coldMilkAdded) {
                handleAddColdMilk();
              }
              if (data.type === 'spoon-full' && cupLocation === 'counter' && hotMilkLevel > 0) {
                handleAddChocolate();
              }
            }}
            accepts={['cup', 'filled-cup', 'hot-kettle', 'milk', 'spoon-full']}
            style={{
              width: `${layout.cupDropZone.width}px`,
              height: `${layout.cupDropZone.height}px`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: '3px',
              borderStyle: 'dashed',
              borderColor: cupLocation === 'counter' ? '#27ae60' : '#95a5a6',
              borderRadius: '10px',
              backgroundColor: cupLocation === 'counter' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(200, 200, 200, 0.05)',
              transition: 'all 0.3s',
              position: 'relative'
            }}
            highlightStyle={{
              backgroundColor: 'rgba(200, 200, 200, 0.2)',
              borderColor: '#7f8c8d',
              borderStyle: 'solid',
              borderWidth: '3px'
            }}
          >
            {cupLocation === 'counter' ? (
              <>
                <DraggableImage
                    src={(() => {
                        // If stirring, show the stirring animation images
                        if (isStirring && chocolateAdded) {
                        const hasCoffee = coffeeLevel > 0;
                        const hasHotChocolate = hotMilkLevel > 0;
                        
                        let drinkType: 'coffee' | 'hotChocolate' | 'mocha' = 'hotChocolate';
                        if (hasCoffee && hasHotChocolate) {
                            drinkType = 'mocha';
                        } else if (hasCoffee) {
                            drinkType = 'coffee';
                        }
                        
                        return assets.objects.stirring[drinkType][stirringFrame];
                        }
                        
                        // If done stirring, show the completed drink!
                        if (stirringDuration >= 3 && chocolateAdded) {
                        const hasCoffee = coffeeLevel > 0;
                        const hasHotChocolate = hotMilkLevel > 0;
                        
                        if (hasCoffee && hasHotChocolate) {
                            return assets.objects.cup.mocha_done;
                        } else if (hasHotChocolate) {
                            return assets.objects.cup.hot_chocolate_done;
                        } else if (hasCoffee) {
                            return assets.objects.cup.coffee_done;
                        }
                        }
                        
                        // Hot milk filled (before chocolate added)
                        if (hotMilkLevel > 0 && !chocolateAdded) {
                        return assets.objects.cup.milk_filled;
                        }
                        
                        // Mocha in progress
                        if (coffeeLevel > 0 && hotMilkLevel > 0 && chocolateAdded && stirringDuration < 3) {
                        return assets.objects.cup.milk_filled;
                        }
                        
                        // Coffee
                        if (coffeeLevel >= 40) {
                        return coldMilkAdded ? assets.objects.cup.coffee_done : assets.objects.cup.coffee_full;
                        }
                        
                        // Overflow
                        if (overflowed) return assets.objects.cup.overflow;
                        
                        // Default empty
                        return assets.objects.cup.empty;
                    })()}
                    // draggingSrc={assets.objects.cup.empty}
                    alt="Cup"
                    dragData={{ type: 'cup-to-trash' }}
                    style={{ 
                        width: `${layout.cupOnCounter.width}px`,
                        filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))',
                        cursor: 'grab'
                    }}
                    />


                    
                {/* Pouring Hot Milk */}
                {(pouringHotMilk || isPouring) && (  // ← Changed this line
                <img
                    src={assets.objects.kettle.pouring}
                    alt="Pouring Hot Milk"
                    style={{
                    position: 'absolute',
                    top: '-60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120px',
                    zIndex: 20,
                    pointerEvents: 'none',
                    animation: 'pour 3s ease-in-out infinite'  // ← Added infinite
                    }}
                />
                )}

                {/* Pouring Cold Milk */}
                {pouringColdMilk && (
                  <img
                    src={assets.objects.milk.pouring}
                    alt="Pouring Milk"
                    style={{
                      position: 'absolute',
                      top: `${layout.coldMilk.pouringAnimation.top}px`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: `${layout.coldMilk.pouringAnimation.width}px`,
                      zIndex: 20,
                      pointerEvents: 'none',
                      animation: 'pour 2s ease-in-out'
                    }}
                  />
                )}

                {/* Pouring Chocolate */}
                {pouringChocolate && (
                  <img
                    src={assets.objects.spoon.full}
                    alt="Adding Chocolate"
                    style={{
                      position: 'absolute',
                      top: '-50px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60px',
                      zIndex: 20,
                      pointerEvents: 'none',
                      animation: 'pour 1.5s ease-in-out'
                    }}
                  />
                )}

                
                {/* Progress Bar */}
                {(totalLiquidLevel > 0 || isPouring) && (
                  <div style={{ marginTop: '10px', width: `${layout.cupOnCounter.width}px` }}>
                    <div style={{
                      width: '100%',
                      height: '15px',
                      backgroundColor: '#ddd',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(totalLiquidLevel, 100)}%`,
                        height: '100%',
                        backgroundColor: totalLiquidLevel > 100 ? '#e74c3c' : 
                                       hotMilkLevel > 0 && coffeeLevel > 0 ? '#8b6f47' :
                                       coffeeLevel > 0 ? '#6b4423' : '#f5deb3',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <p style={{ margin: '5px 0', fontSize: '12px', fontWeight: 'bold' }}>
                      {totalLiquidLevel}%
                    </p>
                  </div>
                )}
              </>
            ) : (
              <span style={{ color: '#95a5a6', textAlign: 'center' }}>
                ☕<br/><small>Place cup here</small>
              </span>
            )}
          </DropZone>
        </div>
      </div>

            {/* KETTLE HOVERING OVER CUP - when ready to pour */}
        {readyToPour && kettleLocation === 'stove' && (
          <div style={{
            position: 'absolute',
            left: `${layout.cupDropZone.x + 50}px`, // Center over cup
            top: `${layout.cupDropZone.y - 80}px`, // Hover above cup
            textAlign: 'center',
            zIndex: 30,
            pointerEvents: 'none'
          }}>
            <img
              src={isPouring ? assets.objects.kettle.pouring : assets.objects.kettle.hot}
              alt="Kettle Pouring"
              style={{
                width: '120px',
                filter: 'drop-shadow(0 0 15px rgba(255, 100, 0, 0.9))',
                animation: isPouring ? 'none' : 'float 2s ease-in-out infinite'
              }}
            />
          </div>
        )}


      {/* Interactive Pouring Control - SIMPLIFIED */}
      {readyToPour && cupLocation === 'counter' && hotMilkLevel < 100 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '15px 25px',
          backgroundColor: 'rgba(123, 170, 202, 0.95)',
          borderRadius: '10px',
          boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
          marginTop: '-240px',
          zIndex: 9999,
            position: 'relative'
        }}>
          <p style={{ 
            margin: 0, 
            fontWeight: 'bold', 
            fontSize: '14px',
            color: 'white'
          }}>
            Pour the kettle!
          </p>
          
          <button 
            onMouseDown={handleStartPouring}
            onMouseUp={handleStopPouring}
            onMouseLeave={handleStopPouring}
            onTouchStart={handleStartPouring}
            onTouchEnd={handleStopPouring}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: isPouring ? '#e67e22' : '#23455cff',
              color: 'white',
              border: isPouring ? '3px solid #9f62dfff' : '3px solid #c1e0f5ff',
              borderRadius: '8px',
              fontWeight: 'bold',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              transition: 'all 0.1s',
              userSelect: 'none'
            }}
          >
            {isPouring ? '🥛 Pouring...' : 'HOLD to Pour'}
          </button>

          {/* Simple Progress Bar */}
          <div style={{ width: '200px' }}>
            <div style={{
              width: '100%',
              height: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '2px solid white'
            }}>
              <div style={{
                width: `${hotMilkLevel}%`,
                height: '100%',
                backgroundColor: hotMilkLevel >= 80 ? '#599873ff' : '#104a71ff',
                transition: 'width 0.2s'
              }} />
            </div>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '12px', 
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center'
            }}>
              {Math.round(hotMilkLevel)}%
            </p>
          </div>
        </div>
      )}


      {/* Stir Button */}
      {chocolateAdded && cupLocation === 'counter' && !isStirring && stirringDuration < 3 && (
        <button 
          onMouseDown={() => setIsStirring(true)}
          onMouseUp={() => setIsStirring(false)}
          onMouseLeave={() => setIsStirring(false)}
          onTouchStart={() => setIsStirring(true)}
          onTouchEnd={() => setIsStirring(false)}
          style={{
            padding: '20px 40px',
            fontSize: '18px',
            cursor: 'pointer',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.2s'
          }}
        >
          HOLD to Stir 🥄 ({stirringDuration}/3s)
        </button>
      )}

      

     {/* Action Buttons - TEST: Always show */}
<div style={{
  position: 'absolute',
  bottom: '40px',
  left: '   50%',

  zIndex: 9999
}}>      

{/* Done Button - Forward to Toppings */}
{getDrinkType() && (
  <img
    src={forwardButtonPressed ? assets.ui.buttons.forward.pressed : assets.ui.buttons.forward.normal}
    alt="Add Toppings"
    onMouseDown={() => !overflowed && stoveState !== 'fire' && setForwardButtonPressed(true)}
    onMouseUp={() => {
      setForwardButtonPressed(false);
      if (!overflowed && stoveState !== 'fire') {
        handleComplete();
      }
    }}
    onMouseLeave={() => setForwardButtonPressed(false)}
    onTouchStart={() => !overflowed && stoveState !== 'fire' && setForwardButtonPressed(true)}
    onTouchEnd={() => {
      setForwardButtonPressed(false);
      if (!overflowed && stoveState !== 'fire') {
        handleComplete();
      }
    }}
    style={{
          position: 'absolute',
          left: `${layout.buttons.forward.x}px`,
          top: `${layout.buttons.forward.y}px`,
      transform: 'translateX(-50%)',
      width: '200px',
      cursor: overflowed || stoveState === 'fire' ? 'not-allowed' : 'pointer',
      transition: 'transform 0.1s',
    //   transform: forwardButtonPressed && !overflowed && stoveState !== 'fire' ? 
    //              'translateX(-50%) scale(0.95)' : 'translateX(-50%) scale(1)',
      opacity: overflowed || stoveState === 'fire' ? 0.5 : 1,
      userSelect: 'none',
      pointerEvents: overflowed || stoveState === 'fire' ? 'none' : 'auto',
      zIndex: 9999
    }}
  />
)}




</div> 

      
    </div>


  );
};

export default DrinkMakingStation;