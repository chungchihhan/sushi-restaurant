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

type ShopOrder = {
  shop_name: string;
  shop_image: string;
  items: OrderItem[];
};

type OrdersByShop = {
  [shopId: string]: ShopOrder;
};

type UserOrderData = {
  user_id: string;
  orders_by_shop: OrdersByShop;
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

      const existingOrders: UserOrderData[] = [
        JSON.parse(existingOrdersString),
      ];

      const updatedOrders = existingOrders.map((order: UserOrderData) => ({
        user_id: order.user_id,
        orders_by_shop: Object.fromEntries(
          Object.entries(order.orders_by_shop).filter(
            ([shopId]) => shopId !== shop_id,
          ),
        ),
      }));

      localStorage.setItem("currentOrder", JSON.stringify(updatedOrders[0]));

      navigate(0);
    } catch (error) {
      toast.error("Error creating an order.");
    }

    onClose();
  };

  const calculateTotalAmount = () => {
    return order_items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  return (
    <div className="fixed inset-0 flex justify-center overflow-auto bg-info">
      <div className="h-auto w-2/3 rounded-lg bg-info p-6">
        <label className="mb-2 flex justify-center self-center p-3 text-center text-4xl font-bold">
          {`結帳 - ${shop_name}`}
        </label>
        <div className="flex gap-4 rounded-md bg-info p-2">
          <div className="w-1/4 self-center rounded-lg bg-slate-400 p-2 text-center text-3xl font-bold">
            品項
          </div>
          <div className="w-1/4 self-center rounded-lg bg-slate-400 p-2 text-center text-3xl font-bold">
            數量
          </div>
          <div className="w-1/4 self-center rounded-lg bg-slate-400 p-2 text-center text-3xl font-bold">
            金額
          </div>
          <div className="w-1/4 self-center rounded-lg bg-slate-400 p-2 text-center text-3xl font-bold">
            備註
          </div>
        </div>
        <div className="grid gap-4 p-2">
          {order_items.map((item) => (
            <div key={item.meal_name} className="flex gap-4 rounded-md bg-info">
              <div className="w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
                {item.meal_name}
              </div>
              <div className="w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
                {item.quantity}
              </div>
              <div className="w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
                {item.quantity * item.price}
              </div>
              <div className="w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
                {item.remark}
              </div>
            </div>
          ))}
        </div>
        <hr className="my-2 h-px border-0 dark:bg-slate-700"></hr>
        <div className="flex justify-between gap-4 rounded-lg p-2 text-2xl font-bold">
          <button
            className="flex w-1/4 items-center justify-center rounded-3xl bg-blue-500 p-2 text-center font-bold text-white hover:bg-blue-700"
            onClick={handleConfirmOrder}
          >
            確認下單
          </button>
          <button
            className="mr-3 flex w-1/4 items-center justify-center rounded-3xl bg-gray-400 p-2 text-center font-bold text-white hover:bg-gray-700"
            onClick={onClose}
          >
            返回
          </button>
          <div className="flex w-2/4 items-center justify-end text-center">
            總金額:
            <span className="ml-4 underline">${calculateTotalAmount()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDialog;
