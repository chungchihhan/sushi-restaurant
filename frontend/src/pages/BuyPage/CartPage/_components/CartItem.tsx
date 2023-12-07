import { useState } from "react";
import { Link } from "react-router-dom";

import { cancelOrder } from "../../../../utils/client";
import type { UserOrderHistoryData } from "@lib/shared_types";

import CheckoutDialog from "./CheckoutDialog";

type OrderItem = {
  meal_id: string,
  meal_name: string,
  quantity: number,
  price: number,
  remark: string,
};

type CartItemProps = {
  // order: UserOrderHistoryData;
  // userId: string;
  user_id:string;
  shop_id: string;
  shop_name: string;
  order_price: number;
  shop_image: string;
  order_items: OrderItem[];
};

export default function CartItem({ user_id, shop_id, shop_name, shop_image, order_price, order_items }: CartItemProps) {
  // const [orderStatus, setOrderStatus] = useState(order.status);

  // const payload = { id: order.order_id, user_id: userId };

  // const handleCancelOrder = () => {
  //   cancelOrder(payload);
  //   setOrderStatus("cancelled");
  // };

  const [isCheckoutDialogOpen, setCheckoutDialogOpen] = useState(false);

  const handleOpenCheckoutDialog = () => {
    setCheckoutDialogOpen(true);
  };

  const handleCloseCheckoutDialog = () => {
    setCheckoutDialogOpen(false);
  };

  return (
    <div
      className={`flex items-center bg-blue-300 `}
    >
      <div className="flex flex-col items-center rounded-md p-4">
        <div className="tags flex gap-4 rounded-md">
          <div className="status-tag bg-blue-400 p-2 text-2xl font-bold">
            店名：{shop_name}
          </div>
        </div>
        {order_items.map((item) => (
          <div key={item.meal_name} className="flex">
            <div className="order-details m-2 item-center text-2xl font-bold">
              <div className="store">{item.meal_name}</div>
            </div>
            <div className="order-details m-2 item-center text-xl font-bold">
              <div className="store">{item.remark}</div>
            </div>
            <div className="order-details m-2 item-center text-3xl font-bold">
              <div className="store">{item.quantity}</div>
            </div>
            <div className="order-details m-2 item-center text-3xl font-bold">
              <div className="amount">${item.price}</div>
            </div>
          </div>
        ))}
      </div>
      <Link
          className="view-details-button rounded-full bg-slate-300 font-bold text-white hover:bg-blue-500 px-4 py-2 m-4 font-bold"
          to={`/meal/${shop_id}`}
        >
          繼續選購
      </Link>
      <button
        className="view-details-button rounded-full bg-slate-300 font-bold text-white hover:bg-blue-500 px-4 py-2 m-4 font-bold"
        onClick={handleOpenCheckoutDialog}
      >
        前往結帳
      </button>
      <Link
          className="view-details-button rounded-full bg-slate-300 font-bold text-white hover:bg-blue-500 px-4 py-2 m-4 font-bold"
          to={`/meal/${shop_id}`}
        >
          刪除訂單
      </Link>
      {isCheckoutDialogOpen && (
        <CheckoutDialog
          user_id={user_id}
          shop_id={shop_id}
          shop_name={shop_name}
          order_price={order_price}
          order_items={order_items}
          onClose={handleCloseCheckoutDialog}
        />
      )}
    </div>
  );
}
