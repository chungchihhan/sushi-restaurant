import { useState } from "react";
import { Link } from "react-router-dom";

import { cancelOrder } from "../../../../utils/client";

import type { UserOrderHistoryData } from "@lib/shared_types";

type BuyerOrderItemProps = {
  order: UserOrderHistoryData;
  userId: string;
};

export default function BuyerOrderItem({ order, userId }: BuyerOrderItemProps) {
  const [orderStatus, setOrderStatus] = useState(order.status);
  const payload = {id: order.order_id, user_id: userId};

  const handleCancelOrder = () => {
    cancelOrder(payload);
    setOrderStatus("cancelled");
  };

  return (
    <div className={`flex items-center bg-blue-300 ${orderStatus === "cancelled" || orderStatus === "finished" ? "grayscale" : ""}`}>
      <div className="flex flex-col items-center p-4 rounded-md">
        <div className="tags flex gap-4 rounded-md">
          <div className="status-tag font-bold text-2xl p-2 bg-blue-400">{orderStatus}</div>
          <div className="date-tag font-bold text-2xl p-2 bg-green-300">{order.order_date}</div>
        </div>
        <div className="order-details font-bold text-2xl m-2">
          <div className="store">{order.shop_name}</div>
        </div>
        <div className="order-details font-bold text-3xl m-2">
          <div className="amount">${order.order_price}</div>
        </div>
      </div>
      {orderStatus !== "cancelled" && orderStatus !== "finished" && (
        <button className="bg-green-500 text-white px-4 py-2 m-2" onClick={handleCancelOrder}>
          取消訂單
        </button>
      )}
      <Link className="view-details-button font-bold bg-blue-500 rounded-full px-4 py-2" to={`/order/buyer/${userId}/${order.order_id}`}>
        查看訂單細節
      </Link>
      <div className="max-w-24 max-h-24 m-4 overflow-hidden">
        <img className="max-w-full max-h-full object-cover" src={order.shop_image} alt={order.shop_name} />
      </div>
    </div>
  );
}
