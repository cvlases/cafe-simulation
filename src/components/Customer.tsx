import type { Customer as CustomerType } from "../types";
import { useLayouts } from '../hooks/useLayouts';

interface CustomerProps {
  customer: CustomerType;
  imageUrl?: string; // Optional image URL
}

const Customer = ({ customer, imageUrl }: CustomerProps) => {
  const { layouts } = useLayouts();
  const layout = layouts.orderScene.elements;
  return (
    <div className="customer" style={{ position: 'relative' }}>
      {/* Customer Image */}
      {imageUrl && (
        <img 
          src={imageUrl}
          alt={customer.name}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      )}
      
      {/* Speech Bubble with Order */}
      {/* Order Speech Bubble - Cute version */}
<div style={{
  position: 'absolute',
  left: `${layout.orderBubble.x}px`,
  top: `${layout.orderBubble.y}px`,
  width: `${layout.orderBubble.width}px`,
  minHeight: `${layout.orderBubble.height}px`,
  backgroundColor: '#ffffff',
  border: '4px solid #ff9ecd',
  borderRadius: '25px',
  padding: '20px',
  boxShadow: '0 6px 16px rgba(255, 158, 205, 0.4)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
}}>
  {/* Speech bubble tail */}
  <div style={{
    position: 'absolute',
    left: '-20px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '15px solid transparent',
    borderBottom: '15px solid transparent',
    borderRight: '20px solid #ff9ecd'
  }} />
  <div style={{
    position: 'absolute',
    left: '-13px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '12px solid transparent',
    borderBottom: '12px solid transparent',
    borderRight: '16px solid #ffffff'
  }} />

  {/* Header */}
  <p style={{
    margin: 0,
    fontSize: '12px',
    color: '#ff6bb5',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1.5px'
  }}>
    I'd like...
  </p>

  {/* Drink name */}
  <p style={{
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2d2d2d',
    textAlign: 'center',
    fontFamily: 'Georgia, serif'
  }}>
    {customer.order.drink === 'coffee' && '☕ Coffee'}
    {customer.order.drink === 'hot-chocolate' && '🍫 Hot Chocolate'}
    {customer.order.drink === 'mocha' && '🍫☕ Mocha'}
  </p>

  {/* Extras */}
  {customer.order.extras.length > 0 && (
    <>
      <div style={{
        width: '80%',
        height: '2px',
        backgroundColor: '#ffe0f0',
        margin: '4px 0'
      }} />
      <p style={{
        margin: 0,
        fontSize: '11px',
        color: '#999',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        With
      </p>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        justifyContent: 'center'
      }}>
        {customer.order.extras.map((extra, index) => (
          <span
            key={index}
            style={{
              fontSize: '11px',
              backgroundColor: '#fff0f7',
              color: '#ff6bb5',
              padding: '4px 10px',
              borderRadius: '12px',
              fontWeight: 'bold',
              border: '2px solid #ffe0f0'
            }}
          >
            {extra === 'whipped-cream' && '🍦 Whipped Cream'}
            {extra === 'marshmallows' && '🍬 Marshmallows'}
            {extra === 'sprinkles' && '✨ Sprinkles'}
          </span>
        ))}
      </div>
    </>
  )}
</div>
    </div>
  );
};

export default Customer;