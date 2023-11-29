import React from "react";
import { Link } from "react-router-dom";
import "./ShopMealItem.css";

type ShopMealItemProps = {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
};

export default function ShopMealItem({
  id,
  shop_id,
  name,
  description,
  price,
  quantity,
  category,
  image
}: ShopMealItemProps) {
  return (
    <Link className="shopmeal-item" to={`/shop/${shop_id.toLowerCase()}/${id.toLowerCase()}`}>
      <div className="shopmeal-item-img-container">
        <img src={image} alt={name} />
      </div>
      <div className="shopmeal-item-details">
        <div className="shopmeal-item-first-row">
          <span className="title-style">{name}</span>
          <span className="star-style">Star Rating</span>
        </div>
        <div className="shopmeal-item-second-row">
          <span className="price-style">{price}</span>
          <span className="foodtype-style">{category}</span>
        </div>
        <div className="shopmeal-item-description">
          <p>{description}</p>
        </div>
        <div className="shopmeal-item-quantity">
          <p>Quantity: {quantity}</p>
        </div>
      </div>
    </Link>
  );
}
