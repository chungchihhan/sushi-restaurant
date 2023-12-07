import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import type { CreateOrderPayload } from "@lib/shared_types";

import { createOrder } from "../../../../utils/client";

type OrderItem = {
  meal_id: string,
  meal_name: string,
  quantity: number,
  price: number,
  remark: string,
};

type CheckoutDialogProps = {
  user_id: string;
  shop_id: string;
  shop_name: string;
  order_price: number;
  order_items: OrderItem[];
  onClose: () => void;
};

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  user_id,
  shop_id,
  shop_name,
  order_price,
  order_items,
  onClose,
}) => {
  const navigate = useNavigate();

  const orderData: CreateOrderPayload = {
    user_id: user_id,
    shop_id: shop_id,
    order_items: order_items,

  };

  const handleConfirmOrder = () => {
    try {
      await createUser(orderData);

      toast.success("Order created successfully!");
      navigate("/cart");
    } catch (error) {
      toast.error("Error creating an order.");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full h-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{`結帳 - ${shop_name}`}</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="mb-4">
          <p className="mb-2">{`總金額: $${order_price}`}</p>
          <ul>
            {order_items.map((item) => (
              <li key={item.meal_name}>{`${item.meal_name} x ${item.quantity} = ${item.price}`}, {item.remark}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleConfirmOrder}
          >
            確認下單
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={onClose}
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDialog;
