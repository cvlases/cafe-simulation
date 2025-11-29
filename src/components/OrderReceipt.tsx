import { useState } from 'react';
import type { Order } from '../types';

interface OrderReceiptProps {
  order: Order;
}

const OrderReceipt = ({ order }: OrderReceiptProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: 9999
    }}>
      {/* Collapsed Tab */}
      {!isExpanded && (
        <div
          onClick={() => setIsExpanded(true)}
          style={{
            backgroundColor: '#fff9e6',
            border: '3px solid #8b7355',
            borderRadius: '0 0 12px 12px',
            padding: '12px 20px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span style={{ fontSize: '24px' }}>📋</span>
          <span style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#8b7355',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Order
          </span>
        </div>
      )}

      {/* Expanded Receipt */}
      {isExpanded && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '3px solid #8b7355',
          borderRadius: '12px',
          padding: '20px',
          minWidth: '220px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
          animation: 'slideDown 0.3s ease-out'
        }}>
          {/* Header with close button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            paddingBottom: '10px',
            borderBottom: '2px dashed #8b7355'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>📋</span>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                color: '#8b7355',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Order
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

          {/* Drink */}
          <div style={{ marginBottom: '12px' }}>
            <p style={{
              margin: '0 0 6px 0',
              fontSize: '11px',
              color: '#999',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Drink
            </p>
            <div style={{
              backgroundColor: '#fff9e6',
              padding: '10px 15px',
              borderRadius: '8px',
              border: '2px solid #f4c430',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>
                {order.drink === 'coffee' && '☕'}
                {order.drink === 'hot-chocolate' && '🍫'}
                {order.drink === 'mocha' && '🍫☕'}
              </span>
              <span style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#2d2d2d',
                fontFamily: 'Georgia, serif'
              }}>
                {order.drink === 'coffee' && 'Coffee'}
                {order.drink === 'hot-chocolate' && 'Hot Chocolate'}
                {order.drink === 'mocha' && 'Mocha'}
              </span>
            </div>
          </div>

          {/* Extras */}
          {order.extras.length > 0 ? (
            <div>
              <p style={{
                margin: '0 0 6px 0',
                fontSize: '11px',
                color: '#999',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Toppings
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {order.extras.map((extra, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#fff0f7',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '2px solid #ffe0f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>
                      {extra === 'whipped-cream' && '🍦'}
                      {extra === 'marshmallows' && '🍬'}
                      {extra === 'sprinkles' && '✨'}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#ff6bb5'
                    }}>
                      {extra === 'whipped-cream' && 'Whipped Cream'}
                      {extra === 'marshmallows' && 'Marshmallows'}
                      {extra === 'sprinkles' && 'Sprinkles'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#999',
                fontStyle: 'italic'
              }}>
                No toppings
              </p>
            </div>
          )}
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
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

export default OrderReceipt;