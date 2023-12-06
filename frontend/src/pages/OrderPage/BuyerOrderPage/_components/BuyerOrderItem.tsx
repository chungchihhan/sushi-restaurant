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
  const payload = { id: order.order_id, user_id: userId };

  const handleCancelOrder = () => {
    cancelOrder(payload);
    setOrderStatus("cancelled");
  };

  return (
    <div
      className={`flex items-center bg-blue-300 ${
        orderStatus === "cancelled" || orderStatus === "finished"
          ? "grayscale"
          : ""
      }`}
    >
      <div className="flex flex-col items-center rounded-md p-4">
        <div className="tags flex gap-4 rounded-md">
          <div className="status-tag bg-blue-400 p-2 text-2xl font-bold">
            {orderStatus}
          </div>
          <div className="date-tag bg-green-300 p-2 text-2xl font-bold">
            {order.order_date}
          </div>
        </div>
        <div className="order-details m-2 text-2xl font-bold">
          <div className="store">{order.shop_name}</div>
        </div>
        <div className="order-details m-2 text-3xl font-bold">
          <div className="amount">${order.order_price}</div>
        </div>
      </div>
      {orderStatus !== "cancelled" && orderStatus !== "finished" && (
        <button
          className="m-2 bg-green-500 px-4 py-2 text-white"
          onClick={handleCancelOrder}
        >
          取消訂單
        </button>
      )}
      <Link
        className="view-details-button rounded-full bg-blue-500 px-4 py-2 font-bold"
        to={`/order/buyer/${userId}/${order.order_id}`}
      >
        查看訂單細節
      </Link>
      <div className="max-w-24 m-4 max-h-24 overflow-hidden">
        <img
          className="max-h-full max-w-full object-cover"
          src={order.shop_image}
          alt={order.shop_name}
        />
      </div>
    </div>
  );
}
