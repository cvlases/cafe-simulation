import { useState, useEffect } from "react";
import type { ExtraType } from "../types";
import { useAssets } from '../hooks/useAssets';
import { useLayouts } from '../hooks/useLayouts';
import DraggableImage from './DraggableImage';
import DropZone from './DropZone';

 // Global state to track what's being dragged (since browsers restrict getData during dragover)
let currentlyDragging: string | null = null;


interface ToppingStationProps {
  currentToppings: ExtraType[];
  onAddTopping: (topping: ExtraType) => void;
  onComplete: (metrics: {
    whippedCreamFirst: boolean;
    whippedCreamDuration: number;
  }) => void;
  onCancel: () => void;
  drinkType?: 'coffee' | 'hot-chocolate' | 'mocha';
}

const ToppingStation = ({ 
  currentToppings, 
  onAddTopping, 
  onComplete, 
  onCancel,
  drinkType = 'hot-chocolate'
}: ToppingStationProps) => {
  const { assets } = useAssets();
  const { layouts } = useLayouts();
  
  const layout = layouts.toppingStation;
  
  // Topping states
  const [whippingCream, setWhippingCream] = useState(false);
  const [whippedCreamDuration, setWhippedCreamDuration] = useState(0);
  // const [scoopingMarshmallows, setScoopingMarshmallows] = useState(false);
  const [shakingSprinkles, setShakingSprinkles] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  // Button states
  const [forwardButtonPressed, setForwardButtonPressed] = useState(false);
  const [backButtonPressed, setBackButtonPressed] = useState(false);
  
  // Track positions for interactive dragging
  const [whippedCreamOverCup, setWhippedCreamOverCup] = useState(false);
  // const [marshmallowScoopOverCup, setMarshmallowScoopOverCup] = useState(false);
  const [sprinklesOverCup, setSprinklesOverCup] = useState(false);
  // const [trashHover, setTrashHover] = useState(false);

  const hasWhippedCream = currentToppings.includes("whipped-cream");
  const hasMarshmallows = currentToppings.includes("marshmallows");
  const hasSprinkles = currentToppings.includes("sprinkles");
  const hasOtherToppings = hasMarshmallows || hasSprinkles;

  // Get the correct cup image based on toppings
  const getCupImage = () => {
    // Start with the finished drink base
    let baseImage = drinkType === 'mocha' ? assets.objects.cup.mocha_done :
                    drinkType === 'coffee' ? assets.objects.cup.coffee_done :
                    assets.objects.cup.hot_chocolate_done;
    
    // Apply toppings in order
    if (hasWhippedCream && hasMarshmallows && hasSprinkles) {
      return assets.objects.cup.with_whipped_cream_marshmallows_sprinkles;
    }
    if (hasWhippedCream && hasMarshmallows) {
      return assets.objects.cup.with_whipped_cream_marshmallows;
    }
    if (hasWhippedCream && hasSprinkles) {
      return assets.objects.cup.with_whipped_cream_sprinkles;
    }
    if (hasMarshmallows && hasSprinkles) {
      return assets.objects.cup.with_marshmallows_sprinkles;
    }
    if (hasWhippedCream) {
      return assets.objects.cup.with_whipped_cream;
    }
    if (hasMarshmallows) {
      return assets.objects.cup.with_marshmallows;
    }
    if (hasSprinkles) {
      return assets.objects.cup.with_sprinkles;
    }
    
    return baseImage;
  };

  // Whipped cream hold timer
  useEffect(() => {
    if (whippingCream) {
      const interval = setInterval(() => {
        setWhippedCreamDuration((prev) => prev + 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [whippingCream]);

  // Auto-add whipped cream after 2 seconds of whipping
  useEffect(() => {
    if (whippedCreamDuration >= 2000 && !hasWhippedCream && whippedCreamOverCup) {
      onAddTopping("whipped-cream");
      setWhippingCream(false);
      setWhippedCreamDuration(0);
      setWhippedCreamOverCup(false);
    }
  }, [whippedCreamDuration, hasWhippedCream, whippedCreamOverCup, onAddTopping]);

  // Handle whipped cream drag over cup
  // const handleWhippedCreamDrag = (isOver: boolean) => {
  //   setWhippedCreamOverCup(isOver);
  //   if (!isOver) {
  //     setWhippingCream(false);
  //     setWhippedCreamDuration(0);
  //   }
  // };

  const handleMarshmallowScoop = () => {
  console.log("🍬 Marshmallow scoop dropped");
  if (!hasMarshmallows) {
    onAddTopping("marshmallows");
    // setMarshmallowScoopOverCup(false);
  }
};

const handleSprinkleShake = () => {
  console.log("✨ Sprinkle shake handler called", { hasSprinkles, sprinklesOverCup, shakeCount });
  if (!hasSprinkles) {  // ← Simplified
    setShakingSprinkles(true);
    setShakeCount((prev) => {
      const newCount = prev + 1;
      console.log(`Shake count: ${newCount}/3`);
      return newCount;
    });
    
    setTimeout(() => {
      setShakingSprinkles(false);
    }, 300);
    
    // Add sprinkles after 3 shakes
    if (shakeCount >= 2) {
      setTimeout(() => {
        console.log("✅ Adding sprinkles!");
        onAddTopping("sprinkles");
        setSprinklesOverCup(false);
        setShakeCount(0);
      }, 500);
    }
  }
};

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '20px',
      position: 'relative',
      minHeight: '600px'
    }}>
      <h2>Add Toppings ᵔ ᵕ ᵔ</h2>
      


      {/* Main Layout */}
      <div style={{ 
        position: 'relative',
        width: `${layout.container.width}px`,
        height: `${layout.container.height}px`,
        margin: '0 auto'
      }}>
        
        {/* Whipped Cream Canister */}
        <div style={{
          position: 'absolute',
          left: `${layout.whippedCream.x}px`,
          top: `${layout.whippedCream.y}px`,
          textAlign: 'center'
        }}>

          <DraggableImage
        src={whippingCream ? assets.objects.toppings.whippedCream.dispensing : 
            assets.objects.toppings.whippedCream.canister}
        draggingSrc={assets.objects.toppings.whippedCream.dispensing}
        alt="Whipped Cream"
        dragData={{ type: 'whipped-cream' }}
        onDragStart={() => {
          console.log("🔵 Started dragging whipped cream"); // DEBUG
          currentlyDragging = 'whipped-cream';
          if (!hasWhippedCream && !hasOtherToppings) {
            setWhippingCream(false);
          }
        }}
        onDragEnd={() => {
          console.log("🔴 Stopped dragging whipped cream"); // DEBUG
          currentlyDragging = null;
        }}
        style={{
              width: `${layout.whippedCream.width}px`,
              cursor: hasWhippedCream || hasOtherToppings ? 'not-allowed' : 'grab',
              filter: hasWhippedCream || hasOtherToppings ? 'grayscale(100%) opacity(0.5)' : 
                      'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              pointerEvents: hasWhippedCream || hasOtherToppings ? 'none' : 'auto'
            }}
          />
          <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
            {hasWhippedCream ? 'Added!' : 
             hasOtherToppings ? 'Too late!' : 
             'Drag & hold over cup'}
          </p>
        </div>

{/* Marshmallows Container */}
<div style={{
  position: 'absolute',
  left: `${layout.marshmallows.x}px`,
  top: `${layout.marshmallows.y}px`,
  textAlign: 'center'
}}>

  <img
    src={assets.objects.toppings.marshmallows.container}
    alt="Marshmallows Container"
    style={{
      width: `${layout.marshmallows.width}px`,
      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
      opacity: hasMarshmallows ? 0.5 : 1
    }}
  />

</div>

{/* Marshmallow Scoop - Separate item, OUTSIDE marshmallows div */}
{!hasMarshmallows && (
  <div style={{
    position: 'absolute',
    left: `${layout.scoop.x}px`,
    top: `${layout.scoop.y}px`,
    textAlign: 'center'
  }}>

    <DraggableImage
      src={assets.objects.toppings.marshmallows.scoop}
      draggingSrc={assets.objects.toppings.marshmallows.scooping}
      alt="Marshmallow Scoop"
      dragData={{ type: 'marshmallow-scoop' }}
      onDragStart={() => {
        console.log("🔵 Started dragging marshmallow scoop");
        currentlyDragging = 'marshmallow-scoop';
      }}
      onDragEnd={() => {
        console.log("🔴 Stopped dragging marshmallow scoop");
        currentlyDragging = null;
      }}
      style={{
        width: `${layout.scoop.width}px`,
        cursor: 'grab',
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
      }}
    />
    <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
      Drag to cup
    </p>
  </div>
)}


        {/* Sprinkles Jar */}
        <div style={{
          position: 'absolute',
          left: `${layout.sprinkles.x}px`,
          top: `${layout.sprinkles.y}px`,
          textAlign: 'center'
        }}>

          <DraggableImage
  src={shakingSprinkles ? assets.objects.toppings.sprinkles.shaking :
       assets.objects.toppings.sprinkles.jar}
  draggingSrc={assets.objects.toppings.sprinkles.jar}
  alt="Sprinkles"
  dragData={{ type: 'sprinkles' }}
  onDragStart={() => {
    console.log("🔵 Started dragging sprinkles"); // DEBUG
    currentlyDragging = 'sprinkles';
  }}
  onDragEnd={() => {
    console.log("🔴 Stopped dragging sprinkles"); // DEBUG
    currentlyDragging = null;
  }}
  style={{
              width: `${layout.sprinkles.width}px`,
              cursor: hasSprinkles ? 'not-allowed' : 'grab',
              filter: hasSprinkles ? 'grayscale(100%) opacity(0.5)' : 
                      'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              animation: shakingSprinkles ? 'shake 0.3s' : 'none',
              pointerEvents: hasSprinkles ? 'none' : 'auto'
            }}
          />
          <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
            {hasSprinkles ? 'Added!' : 
             shakeCount > 0 ? `Shake ${3 - shakeCount} more times` :
             'Drag & shake over cup'}
          </p>
        </div>
        {/* Trash Can */}
      <div style={{
        position: 'absolute',
        left: `${layout.trash.x}px`,
        top: `${layout.trash.y}px`,
        textAlign: 'center'
      }}>

        <DropZone
          onDrop={(data) => {
            if (data.type === 'cup-to-trash') {
              console.log("Cup thrown in trash - restarting!");
              onCancel(); // This calls the restart function
            }
          }}
          // onDragEnter={() => setTrashHover(true)}
          // onDragLeave={() => setTrashHover(false)}
          accepts={['cup-to-trash']}
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

      </div>


        {/* Cup Drop Zone */}
        <div style={{
          position: 'absolute',
          left: `${layout.cupArea.x}px`,
          top: `${layout.cupArea.y}px`,
          textAlign: 'center'
        }}>

          <DropZone
  onDrop={(data) => {
    console.log("💧 DROP EVENT:", data); // DEBUG
    if (data.type === 'whipped-cream') {
      console.log("Whipped cream dropped!");
    }
    if (data.type === 'marshmallow-scoop') {
      console.log("Marshmallow scoop dropped!");
      handleMarshmallowScoop();
    }
    if (data.type === 'sprinkles') {
      console.log("Sprinkles dropped!");
      handleSprinkleShake();
    }
  }}
  onDragEnter={(_data) => {
    console.log("⬇️ DRAG ENTER:", currentlyDragging); // DEBUG
    // Use global state instead of data.type
    if (currentlyDragging === 'whipped-cream') {
      setWhippedCreamOverCup(true);
      if (!hasWhippedCream && !hasOtherToppings) {
        setWhippingCream(true);
        console.log("✅ Started whipping!");
      }
    }
    // if (currentlyDragging === 'marshmallow-scoop') {
    //   setMarshmallowScoopOverCup(true);
    // }
    if (currentlyDragging === 'sprinkles') {
      setSprinklesOverCup(true);
    }
  }}
  onDragLeave={() => {
    console.log("⬆️ DRAG LEAVE"); // DEBUG
    setWhippedCreamOverCup(false);
    // setMarshmallowScoopOverCup(false);
    setSprinklesOverCup(false);
    setWhippingCream(false);
  }}
  accepts={['whipped-cream', 'marshmallow-scoop', 'sprinkles']}
            style={{
              width: `${layout.cupArea.width}px`,
              height: `${layout.cupArea.height}px`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: '3px',
              borderStyle: 'dashed',
              borderColor: '#27ae60',
              borderRadius: '10px',
              backgroundColor: 'rgba(39, 174, 96, 0.05)',
              transition: 'all 0.3s',
              position: 'relative'
            }}
            highlightStyle={{
              backgroundColor: 'rgba(39, 174, 96, 0.2)',
              borderColor: '#27ae60',
              borderStyle: 'solid'
            }}
          >
            <DraggableImage
            src={getCupImage()}
            alt="Cup with toppings"
            dragData={{ type: 'cup-to-trash' }}
            style={{
              width: `${layout.cupOnStation.width}px`,
              filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))',
              cursor: 'grab'
            }}
          />
            
            {/* Whipping animation overlay */}
            {whippingCream && whippedCreamOverCup && (
              <div style={{
                position: 'absolute',
                top: '-60px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120px',
                zIndex: 20
              }}>
                <img
                  src={assets.objects.toppings.whippedCream.dispensing}
                  alt="Dispensing"
                  style={{
                    width: '100%',
                    animation: 'shake 0.2s infinite'
                  }}
                />
                <div style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  backgroundColor: 'rgba(52, 152, 219, 0.9)',
                  color: 'white',
                  borderRadius: '5px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {Math.round(whippedCreamDuration / 2000 * 100)}%
                </div>
              </div>
            )}


            {/* Sprinkles shaking overlay - ADD THIS */}
{sprinklesOverCup && (
  <div style={{
    position: 'absolute',
    top: '-80px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    zIndex: 20
  }}>
    <img
      src={shakingSprinkles ? assets.objects.toppings.sprinkles.shaking : 
           assets.objects.toppings.sprinkles.jar}
      alt="Sprinkling"
      style={{
        width: '100%',
        animation: shakingSprinkles ? 'shake 0.3s infinite' : 'none'
      }}
    />
    {shakeCount > 0 && (
      <div style={{
        marginTop: '10px',
        padding: '5px 10px',
        backgroundColor: 'rgba(231, 76, 60, 0.9)',
        color: 'white',
        borderRadius: '5px',
        fontSize: '12px',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        Shake {shakeCount}/3 ✨
      </div>
    )}
  </div>
)}
            </DropZone>
           
            
               
    
          
          {/* Toppings list */}
          <div style={{ marginTop: '15px' }}>
            <p style={{ fontSize: '14px', fontWeight: 'bold' }}>
              Toppings: {currentToppings.length > 0 ? currentToppings.join(", ") : "None"}
            </p>
          </div>
        </div>
      </div>


      

      {/* Control Buttons - Absolutely positioned from JSON */}
<>
  {/* Forward Button - Finish Drink */}
  <img
    src={forwardButtonPressed ? assets.ui.buttons.forward.pressed : assets.ui.buttons.forward.normal}
    alt="Finish Drink"
    onMouseDown={() => setForwardButtonPressed(true)}
    onMouseUp={() => {
      setForwardButtonPressed(false);
      const whippedCreamFirst = currentToppings.length === 0 || currentToppings[0] === "whipped-cream";
      onComplete({
        whippedCreamFirst,
        whippedCreamDuration
      });
    }}
    onMouseLeave={() => setForwardButtonPressed(false)}
    onTouchStart={() => setForwardButtonPressed(true)}
    onTouchEnd={() => {
      setForwardButtonPressed(false);
      const whippedCreamFirst = currentToppings.length === 0 || currentToppings[0] === "whipped-cream";
      onComplete({
        whippedCreamFirst,
        whippedCreamDuration
      });
    }}
    style={{
      position: 'absolute',
      left: `${layout.buttons.forward.x}px`,
      top: `${layout.buttons.forward.y}px`,
      width: `${layout.buttons.forward.width}px`,
      cursor: 'pointer',
      transition: 'transform 0.1s',
      transform: forwardButtonPressed ? 'scale(0.95)' : 'scale(1)',
      userSelect: 'none',
      zIndex: 9990
    }}
  />

  {/* Back Button - Go back to making */}
  <img
    src={backButtonPressed ? assets.ui.buttons.back.pressed : assets.ui.buttons.back.normal}
    alt="Back to Making"
    onMouseDown={() => setBackButtonPressed(true)}
    onMouseUp={() => {
      setBackButtonPressed(false);
      onCancel();
    }}
    onMouseLeave={() => setBackButtonPressed(false)}
    onTouchStart={() => setBackButtonPressed(true)}
    onTouchEnd={() => {
      setBackButtonPressed(false);
      onCancel();
    }}
    style={{
      position: 'absolute',
      left: `${layout.buttons.back.x}px`,
      top: `${layout.buttons.back.y}px`,
      width: `${layout.buttons.back.width}px`,
      cursor: 'pointer',
      transition: 'transform 0.1s',
      transform: backButtonPressed ? 'scale(0.95)' : 'scale(1)',
      userSelect: 'none',
      zIndex: 9999
    }}
  />
</>

{/* Serve Button - Always available */}
<div style={{
  position: 'fixed',
  bottom: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '20px',
  zIndex: 9999
}}>
  <button
    onClick={() => {
      const whippedCreamFirst = currentToppings.length === 0 || currentToppings[0] === "whipped-cream";
      onComplete({
        whippedCreamFirst,
        whippedCreamDuration
      });
    }}
    style={{
      padding: '10px 30px',
      fontSize: '20px',
      backgroundColor: '#9cc4ffff',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: 'bold',

    }}
  >
    Serve Drink ✓
  </button>
</div>
    </div>
  );
};

export default ToppingStation;