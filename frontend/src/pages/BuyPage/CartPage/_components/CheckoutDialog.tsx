import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { createOrder } from "../../../../utils/client";
import type { CreateOrderPayload } from "@lib/shared_types";

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

type CheckoutDialogProps = {
  user_id: string;
  shop_id: string;
  shop_name: string;
  order_items: OrderItem[];
  onClose: () => void;
};

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  user_id,
  shop_id,
  shop_name,
  order_items,
  onClose,
}) => {
  const navigate = useNavigate();

  const orderData: CreateOrderPayload = {
    user_id: user_id,
    shop_id: shop_id,
    order_items: order_items,
  };

  const handleConfirmOrder = async () => {
    try {
      await createOrder(orderData);

      toast.success("Order created successfully!");
      const existingOrdersString = localStorage.getItem("currentOrder");
      if (!existingOrdersString) return;

      const existingOrders: Order[] = [JSON.parse(existingOrdersString)];
      const updatedOrders = existingOrders.filter(
        (order: Order) => order.shop_id !== shop_id,
      );

      localStorage.setItem("currentOrder", JSON.stringify(updatedOrders));

      navigate(0);
    } catch (error) {
      toast.error("Error creating an order.");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-full w-full overflow-y-auto bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{`結帳 - ${shop_name}`}</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="mb-4">
          <ul>
            {order_items.map((item) => (
              <li key={item.meal_name}>
                {`${item.meal_name} x ${item.quantity} = ${item.price}`},{" "}
                {item.remark}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end">
          <button
            className="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
            onClick={handleConfirmOrder}
          >
            確認下單
          </button>
          <button
            className="rounded bg-gray-300 px-4 py-2 text-gray-700"
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
