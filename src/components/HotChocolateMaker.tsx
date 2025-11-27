import { useState, useEffect } from "react";
import type { ExtraType } from "../types";
import { useAssets } from '../hooks/useAssets';
import { useLayouts } from '../hooks/useLayouts';
import DraggableImage from './DraggableImage';
import DropZone from './DropZone';

interface HotChocolateMakerProps {
  onComplete: (metrics: {
    milkLevel: number;
    temperature: number;
    stirringDuration: number;
    overflowed: boolean;
  }) => void;
  onCancel: () => void;
  onSwitchToCoffee?: () => void;
  hasOtherBase?: boolean;
}

const HotChocolateMaker = ({ 
  onComplete, 
  onCancel, 
  onSwitchToCoffee,  
  hasOtherBase = false 
}: HotChocolateMakerProps) => {
  const { assets } = useAssets();
  const { layouts } = useLayouts();
  
  const layout = layouts.makingScene.coffeeMakerScene;
  
  // State
  const [cupLocation, setCupLocation] = useState<'stack' | 'counter' | null>(null);
  const [milkInKettle, setMilkInKettle] = useState(false);
  const [kettleLocation, setKettleLocation] = useState<'counter' | 'stove' | null>('counter');
  const [kettleState, setKettleState] = useState<'regular' | 'hot' | 'pouring'>('regular');
  const [stoveOn, setStoveOn] = useState(false);
  const [stoveState, setStoveState] = useState<'off' | 'on' | 'fire'>('off');
  const [heatingTime, setHeatingTime] = useState(0); // Track heating seconds
  const [milkLevel, setMilkLevel] = useState(0);
  const [overflowed, setOverflowed] = useState(false);
  const [pouringMilk, setPouringMilk] = useState(false);
  
  // Chocolate & Spoon
  const [spoonLocation, setSpoonLocation] = useState<'counter' | 'bowl' | 'cup' | null>('counter');
  const [spoonState, setSpoonState] = useState<'empty' | 'full'>('empty');
  const [chocolateAdded, setChocolateAdded] = useState(false);
  
  // Stirring
  const [isStirring, setIsStirring] = useState(false);
  const [stirringDuration, setStirringDuration] = useState(0);
  const [stirringAngle, setStirringAngle] = useState(0);

  // Toggle stove
  const handleStoveToggle = () => {
    if (stoveState === 'off') {
      setStoveOn(true);
      setStoveState('on');
    } else if (stoveState === 'on' || stoveState === 'fire') {
      setStoveOn(false);
      setStoveState('off');
      setHeatingTime(0);
    }
  };

  // Add milk to kettle
  const handleAddMilkToKettle = () => {
    if (!milkInKettle) {
      setMilkInKettle(true);
    }
  };

  // Pour hot milk
  const handlePourMilk = () => {
    if (kettleState === 'hot' && cupLocation === 'counter' && !pouringMilk && !overflowed) {
      setPouringMilk(true);
      setKettleState('pouring');
      
      // Pour for 3 seconds
      setTimeout(() => {
        setPouringMilk(false);
        setKettleState('regular');
        setKettleLocation('counter');
      }, 3000);
    }
  };

  // Fill spoon with chocolate
  const handleFillSpoon = () => {
    if (spoonState === 'empty') {
      setSpoonState('full');
    }
  };

  // Add chocolate to cup
  const handleAddChocolate = () => {
    if (spoonState === 'full' && cupLocation === 'counter' && milkLevel > 0 && !chocolateAdded) {
      setChocolateAdded(true);
      setSpoonState('empty');
      setSpoonLocation('counter');
    }
  };

  // Complete
  const handleComplete = () => {
    if (stoveState === 'fire') {
      return; // Can't complete if there's a fire!
    }
    if (stirringDuration >= 3 && !overflowed && chocolateAdded) {
      onComplete({
        milkLevel,
        temperature: kettleState === 'hot' ? 160 : 0,
        stirringDuration,
        overflowed
      });
    }
  };

  // Heating timer - kettle gets hot after 5 seconds
  useEffect(() => {
    if (stoveOn && milkInKettle && kettleLocation === 'stove' && kettleState === 'regular') {
      const interval = setInterval(() => {
        setHeatingTime((prev) => {
          const newTime = prev + 1;
          
          // Kettle becomes hot after 5 seconds
          if (newTime >= 5) {
            setKettleState('hot');
            return prev; // Stop counting
          }
          
          return newTime;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [stoveOn, milkInKettle, kettleLocation, kettleState]);

  // Fire timer - if stove stays on after kettle is hot
  useEffect(() => {
    if (kettleState === 'hot' && stoveOn && kettleLocation === 'stove') {
      const fireTimer = setTimeout(() => {
        setStoveState('fire');
      }, 5000); // 5 seconds after hot

      return () => clearTimeout(fireTimer);
    }
  }, [kettleState, stoveOn, kettleLocation]);

  // Milk fills up while pouring
  useEffect(() => {
    if (pouringMilk) {
      const maxLevel = hasOtherBase ? 50 : 100;
      
      const interval = setInterval(() => {
        setMilkLevel((prev) => {
          const newLevel = prev + 15;
          if (newLevel >= maxLevel + 40) {
            setOverflowed(true);
            setPouringMilk(false);
            return maxLevel;
          }
          return newLevel;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [pouringMilk, hasOtherBase]);

  // Stirring timer
  useEffect(() => {
    if (isStirring) {
      const interval = setInterval(() => {
        setStirringDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isStirring]);

  // Stirring animation
  useEffect(() => {
    if (isStirring) {
      const interval = setInterval(() => {
        setStirringAngle((prev) => (prev + 45) % 360);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isStirring]);

  return (
    <div className="hot-chocolate-maker" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '30px',
      padding: '20px',
      position: 'relative',
      minHeight: '600px'
    }}>
      <h2>Making Hot Chocolate</h2>
      
      {stoveState === 'fire' && (
        <div style={{color: 'red', fontWeight: 'bold', fontSize: '20px', textAlign: 'center'}}>
          <p>🔥 FIRE! THE STOVE IS ON FIRE! 🔥</p>
          <p>Click the stove to turn it off!</p>
        </div>
      )}

      {overflowed && (
        <p style={{color: 'red', fontWeight: 'bold', fontSize: '20px'}}>
          🥛 MILK OVERFLOWED! Start over.
        </p>
      )}

      {/* Main Layout */}
      <div style={{ 
        position: 'relative',
        width: `${layouts.makingScene.container.width}px`,
        height: `${layouts.makingScene.container.height}px`,
        margin: '0 auto'
      }}>
        
        {/* Cup Stack */}
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
            Drag cup to counter
          </p>
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
              cursor: milkInKettle ? 'not-allowed' : 'grab',
              filter: milkInKettle ? 'grayscale(100%) opacity(0.5)' : 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
            }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            {milkInKettle ? '✓ In kettle' : 'Drag to kettle'}
          </p>
        </div>

        {/* Counter */}
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
            🪵 Counter
          </p>

          {/* STOVE */}
          <div style={{
            position: 'absolute',
            left: `${layout.counter.stove.x}px`,
            top: `${layout.counter.stove.y}px`,
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
              Stove {stoveState === 'on' ? '(ON 🔥)' : stoveState === 'fire' ? '(FIRE! 🔥🔥🔥)' : '(OFF)'}
            </p>
            <div style={{ position: 'relative' }}>
              <img
                src={
                  stoveState === 'fire' ? assets.objects.stove.fire :
                  stoveState === 'on' ? assets.objects.stove.on :
                  assets.objects.stove.off
                }
                alt="Stove"
                onClick={handleStoveToggle}
                style={{
                  width: `${layout.counter.stove.width}px`,
                  cursor: 'pointer',
                  filter: stoveState === 'on' ? 'drop-shadow(0 0 10px rgba(255, 100, 0, 0.8))' : 
                          stoveState === 'fire' ? 'drop-shadow(0 0 20px rgba(255, 0, 0, 1))' : 'none',
                  transition: 'all 0.3s',
                  animation: stoveState === 'fire' ? 'shake 0.3s infinite' : 'none'
                }}
              />
              
              {/* Kettle Drop Zone on Stove */}
              <DropZone
                onDrop={(data) => {
                  if (data.type === 'kettle' && milkInKettle) {
                    setKettleLocation('stove');
                    setHeatingTime(0); // Reset heating timer
                  }
                }}
                accepts={['kettle']}
                style={{
                  position: 'absolute',
                  left: `${layout.counter.stove.kettleOnStove.x}px`,
                  top: `${layout.counter.stove.kettleOnStove.y}px`,
                  width: '80px',
                  height: '80px',
                  borderWidth: kettleLocation === 'stove' ? '0' : '2px',
                  borderStyle: kettleLocation === 'stove' ? 'none' : 'dashed',
                  borderColor: 'orange',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: kettleLocation === 'stove' ? 'transparent' : 'rgba(255, 165, 0, 0.1)'
                }}
                highlightStyle={{
                  backgroundColor: 'rgba(255, 165, 0, 0.3)',
                  borderColor: 'orange',
                  borderStyle: 'solid'
                }}
              >
                {kettleLocation === 'stove' ? (
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
                      width: '70px',
                      filter: kettleState === 'hot' ? 'drop-shadow(0 0 12px rgba(255, 100, 0, 0.8))' : 
                              stoveOn ? 'drop-shadow(0 0 6px rgba(255, 165, 0, 0.5))' : 'none',
                      cursor: kettleState === 'hot' ? 'grab' : 'not-allowed'
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '10px', color: 'orange' }}>Drop kettle</span>
                )}
              </DropZone>
              
              {/* Heating Progress */}
              {kettleLocation === 'stove' && milkInKettle && stoveOn && kettleState === 'regular' && (
                <div style={{
                  position: 'absolute',
                  bottom: '-35px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#e67e22',
                  textAlign: 'center'
                }}>
                  Heating... {heatingTime}/5s
                </div>
              )}
              
              {/* Hot Indicator */}
              {kettleState === 'hot' && kettleLocation === 'stove' && (
                <div style={{
                  position: 'absolute',
                  bottom: '-35px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#e74c3c',
                  textAlign: 'center'
                }}>
                  ♨️ HOT! Drag to cup
                </div>
              )}
            </div>
          </div>

          {/* KETTLE - when on counter */}
          {kettleLocation === 'counter' && (
            <div style={{
              position: 'absolute',
              left: `${layout.counter.kettle.x}px`,
              top: `${layout.counter.kettle.y}px`,
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
                Kettle {milkInKettle ? '(Has milk)' : '(Empty)'}
              </p>
              
              <DropZone
                onDrop={(data) => {
                  if (data.type === 'milk' && !milkInKettle) {
                    handleAddMilkToKettle();
                  }
                }}
                accepts={['milk']}
                style={{
                  display: 'inline-block',
                  position: 'relative'
                }}
                highlightStyle={{
                  filter: 'brightness(1.2)'
                }}
              >
                <DraggableImage
                  src={assets.objects.kettle.regular}
                  alt="Kettle"
                  dragData={{ type: 'kettle' }}
                  style={{
                    width: `${layout.counter.kettle.width}px`,
                    cursor: milkInKettle ? 'grab' : 'not-allowed',
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
                    opacity: milkInKettle ? 1 : 0.6
                  }}
                />
              </DropZone>
              
              <p style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
                {!milkInKettle ? 'Add milk first' : 'Place on stove'}
              </p>
            </div>
          )}

          {/* CHOCOLATE BOWL */}
          <div style={{
            position: 'absolute',
            left: `${layout.counter.chocolate.bowl.x}px`,
            top: `${layout.counter.chocolate.bowl.y}px`,
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
              Hot Chocolate Powder
            </p>
            
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
                  width: `${layout.counter.chocolate.bowl.width}px`,
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                }}
              />
            </DropZone>
            
            <p style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
              Drag spoon here
            </p>
          </div>

          {/* SPOON - when on counter */}
          {spoonLocation === 'counter' && (
            <div style={{
              position: 'absolute',
              left: `${layout.counter.chocolate.spoon.x}px`,
              top: `${layout.counter.chocolate.spoon.y}px`,
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
                Spoon
              </p>
              <DraggableImage
                src={
                  spoonState === 'full' ? assets.objects.spoon.full :
                  assets.objects.spoon.empty
                }
                alt="Spoon"
                dragData={{ 
                  type: spoonState === 'full' ? 'spoon-full' : 'spoon-empty'
                }}
                onDragStart={() => {
                  if (spoonState === 'empty') {
                    setSpoonLocation('bowl');
                  } else {
                    setSpoonLocation('cup');
                  }
                }}
                onDragEnd={() => {
                  // Return to counter if not successfully placed
                  setTimeout(() => {
                    if (spoonLocation === 'bowl' && spoonState === 'empty') {
                      setSpoonLocation('counter');
                    } else if (spoonLocation === 'cup' && spoonState === 'full') {
                      setSpoonLocation('counter');
                    }
                  }, 100);
                }}
                style={{
                  width: `${layout.counter.chocolate.spoon.width}px`,
                  cursor: 'grab',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                }}
              />
              <p style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
                {spoonState === 'empty' ? 'Drag to bowl' : 'Drag to cup'}
              </p>
            </div>
          )}
          
          {/* Cup Drop Zone on Counter */}
          <DropZone
            onDrop={(data) => {
              if (data.type === 'cup') {
                setCupLocation('counter');
              }
              // Handle hot kettle pour
              if (data.type === 'hot-kettle' && cupLocation === 'counter') {
                handlePourMilk();
              }
              // Handle spoon with chocolate
              if (data.type === 'spoon-full' && cupLocation === 'counter' && milkLevel > 0) {
                handleAddChocolate();
              }
            }}
            accepts={['cup', 'hot-kettle', 'spoon-full']}
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
                <img
                  src={
                    overflowed ? assets.objects.cup.overflow :
                    milkLevel >= 90 ? assets.objects.cup.coffee_full :
                    assets.objects.cup.empty
                  }
                  alt="Cup on Counter"
                  style={{ 
                    width: `${layout.counter.cupOnCounter.width}px`,
                    filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))'
                  }}
                />
                
                {/* Pouring Milk Animation */}
                {pouringMilk && (
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
                      animation: 'pour 3s ease-in-out'
                    }}
                  />
                )}

                {/* Stirring Spoon Animation */}
                {isStirring && chocolateAdded && (
                  <img
                    src={assets.objects.spoon.stirring || assets.objects.spoon.full}
                    alt="Stirring"
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '50%',
                      transform: `translateX(-50%) rotate(${stirringAngle}deg)`,
                      transformOrigin: 'center',
                      width: '40px',
                      zIndex: 25,
                      pointerEvents: 'none',
                      transition: 'transform 0.1s linear'
                    }}
                  />
                )}
                
                {/* Progress Bar */}
                {milkLevel > 0 && (
                  <div style={{ marginTop: '10px', width: `${layout.counter.cupOnCounter.width}px` }}>
                    <div style={{
                      width: '100%',
                      height: '15px',
                      backgroundColor: '#ddd',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(milkLevel, 100)}%`,
                        height: '100%',
                        backgroundColor: milkLevel > 100 ? '#e74c3c' : '#f5deb3',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <p style={{ margin: '5px 0', fontSize: '12px', fontWeight: 'bold' }}>
                      {milkLevel}%
                    </p>
                  </div>
                )}
              </>
            ) : (
              <span style={{ color: '#8b4513', textAlign: 'center' }}>
                ☕<br/><small>Drag cup here</small>
              </span>
            )}
          </DropZone>
        </div>
      </div>

      {/* Stir Button */}
      {chocolateAdded && cupLocation === 'counter' && (
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
            backgroundColor: isStirring ? '#e67e22' : '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.2s'
          }}
        >
          {stirringDuration > 0 ? `Stirring... ${stirringDuration}s` : "HOLD to Stir 🥄"}
        </button>
      )}

      {/* Mocha Option */}
      {stirringDuration >= 3 && onSwitchToCoffee && (
        <button 
          onClick={onSwitchToCoffee}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: '#6b4423',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Add Coffee (for Mocha) →
        </button>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <button 
          onClick={handleComplete}
          disabled={stirringDuration < 3 || overflowed || stoveState === 'fire'}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            backgroundColor: stirringDuration < 3 || overflowed || stoveState === 'fire' ? '#ccc' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: stirringDuration < 3 || overflowed || stoveState === 'fire' ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: stirringDuration < 3 || overflowed || stoveState === 'fire' ? 'none' : '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          Done! ✓ {stirringDuration < 3 && `(${3 - stirringDuration}s more)`}
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

export default HotChocolateMaker;