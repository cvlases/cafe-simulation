import type { Customer as CustomerType } from "../types";

interface CustomerProps {
  customer: CustomerType;
}

const Customer = ({ customer }: CustomerProps) => {
  return (
    <div className="customer">
      <h2>{customer.name}</h2>
      <p>Order: {customer.order.drink}</p>
      <p>Extras: {customer.order.extras.join(", ")}</p>
    </div>
  );
};


export default Customer;