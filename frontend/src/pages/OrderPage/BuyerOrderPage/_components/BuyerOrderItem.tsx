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
  if (orderStatus === "waiting") {
    setOrderStatus("未確認");
  } else if (orderStatus === "inprogress") {
    setOrderStatus("製作中");
  } else if (orderStatus === "finished") {
    setOrderStatus("已完成");
  } else if (orderStatus === "cancelled") {
    setOrderStatus("已取消");
  }

  const payload = { id: order.order_id, user_id: userId };

  const handleCancelOrder = () => {
    cancelOrder(payload);
    setOrderStatus("已取消");
  };

  function addHoursAndFormat(originalTime: string): string {
    const originalDate = new Date(originalTime);
    const newDate = new Date(originalDate.getTime());

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  return (
    <div
      className={`flex items-center rounded-2xl p-2 ${
        orderStatus === "已取消" || orderStatus === "已完成"
          ? "bg-slate-400 grayscale"
          : "bg-blue-300"
      }`}
    >
      <div className="flex w-1/2 flex-col rounded-md p-4">
        <div className="flex gap-2 rounded-md">
          <div className="m-2 flex w-1/2 items-center justify-center rounded-lg bg-blue-500 p-2 text-center text-2xl font-bold">
            {orderStatus}
          </div>
          <div className="m-2 flex w-1/2 items-center justify-center rounded-lg bg-green-200 p-2 text-center text-2xl font-bold">
            {addHoursAndFormat(order.order_date)}
          </div>
        </div>
        <div className="m-2 rounded-lg bg-slate-200 p-2 text-2xl font-bold">
          <div className="ml-2">
            商店名: <span className="ml-2">{order.shop_name}</span>
          </div>
        </div>
        <div className="m-2 rounded-lg bg-slate-200 p-2 text-2xl font-bold">
          <div className="ml-2">
            總金額: <span className="ml-2 underline">${order.order_price}</span>
          </div>
        </div>
      </div>
      <div className="flex w-1/4 flex-col items-center justify-center gap-4">
        <Link
          className="w-3/4 rounded-3xl bg-blue-500 p-2 text-center font-bold text-white hover:bg-blue-700"
          to={`/order/buyer/${userId}/${order.order_id}`}
        >
          查看訂單細節
        </Link>
        {orderStatus !== "已取消" && orderStatus !== "已完成" && (
          <button
            className="w-3/4 rounded-3xl bg-slate-400 p-2 font-bold text-white hover:bg-slate-600"
            onClick={handleCancelOrder}
          >
            取消訂單
          </button>
        )}
      </div>
      <div className="m-4 flex w-1/4 items-center justify-end overflow-hidden pr-8">
        <img
          className="rounded-3xl"
          style={{ maxWidth: "80%", maxHeight: "80%" }}
          src={order.shop_image}
          alt={order.shop_name}
        />
      </div>
    </div>
  );
}
