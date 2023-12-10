import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getOrdersByUserId } from "../../../utils/client";
import type { UserOrderHistoryData } from "@lib/shared_types";

import CartItem from "./_components/CartItem";

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("userToken");
const isAuthenticated = token && userId;

type OrderItem = {
  meal_id: string;
  meal_name: string;
  quantity: number;
  price: number;
  remark: string;
};

type Order = {
  user_id: string;
  shop_id: string;
  order_items: OrderItem[];
  shop_name: string;
  shop_image: string;
};

const CartPage = () => {
  const orderDataString = localStorage.getItem("currentOrder");
  const orderData: Order[] = (orderDataString !== null && orderDataString !== "[]") ? [JSON.parse(orderDataString)] : [];

  return (
    <>
      <div className="order-record-overlay rounded-md p-8">
        <div className="order-record-content grid gap-4">
          {orderData.length > 0 ? (
            orderData.map((order: Order) => (
              <CartItem
                key={order.shop_id}
                user_id={order.user_id}
                shop_id={order.shop_id}
                shop_name={order.shop_name}
                shop_image={order.shop_image}
                order_items={order.order_items}
              />
            ))
          ) : (
            <div className="order-record-overlay rounded-md p-8">
              <p className="mb-4">No orders available.</p>
              <Link
                className="view-details-button m-4 rounded-full bg-slate-300 px-4 py-2 font-bold font-bold text-white hover:bg-blue-500"
                to={`/meal/`}
              >
                繼續選購
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
