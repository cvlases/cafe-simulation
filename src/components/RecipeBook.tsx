import { useState } from 'react';

type DrinkRecipe = 'coffee' | 'hot-chocolate' | 'mocha';

const RecipeBook = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<DrinkRecipe>('coffee');

  const recipes = {
    coffee: {
      name: '☕ Coffee',
      emoji: '☕',
      steps: [
        '1. Take a cup from the stack',
        '2. Drag cup to coffee machine',
        '3. Wait for coffee to brew',
        '4. Add cold milk (optional)',
        '5. Serve!'
      ]
    },
    'hot-chocolate': {
      name: '🍫 Hot Chocolate',
      emoji: '🍫',
      steps: [
        '1. Take a cup from the stack',
        '2. Drag cup to counter',
        '3. Place kettle on stove and turn it on',
        '4. Wait for kettle to heat (watch temperature!)',
        '5. Pour hot milk into cup (hold button)',
        '6. Drag spoon to chocolate bowl',
        '7. Drag chocolate spoon to cup',
        '8. Hold to stir for 3 seconds',
        '9. Add toppings (optional)',
        '10. Serve!'
      ]
    },
    mocha: {
      name: '🍫☕ Mocha',
      emoji: '🍫☕',
      steps: [
        '1. Take a cup from the stack',
        '2. Drag cup to coffee machine',
        '3. Wait for coffee to brew',
        '4. Place kettle on stove and turn it on',
        '5. Wait for kettle to heat (watch temperature!)',
        '6. Pour hot milk into cup (hold button)',
        '7. Drag spoon to chocolate bowl',
        '8. Drag chocolate spoon to cup',
        '9. Hold to stir for 3 seconds',
        '10. Add toppings (optional)',
        '11. Serve!'
      ]
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 9999
    }}>
      {/* Collapsed Tab */}
      {!isExpanded && (
        <div
          onClick={() => setIsExpanded(true)}
          style={{
            backgroundColor: '#e8f5e9',
            border: '3px solid #4caf50',
            borderRadius: '12px',
            padding: '12px 20px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '24px' }}>📖</span>
          <span style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2e7d32',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Recipes
          </span>
        </div>
      )}

      {/* Expanded Recipe Book */}
      {isExpanded && (
        <div 
          style={{
            backgroundColor: '#ffffff',
            border: '3px solid #4caf50',
            borderRadius: '12px',
            padding: '20px',
            minWidth: '300px',
            maxWidth: '350px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            paddingBottom: '10px',
            borderBottom: '2px dashed #4caf50'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>📖</span>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                color: '#2e7d32',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Recipe Book
              </h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0',
                lineHeight: '1',
                transition: 'transform 0.2s',
                color: '#8b7355'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ✕
            </button>
          </div>

          {/* Recipe Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '15px'
          }}>
            {(Object.keys(recipes) as DrinkRecipe[]).map((recipe) => (
              <button
                key={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: selectedRecipe === recipe ? '#4caf50' : '#e8f5e9',
                  color: selectedRecipe === recipe ? 'white' : '#2e7d32',
                  border: selectedRecipe === recipe ? '2px solid #2e7d32' : '2px solid #4caf50',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedRecipe !== recipe) {
                    e.currentTarget.style.backgroundColor = '#c8e6c9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedRecipe !== recipe) {
                    e.currentTarget.style.backgroundColor = '#e8f5e9';
                  }
                }}
              >
                {recipes[recipe].emoji}
              </button>
            ))}
          </div>

          {/* Recipe Title */}
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '18px',
            color: '#2e7d32',
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: 'Georgia, serif'
          }}>
            {recipes[selectedRecipe].name}
          </h4>

          {/* Recipe Steps */}
          <div style={{
            backgroundColor: '#f1f8f4',
            padding: '15px',
            borderRadius: '8px',
            border: '2px solid #c8e6c9',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {recipes[selectedRecipe].steps.map((step, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '10px',
                  paddingBottom: '10px',
                  borderBottom: index < recipes[selectedRecipe].steps.length - 1 ? '1px solid #c8e6c9' : 'none'
                }}
              >
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#1b5e20',
                  lineHeight: '1.5'
                }}>
                  {step}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RecipeBook;