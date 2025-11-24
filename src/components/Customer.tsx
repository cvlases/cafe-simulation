import type { Customer as CustomerType } from "../types";

interface CustomerProps {
  customer: CustomerType;
  imageUrl?: string; // Optional image URL
}

const Customer = ({ customer, imageUrl }: CustomerProps) => {
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
      <div style={{
        position: 'absolute',
        top: '-80px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '15px',
        border: '3px solid black',
        minWidth: '200px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{customer.name}</p>
        <p style={{ margin: '0 0 5px 0' }}>I'd like a {customer.order.drink}</p>
        {customer.order.extras.length > 0 && (
          <p style={{ margin: 0 }}>with {customer.order.extras.join(", ")}</p>
        )}
      </div>
    </div>
  );
};

export default Customer;